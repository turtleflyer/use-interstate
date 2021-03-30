import { flagManager } from './testFlags';

expect.extend({
  numberToBeConsideringFlag(r: number, e: number) {
    if (!flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      return {
        pass: true,
        message: () => 'expected test flag "SHOULD_TEST_PERFORMANCE" to be set true',
      };
    }

    if (r === e) {
      return {
        pass: true,
        message: () => `expected number not to be ${e} but received ${r}`,
      };
    }

    return {
      pass: false,
      message: () => `expected number to be ${e} but received ${r}`,
    };
  },
});

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace jest {
    interface Matchers<R> {
      numberToBeConsideringFlag(num: number): R;
    }
  }
}
