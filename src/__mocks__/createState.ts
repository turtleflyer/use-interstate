import type * as createStateImport from '../createState';
import { traverseLinkedList } from '../LinkedList';
import type { InterstateKey } from '../UseInterstateTypes';

const { createState, _toAccessWhileTesting_getCreatedMap }: typeof createStateImport =
  jest.requireActual('../createState.ts');

export type _TestingAsset_TriggersCounter = (key: InterstateKey) => number;

export const _testingAsset_triggersCounter: _TestingAsset_TriggersCounter = (key) => {
  const createdMap = _toAccessWhileTesting_getCreatedMap();

  if (!createdMap) {
    throw Error('entriesMap has not been created');
  }

  const stateEntry = createdMap[key];
  let count = 0;

  if (stateEntry !== undefined) {
    traverseLinkedList(stateEntry.reactTriggersList, () => {
      count++;
    });
  }

  return count;
};

export { createState };
