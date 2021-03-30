import type * as CreateStateImport from '../createState';
import { traverseLinkedList } from '../LinkedList';
import type { StateEntry } from '../State';
import type { InterstateKey } from '../UseInterstateTypes';

let originalMap: Map<InterstateKey, StateEntry<unknown>>;

global.Map = class MockedMap extends Map {
  constructor() {
    super();
    originalMap = this;
  }
};

export type TriggersCounter = (key: InterstateKey) => number | undefined;

export const createTriggersCounter = (): TriggersCounter => {
  const memMap = originalMap;

  return (key: InterstateKey): number | undefined => {
    const stateEntry = memMap.get(key);

    if (stateEntry === undefined) {
      return undefined;
    }

    let count = 0;

    traverseLinkedList(stateEntry.reactTriggersList, () => {
      count++;
    });

    return count;
  };
};

export const { createState }: typeof CreateStateImport = jest.requireActual('../createState.ts');
