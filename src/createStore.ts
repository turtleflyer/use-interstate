import { createState } from './createState';
import { getEntriesOfEnumerableKeys } from './getEntriesOfEnumerableKeys';
import { isFunctionParameter } from './isFunctionParameter';
import type { LinkedList, LinkedListEntry, LinkedListNonempty } from './LinkedList';
import { addLinkedListEntry, removeLinkedListEntry, traverseLinkedList } from './LinkedList';
import type { StateEntry, TriggersListEntry } from './State';
import type {
  GetStateUsingSelector,
  GetValue,
  InitRecordsForSubscribing,
  ReactSubscribeState,
  ResetValue,
  SetValue,
  SetValueParm,
  Store,
  SubscribeStateMethods,
  TakeStateAndCalculateValue,
} from './Store';
import type { InterstateSelector } from './UseInterstateTypes';

let _toAccessWhileTesting_toNotifyReactSubscribeState: (() => void) | null = null;

export const createStore = <M extends object>(initStateValues?: Partial<M>): Store<M> => {
  const { getStateValue, setStateValue, getAccessMapHandler, clearState } = createState<M>();
  initState(initStateValues);

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
  let reactEffectTasksPool: (() => void)[] = [];
  let triggersBatchPool: (() => void)[] = [];

  const getValue: GetValue<M> = <K extends keyof M>(key: K): M[K] =>
    getStateValue(key).stateValue?.value as M[K];

  const getStateUsingSelector: GetStateUsingSelector<M> = <R>(
    selector: InterstateSelector<M, R>
  ): R => {
    const { accessMapHandler } = getAccessMapHandler();

    return selector(accessMapHandler);
  };

  const setValue: SetValue<M> = <K extends keyof M>(setValueParam: SetValueParm<M, K>): void => {
    const { key, needToCalculateValue, lastInSeries } = setValueParam;
    proceedReactCleaningWatchList();
    const stateEntry: StateEntry<M[K]> = getStateValue(key);
    const prevValueRecord = stateEntry.stateValue;

    const nextValue = needToCalculateValue
      ? isFunctionParameter(setValueParam.valueToCalculate)
        ? setValueParam.valueToCalculate(prevValueRecord?.value as M[K])
        : setValueParam.valueToCalculate
      : setValueParam.value;

    stateEntry.stateValue = { value: nextValue };

    if (
      stateEntry.reactTriggersList.start &&
      !stateEntry.reactTriggersList.triggersFired &&
      !(prevValueRecord && Object.is(prevValueRecord.value, nextValue))
    ) {
      stateEntry.reactTriggersList.triggersFired = true;

      triggersBatchPool.push(() => {
        stateEntry.reactTriggersList.triggersFired = false;
      });

      traverseLinkedList(stateEntry.reactTriggersList, ({ trigger }) => {
        trigger.addToTriggersBatchPool();
      });
    }

    if (lastInSeries) {
      triggersBatchPool.forEach((batchTask) => batchTask());
      triggersBatchPool = [];
    }
  };

  const resetValue: ResetValue<M> = (resetStateValue?: Partial<M>): void => {
    clearState();
    initState(resetStateValue);
    reactCleaningWatchList = {};
    [reactRenderTaskDone, reactEffectTaskDone] = [false, false];
    reactEffectTasksPool = [];
  };

  const reactRenderTask = (): void => {
    if (!reactRenderTaskDone) {
      [reactRenderTaskDone, reactEffectTaskDone] = [true, false];
      proceedReactCleaningWatchList();
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
    getValueFromState: TakeStateAndCalculateValue<M, R>,
    initRecords?: InitRecordsForSubscribing<M, K>
  ): SubscribeStateMethods<R> => {
    let calculatedValue: R;
    let mustRecalculate = false;
    let addedToTriggersBatchPool = false;
    let unsubscribeFromKeys: (() => void)[] = [];

    if (initRecords) {
      const stateSlice = Object.fromEntries(
        initRecords.map((rec) => {
          const { key, needToCalculateValue } = rec;
          const stateEntry = getStateValue(key);

          if (!stateEntry.stateValue && (needToCalculateValue || rec.initValue !== undefined)) {
            stateEntry.stateValue = {
              value: needToCalculateValue
                ? isFunctionParameter(rec.initValueToCalculate)
                  ? rec.initValueToCalculate()
                  : rec.initValueToCalculate
                : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  rec.initValue!,
            };

            traverseLinkedList(stateEntry.reactTriggersList, ({ trigger }) => {
              reactEffectTasksPool.push(() => {
                trigger.fire();
              });
            });
          }

          unsubscribeFromKeys.push(createUnsubscribingFunction(stateEntry));

          return [key, stateEntry.stateValue?.value];
        })
      ) as M;

      calculatedValue = getValueFromState(stateSlice);
    } else {
      const { accessMapHandler, getKeysBeingAccessed } = getAccessMapHandler();
      calculatedValue = getValueFromState(accessMapHandler);

      getKeysBeingAccessed().forEach((key) => {
        const stateEntry = getStateValue(key);
        unsubscribeFromKeys.push(createUnsubscribingFunction(stateEntry));
      });
    }

    const unsubscribe = (): void => {
      unsubscribeFromKeys.forEach((unsubscribeFromKey) => {
        unsubscribeFromKey();
      });

      unsubscribeFromKeys = [];
    };

    const watchListEntry = addLinkedListEntry(reactCleaningWatchList, {
      removeTriggerFromKeyList: unsubscribe,
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
        const { accessMapHandler } = getAccessMapHandler();
        calculatedValue = getValueFromState(accessMapHandler);
      }

      return calculatedValue;
    };

    _toAccessWhileTesting_toNotifyReactSubscribeState?.();

    return { retrieveValue, unsubscribe, removeFromWatchList };

    function createUnsubscribingFunction<KS extends keyof M>(
      stateEntry: StateEntry<M[KS]>
    ): () => void {
      const fire = () => {
        if (!mustRecalculate) {
          mustRecalculate = true;
          notifyingTrigger();
        }
      };

      const addToTriggersBatchPool = () => {
        if (!addedToTriggersBatchPool) {
          addedToTriggersBatchPool = true;

          triggersBatchPool.push(fire, () => {
            addedToTriggersBatchPool = false;
          });
        }
      };

      const triggerEntry = addLinkedListEntry(stateEntry.reactTriggersList, {
        trigger: { fire, addToTriggersBatchPool },
      });

      return (): void => {
        removeLinkedListEntry(
          stateEntry.reactTriggersList as LinkedListNonempty<TriggersListEntry>,
          triggerEntry
        );
      };
    }
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
          value !== undefined && setStateValue(key, { stateValue: { value } });
        }
      );
  }

  function proceedReactCleaningWatchList(): void {
    traverseLinkedList(reactCleaningWatchList, ({ removeTriggerFromKeyList }) => {
      removeTriggerFromKeyList();
    });

    reactCleaningWatchList = {};
  }
};

export const _toAccessWhileTesting_passReactSubscribeStateNotifier = (
  notifier: () => void
): void => {
  _toAccessWhileTesting_toNotifyReactSubscribeState = notifier;
};
