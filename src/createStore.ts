import { createState } from './createState';
import { getEntriesOfEnumerableKeys } from './getEntriesOfEnumerableKeys';
import { isFunctionParameter } from './isFunctionParameter';
import type { LinkedList, LinkedListEntry, LinkedListFilled } from './LinkedList';
import { addLinkedListEntry, removeLinkedListEntry, traverseLinkedList } from './LinkedList';
import type { StateEntry, Trigger, TriggersListEntry, WayToAccessValue } from './State';
import type {
  GetStateUsingSelector,
  GetValue,
  ReactInitKey,
  ReactKeyMethods,
  ReactTriggerMethods,
  ResetValue,
  SetValue,
  Store,
} from './Store';
import type { InterstateSelector, UseInterstateInitParam } from './UseInterstateTypes';

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
    stateMap.get(key)?.stateValue?.value as M[K];

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

  const reactInitKey: ReactInitKey<M> = <K extends keyof M>(
    key: K,
    initP?: UseInterstateInitParam<M[K]>
  ): ReactKeyMethods => {
    const stateEntry: StateEntry<M[K]> = stateMap.get(key);

    if (initP !== undefined && !stateEntry.stateValue) {
      stateEntry.stateValue = { value: isFunctionParameter(initP) ? initP() : initP };

      traverseLinkedList(stateEntry.reactTriggersList, ({ trigger }) => {
        reactEffectTasksPool.push(() => {
          trigger();
        });
      });
    }

    const addTrigger = (trigger: Trigger): ReactTriggerMethods => {
      const triggerEntry = addLinkedListEntry(stateEntry.reactTriggersList, { trigger });

      const removeTriggerFromKeyList = (): void => {
        removeLinkedListEntry(
          stateEntry.reactTriggersList as LinkedListFilled<TriggersListEntry>,
          triggerEntry
        );
      };

      const watchListEntry = addLinkedListEntry(reactCleaningWatchList, {
        removeTriggerFromKeyList,
      });

      const removeTriggerFromWatchList = (): void => {
        removeLinkedListEntry(
          reactCleaningWatchList as LinkedListFilled<ReactCleaningWatchListEntry>,
          watchListEntry
        );
      };

      return { removeTriggerFromKeyList, removeTriggerFromWatchList };
    };

    return { addTrigger };
  };

  return {
    getValue,
    getStateUsingSelector,
    setValue,
    resetValue,
    reactInitKey,
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
