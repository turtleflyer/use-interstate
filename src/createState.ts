import type { AccessMapHandlerAndGetKeysMethod, State, StateEntry } from './State';
import type { InterstateKey } from './UseInterstateTypes';

export type MemCreatedMap = { current: { [P in InterstateKey]?: StateEntry<unknown> } };

const _toAccessWhileTesting_memCreatedMap: MemCreatedMap = { current: {} };

export const createState = <M extends object>(): State<M> => {
  type EntriesMap = { [P in keyof M]?: StateEntry<M[P]> };

  let entriesMap: EntriesMap = {};
  let accessMapHandler: EntriesMap = {};
  let keysCollector: (key: keyof M) => void;

  _toAccessWhileTesting_memCreatedMap.current = entriesMap;

  const getStateValue = <K extends keyof M>(key: K): StateEntry<M[K]> => {
    if (key in entriesMap) {
      return entriesMap[key] as StateEntry<M[K]>;
    }

    const newEntry: StateEntry<M[K]> = { reactTriggersList: {} };
    addKeyToState(key, newEntry);

    return newEntry;
  };

  const setStateValue = <K extends keyof M>(
    key: K,
    entryProperties?: Omit<StateEntry<M[K]>, 'reactTriggersList'>
  ): StateEntry<M[K]> => {
    const newEntry: StateEntry<M[K]> = { ...entryProperties, reactTriggersList: {} };
    addKeyToState(key, newEntry);

    return newEntry;
  };

  function addKeyToState<K extends keyof M>(key: K, entry: StateEntry<M[K]>): void {
    entriesMap[key] = entry;

    Object.defineProperty(accessMapHandler, key, {
      enumerable: true,
      get: () => {
        keysCollector(key);

        return entry.stateValue?.value;
      },
      configurable: false,
    });
  }

  const getAccessMapHandler = (): AccessMapHandlerAndGetKeysMethod<M> => {
    const capturedKeys: (keyof M)[] = [];

    keysCollector = (key) => {
      capturedKeys.push(key);
    };

    const getKeys = (): (keyof M)[] => {
      return capturedKeys;
    };

    return { accessMapHandler: accessMapHandler as M, getKeys };
  };

  const clearState = (): void => {
    entriesMap = {};
    accessMapHandler = {};
    _toAccessWhileTesting_memCreatedMap.current = entriesMap;
  };

  return { getStateValue, setStateValue, getAccessMapHandler, clearState };
};

export const _toAccessWhileTesting_getCreatedMap = (): MemCreatedMap =>
  _toAccessWhileTesting_memCreatedMap;
