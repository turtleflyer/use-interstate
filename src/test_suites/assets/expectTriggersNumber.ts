import type { InterstateKey } from '../../UseInterstateTypes';
import type { TriggersCounter } from '../../__mocks__/createState';
import { flagManager } from './testFlags';

expect.extend({
  triggersNumberToBe([triggersCounter, key]: [TriggersCounter, InterstateKey], num: number) {
    if (!flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      return {
        pass: true,
        message: () => 'expected test flag "SHOULD_TEST_IMPLEMENTATION" to be set true',
      };
    }

    const triggersNumber = triggersCounter(typeof key === 'number' ? `${key}` : key);

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

  triggersNumberToBeGreaterThanOrEqual(
    [triggersCounter, key]: [TriggersCounter, InterstateKey],
    num: number
  ) {
    if (!flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      return {
        pass: true,
        message: () => 'expected test flag "SHOULD_TEST_IMPLEMENTATION" to be set true',
      };
    }

    const triggersNumber = triggersCounter(typeof key === 'number' ? `${key}` : key);

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
        `expected number of triggers for "${key.toString()}" to be greater than ${num} or equal but received ${triggersNumber}`,
    };
  },
});

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace jest {
    interface Matchers<R> {
      triggersNumberToBe(num: number): R;
      triggersNumberToBeGreaterThanOrEqual(num: number): R;
    }
  }
}
