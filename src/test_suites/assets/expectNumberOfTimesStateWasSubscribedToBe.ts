/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { flagManager } from './testFlags';

let countResubscribedTimes = 0;

export const _testingAssets_resubscribedTimesCounter = (): void => {
  countResubscribedTimes++;
};

export const _testingAssets_resetResubscribedTimesCounter = (): void => {
  countResubscribedTimes = 0;
};

expect.extend({
  numberOfTimesStateWasSubscribedToBe(_: null, resubscribedTimes: number) {
    if (!flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      return {
        pass: this.isNot ? false : true,
      } as jest.CustomMatcherResult;
    }

    const fixateCount = countResubscribedTimes;
    countResubscribedTimes = 0;

    if (fixateCount === resubscribedTimes) {
      return {
        pass: true,

        message: () =>
          `expected number of times components have been subscribed to state not to be ${resubscribedTimes} but it was ${fixateCount}`,
      };
    }

    return {
      pass: false,

      message: () =>
        `expected number of times components have been subscribed to state to be ${resubscribedTimes} but it was ${fixateCount}`,
    };
  },

  numberOfTimesStateWasSubscribedToBeInRange(_: null, [rangeStart, rangeEnd]: [number, number]) {
    if (!flagManager.read('SHOULD_TEST_IMPLEMENTATION')) {
      return {
        pass: this.isNot ? false : true,
      } as jest.CustomMatcherResult;
    }

    const fixateCount = countResubscribedTimes;
    countResubscribedTimes = 0;

    if (fixateCount >= rangeStart && fixateCount <= rangeEnd) {
      return {
        pass: true,

        message: () =>
          `expected number of times components have been subscribed to state not to be in range ${rangeStart} - ${rangeEnd} but it was ${fixateCount}`,
      };
    }

    return {
      pass: false,

      message: () =>
        `expected number of times components have been subscribed to state to be in range ${rangeStart} - ${rangeEnd} but it was ${fixateCount}`,
    };
  },
});

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace jest {
    interface Matchers<R> {
      numberOfTimesStateWasSubscribedToBe(resubscribedTimes: number): R;
      numberOfTimesStateWasSubscribedToBeInRange(range: [number, number]): R;
    }
  }
}
