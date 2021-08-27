import { createState } from './createState';
import { getEntriesOfEnumerableKeys } from './getEntriesOfEnumerableKeys';
import type { LinkedList, LinkedListEntry, LinkedListNonempty } from './LinkedList';
import { addLinkedListEntry, removeLinkedListEntry, traverseLinkedList } from './LinkedList';
import type { StateEntry, TriggersListEntry, WayToAccessValue } from './State';
import type {
  GetStateUsingSelector,
  GetValue,
  GetValueFromState,
  InitValuesForSubscribing,
  ReactSubscribeState,
  ResetValue,
  SetValue,
  Store,
  SubscribeStateReturn,
} from './Store';
import type { InterstateSelector } from './UseInterstateTypes';

export function createStore<M extends object>(initStateValues?: Partial<M>): Store<M> {
  const { stateMap, getAccessHandler, clearState } = createState<M>();

  /**
   * `reactCleaningWatchList` is list of "abandoned" triggers. Trigger in React can get abandoned if
   * rendering of component is interrupted due to possible scenario in concurrent mode of React. It
   * gets registered in store most often duplicating trigger registered on second run of same
   * component. On earliest next render of any component with `useInterstate`
   * `removeTriggerFromKeyList` is being traversed through and every clean up function is being
   * called. It removes abandoned (not survived by next render stage) trigger. On `useEffect` run of
   * every component with `useInterstatePlain` it removes related function from
   * `removeTriggerFromKeyList`.
   */
  type ReactCleaningWatchList = LinkedList<ReactCleaningWatchListEntry>;

  type ReactCleaningWatchListEntry = LinkedListEntry<ReactCleaningWatchListEntry> & {
    readonly removeTriggerFromKeyList: () => void;
  };

  let reactCleaningWatchList: ReactCleaningWatchList = {};
  let [reactRenderTaskDone, reactEffectTaskDone] = [false, false];
  let reactRenderTasksPool: (() => void)[] = [];
  let reactEffectTasksPool: (() => void)[] = [];
  initState(initStateValues);

  const getValue: GetValue<M> = <K extends keyof M>(key: K): M[K] =>
    stateMap.get(key).stateValue?.value as M[K];

  const getStateUsingSelector: GetStateUsingSelector<M> = <R>(
    selector: InterstateSelector<M, R>,
    wayToAccessValue: WayToAccessValue<M>
  ): R => {
    const handler = getAccessHandler(wayToAccessValue);

    return selector(handler);
  };

  const setValue: SetValue<M> = <K extends keyof M>(key: K, value: M[K]): void => {
    const stateEntry: StateEntry<M[K]> = stateMap.get(key);
    const oldValue = stateEntry.stateValue;
    stateEntry.stateValue = { value };

    if (
      !stateEntry.reactTriggersList.triggersFired &&
      !(oldValue && Object.is(oldValue.value, value))
    ) {
      traverseLinkedList(stateEntry.reactTriggersList, ({ trigger }) => {
        trigger();
      });

      if (stateEntry.reactTriggersList.start) {
        stateEntry.reactTriggersList.triggersFired = true;
        reactRenderTasksPool.push(() => (stateEntry.reactTriggersList.triggersFired = false));
      }
    }
  };

  const resetValue: ResetValue<M> = (resetStateValue?: Partial<M>): void => {
    clearState();
    initState(resetStateValue);
    reactCleaningWatchList = {};
    [reactRenderTaskDone, reactEffectTaskDone] = [false, false];
    [reactRenderTasksPool, reactEffectTasksPool] = [[], []];
  };

  const reactRenderTask = (): void => {
    if (!reactRenderTaskDone) {
      [reactRenderTaskDone, reactEffectTaskDone] = [true, false];

      traverseLinkedList(reactCleaningWatchList, ({ removeTriggerFromKeyList }) => {
        removeTriggerFromKeyList();
      });

      reactRenderTasksPool.forEach((task) => task());
      reactRenderTasksPool = [];
      reactCleaningWatchList = {};
    }
  };

  const reactEffectTask = (): void => {
    if (!reactEffectTaskDone) {
      [reactEffectTaskDone, reactRenderTaskDone] = [true, false];
      reactEffectTasksPool.forEach((task) => task());
      reactEffectTasksPool = [];
    }
  };

  const reactSubscribeState: ReactSubscribeState<M> = <K extends keyof M, R>(
    notifyingTrigger: () => void,
    getValueFromState: GetValueFromState<M, K, R>,
    initValues?: InitValuesForSubscribing<M, K>
  ): SubscribeStateReturn<R> => {
    let calculatedValue: R;
    let mustRecalculate = false;
    let unsubscribeFromKeys: (() => void)[] = [];

    if (initValues) {
      const stateSlice = Object.fromEntries(
        initValues.map(([key, value]) => {
          const stateEntry = stateMap.get(key);

          if (value !== undefined && !stateEntry.stateValue) {
            stateEntry.stateValue = { value };

            traverseLinkedList(stateEntry.reactTriggersList, ({ trigger }) => {
              reactEffectTasksPool.push(() => {
                trigger();
              });
            });
          }

          unsubscribeFromKeys.push(createUnsubscribingFunction(stateEntry));

          return [key, stateEntry.stateValue?.value];
        })
      ) as Pick<M, K>;

      calculatedValue = getValueFromState(stateSlice);
    } else {
      calculatedValue = getStateUsingSelector(
        getValueFromState,
        <KW extends keyof M>(key: KW): M[KW] => {
          const stateEntry = stateMap.get(key);

          unsubscribeFromKeys.push(createUnsubscribingFunction(stateEntry));

          return stateEntry.stateValue?.value as M[KW];
        }
      );
    }

    function createUnsubscribingFunction<KS extends keyof M>(
      stateEntry: StateEntry<M[KS]>
    ): () => void {
      const trigger = () => {
        mustRecalculate = true;
        notifyingTrigger();
      };

      const triggerEntry = addLinkedListEntry(stateEntry.reactTriggersList, {
        trigger,
      });

      return (): void => {
        removeLinkedListEntry(
          stateEntry.reactTriggersList as LinkedListNonempty<TriggersListEntry>,
          triggerEntry
        );
      };
    }

    const unsubscribe = (): void => {
      unsubscribeFromKeys.forEach((unsubscribeFromKey) => {
        unsubscribeFromKey();
      });

      unsubscribeFromKeys = [];
    };

    const removeTriggerFromKeyList = (): void => {
      unsubscribe();
    };

    const watchListEntry = addLinkedListEntry(reactCleaningWatchList, {
      removeTriggerFromKeyList,
    });

    const removeFromWatchList = (): void => {
      removeLinkedListEntry(
        reactCleaningWatchList as LinkedListNonempty<ReactCleaningWatchListEntry>,
        watchListEntry
      );
    };

    const retrieveValue = (): R => {
      if (mustRecalculate) {
        mustRecalculate = false;
        calculatedValue = getStateUsingSelector(getValueFromState, getValue);
      }

      return calculatedValue;
    };

    return { retrieveValue, unsubscribe, removeFromWatchList };
  };

  return {
    getValue,
    getStateUsingSelector,
    setValue,
    resetValue,
    reactSubscribeState,
    reactRenderTask,
    reactEffectTask,
  };

  function initState(initV?: Partial<M>): void {
    initV &&
      getEntriesOfEnumerableKeys(initV).forEach(
        ([key, value]: [keyof M, M[keyof M] | undefined]): void => {
          value !== undefined && stateMap.set(key, { stateValue: { value } });
        }
      );
  }
}
