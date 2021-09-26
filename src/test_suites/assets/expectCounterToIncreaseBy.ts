import { flagManager } from './testFlags';

export interface TestCounter {
  count: number;
}

const countersRecords = new WeakMap<TestCounter, number>();

expect.extend({
  counterToIncreaseBy(r: TestCounter, e: number) {
    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      return {
        pass: this.isNot ? false : true,
      } as jest.CustomMatcherResult;
    }

    const prevCount = countersRecords.get(r) ?? 0;
    countersRecords.set(r, r.count);

    if (r.count - prevCount === e) {
      return {
        pass: true,
        message: () => `expected number not to be ${e} but received ${r.count}`,
      };
    }

    return {
      pass: false,
      message: () => `expected number to be ${e} but received ${r.count}`,
    };
  },
});

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace jest {
    interface Matchers<R> {
      counterToIncreaseBy(count: number): R;
    }
  }
}
