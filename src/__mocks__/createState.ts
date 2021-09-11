import type * as CreateStateImport from '../createState';
import type { MemCreatedMap } from '../createState';
import { traverseLinkedList } from '../LinkedList';
import type { InterstateKey } from '../UseInterstateTypes';

const { createState, _toAccessWhileTesting_getCreatedMap }: typeof CreateStateImport =
  jest.requireActual('../createState.ts');

type MockedMap = MemCreatedMap & { _countTriggers: TriggersCounter };

export type TriggersCounter = (key: InterstateKey) => number;

export const createTriggersCounter = (): TriggersCounter => {
  const memMap = _toAccessWhileTesting_getCreatedMap() as MockedMap;

  if (memMap) {
    memMap._countTriggers = function (key: InterstateKey): number {
      const stateEntry = this.current[key as any];
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

    return (key: InterstateKey): number => memMap._countTriggers(key);
  }

  return null as any;
};

export { createState };
