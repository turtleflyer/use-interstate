import type { GetAccessHandler, State, StateEntry, StateMap, WayToAccessValue } from './State';
import type { Interstate } from './UseInterstateTypes';

export const createState = <M extends Interstate>(): State<M> => {
  const entriesMap = new Map<keyof M, StateEntry<M[keyof M]>>();
  let fnToAccessValue: WayToAccessValue<M>;
  let accessHandler = {} as M;

  const stateMap: StateMap<M> = {
    get: <K extends keyof M>(key: K): StateEntry<M[K]> => {
      if (entriesMap.has(key)) {
        return entriesMap.get(key) as StateEntry<M[K]>;
      }

      const newEntry: StateEntry<M[K]> = { reactTriggersList: {} };
      addKeyToState(key, newEntry);

      return newEntry;
    },

    set: <K extends keyof M>(
      key: K,
      entryProperties?: Omit<StateEntry<M[K]>, 'reactTriggersList'>
    ): StateEntry<M[K]> => {
      const newEntry: StateEntry<M[K]> = { ...(entryProperties ?? {}), reactTriggersList: {} };
      addKeyToState(key, newEntry);

      return newEntry;
    },
  };

  function addKeyToState<K extends keyof M>(key: K, entry: StateEntry<M[K]>): void {
    entriesMap.set(key, entry);

    Object.defineProperty(accessHandler, key, {
      enumerable: true,
      get: () => fnToAccessValue(key),
      configurable: false,
    });
  }

  const getAccessHandler: GetAccessHandler<M> = (wayToAccessValue: WayToAccessValue<M>): M => {
    fnToAccessValue = wayToAccessValue;

    return accessHandler;
  };

  const clearState = (): void => {
    entriesMap.clear();
    accessHandler = {} as M;
  };

  return { stateMap, getAccessHandler, clearState };
};
