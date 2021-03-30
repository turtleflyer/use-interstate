import type * as CreateStateImport from '../createState';
import { traverseLinkedList } from '../LinkedList';
import type { State, StateEntry } from '../State';
import type { InterstateKey } from '../UseInterstateTypes';

let memoizeMapOnceStateCreated: Map<InterstateKey, StateEntry<unknown>>;
let originalMap: Map<InterstateKey, StateEntry<unknown>>;

global.Map = class MockedMap extends Map {
  constructor() {
    super();
    originalMap = this;
  }
};

const { createState: originalCreateState }: typeof CreateStateImport = jest.requireActual(
  '../createState.ts'
);

const mockedCreateState = jest.fn(
  (): State => {
    const originalState = originalCreateState();
    memoizeMapOnceStateCreated = originalMap;

    return originalState;
  }
);

export type TriggersCounter = (key: InterstateKey) => number | undefined;

export const createTriggersCounter = (): TriggersCounter => {
  const memMap = memoizeMapOnceStateCreated;

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

export { mockedCreateState as createState };
