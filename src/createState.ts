import type { AccessMapHandlerAndGetKeysMethod, State, StateEntry } from './State';
import type { InterstateKey } from './UseInterstateTypes';

type MemCreatedMap = { [P in InterstateKey]?: StateEntry<unknown> };

let _toAccessWhileTesting_memCreatedMap: MemCreatedMap | null = null;

export const createState = <M extends object>(): State<M> => {
  type EntriesMap = { [P in keyof M]?: StateEntry<M[P]> };

  let entriesMap: EntriesMap = {};
  let accessMapHandler = {} as M;
  let keysCollector: (key: keyof M) => void;

  _toAccessWhileTesting_memCreatedMap = entriesMap;

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

    const getKeysBeingAccessed = (): (keyof M)[] => {
      return capturedKeys;
    };

    return { accessMapHandler, getKeysBeingAccessed };
  };

  const clearState = (): void => {
    entriesMap = {};
    accessMapHandler = {} as M;
    _toAccessWhileTesting_memCreatedMap = entriesMap;
  };

  return { getStateValue, setStateValue, getAccessMapHandler, clearState };
};

export const _toAccessWhileTesting_getCreatedMap = (): MemCreatedMap | null =>
  _toAccessWhileTesting_memCreatedMap;
