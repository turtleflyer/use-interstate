import type { InterstateKey } from '../../UseInterstateTypes';
import type { _TestingAsset_TriggersCounter } from '../../__mocks__/createState';
import { flagManager } from './testFlags';

let _testingAsset_triggersCounter: _TestingAsset_TriggersCounter;

export const _testingAsset_defineTriggersCounter = (
  triggerCounter: _TestingAsset_TriggersCounter
): void => {
  _testingAsset_triggersCounter = triggerCounter;
};

expect.extend({
  triggersNumberToBe(key: InterstateKey, num: number) {
    if (!flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      return {
        pass: this.isNot ? false : true,
      } as jest.CustomMatcherResult;
    }

    checkIfCreateStateIsNotMocked();
    const triggersNumber = _testingAsset_triggersCounter(key);

    if (triggersNumber === num) {
      return {
        pass: true,

        message: () =>
          `expected number of triggers for "${key.toString()}" not to be ${num} but received ${triggersNumber}`,
      };
    }

    return {
      pass: false,

      message: () =>
        `expected number of triggers for "${key.toString()}" to be ${num} but received ${triggersNumber}`,
    };
  },

  triggersNumberToBeGreaterThanOrEqual(key: InterstateKey, num: number) {
    if (!flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      return {
        pass: this.isNot ? false : true,
      } as jest.CustomMatcherResult;
    }

    checkIfCreateStateIsNotMocked();
    const triggersNumber = _testingAsset_triggersCounter(key);

    if (triggersNumber >= num) {
      return {
        pass: true,

        message: () =>
          `expected number of triggers for "${key.toString()}" not to be less than ${num} but received ${triggersNumber}`,
      };
    }

    return {
      pass: false,

      message: () =>
        `expected number of triggers for "${key.toString()}" to be equal or greater than ${num} but received ${triggersNumber}`,
    };
  },
});

function checkIfCreateStateIsNotMocked() {
  if (!_testingAsset_triggersCounter) {
    throw Error('createState must be mocked in test case');
  }
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace jest {
    interface Matchers<R> {
      triggersNumberToBe(num: number): R;
      triggersNumberToBeGreaterThanOrEqual(num: number): R;
    }
  }
}
