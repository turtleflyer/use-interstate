import type * as CreateStateImport from '../createState';
import { traverseLinkedList } from '../LinkedList';
import type { StateEntry } from '../State';
import type { InterstateKey } from '../UseInterstateTypes';

const { createState, _forDebugging_getCreatedMap }: typeof CreateStateImport =
  jest.requireActual('../createState.ts');

export type TriggersCounter = (key: InterstateKey) => number;

type MockedMap = Map<InterstateKey, StateEntry<unknown>> & {
  countTriggers: (key: InterstateKey) => number;
};

export const createTriggersCounter = (): TriggersCounter => {
  const memMap = _forDebugging_getCreatedMap() as MockedMap;
  if (memMap) {
    memMap.countTriggers = function (key: InterstateKey): number {
      const stateEntry = this.get(key);
      let count = 0;

      if (stateEntry !== undefined) {
        if (!('reactTriggersList' in stateEntry)) {
          throw new Error('reactTriggersList not found in stateEntry');
        }

        traverseLinkedList(stateEntry.reactTriggersList, () => {
          count++;
        });
      }

      return count;
    };

    (global as any)._memMap = memMap;

    return (key: InterstateKey): number => memMap.countTriggers(key);
  }

  return null as any;
};

export { createState };
