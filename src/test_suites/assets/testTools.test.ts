/* eslint-disable @typescript-eslint/no-magic-numbers */
import { stringifyState } from './createComponents';
import './expectCounterToIncreaseBy';
import type { TestCounter } from './expectCounterToIncreaseBy';
import { _testingAssets_resubscribedTimesCounter } from './expectNumberOfTimesStateWasSubscribedToBe';
import { _testingAsset_defineTriggersCounter } from './expectTriggersNumber';
import { flagManager } from './testFlags';

jest.mock('../../createState.ts');

beforeEach(() => {
  flagManager.reset();
});

afterAll(() => {
  flagManager.reset();
});

describe('Test correctness of test tools', () => {
  test('flag manager works', () => {
    expect(flagManager.read('SHOULD_TEST_IMPLEMENTATION')).toBeFalsy();
    expect(flagManager.read('SHOULD_TEST_PERFORMANCE')).toBeFalsy();

    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: false, SHOULD_TEST_PERFORMANCE: true });

    expect(flagManager.read('SHOULD_TEST_IMPLEMENTATION')).toBeFalsy();
    expect(flagManager.read('SHOULD_TEST_PERFORMANCE')).toBeTruthy();

    flagManager.reset();

    expect(flagManager.read('SHOULD_TEST_IMPLEMENTATION')).toBeFalsy();
    expect(flagManager.read('SHOULD_TEST_PERFORMANCE')).toBeFalsy();
  });

  test('counterToIncreaseBy matcher works', () => {
    const testCounter1: TestCounter = { count: 0 };
    flagManager.set({ SHOULD_TEST_PERFORMANCE: true });

    expect(testCounter1).counterToIncreaseBy(0);
    expect(testCounter1).not.counterToIncreaseBy(2);

    testCounter1.count = 6;

    expect(testCounter1).counterToIncreaseBy(6);
    expect(testCounter1).not.counterToIncreaseBy(2);

    testCounter1.count = 7;

    expect(testCounter1).counterToIncreaseBy(1);
    expect(testCounter1).not.counterToIncreaseBy(2);

    const testCounter2: TestCounter = { count: 0 };
    flagManager.set({ SHOULD_TEST_PERFORMANCE: false });

    expect(testCounter2).counterToIncreaseBy(0);
    expect(testCounter2).not.counterToIncreaseBy(2);
    expect(testCounter2).not.counterToIncreaseBy(0);
    expect(testCounter2).counterToIncreaseBy(2);

    testCounter2.count = 6;

    expect(testCounter2).counterToIncreaseBy(6);
    expect(testCounter2).not.counterToIncreaseBy(2);
    expect(testCounter2).not.counterToIncreaseBy(6);
    expect(testCounter2).counterToIncreaseBy(2);

    testCounter2.count = 7;

    expect(testCounter2).counterToIncreaseBy(1);
    expect(testCounter2).not.counterToIncreaseBy(2);
    expect(testCounter2).not.counterToIncreaseBy(1);
    expect(testCounter2).counterToIncreaseBy(2);
  });

  test('triggersNumberToBe matchers work', () => {
    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: true });
    _testingAsset_defineTriggersCounter((arg) => (arg === '_' ? 0 : NaN));

    expect('_').triggersNumberToBe(0);
    expect('_').triggersNumberToBeInRange([0, 1]);
    expect('_').not.triggersNumberToBe(1);
    expect('_').not.triggersNumberToBeInRange([1, 2]);

    _testingAsset_defineTriggersCounter((arg) => (arg === '_' ? 10 : NaN));

    expect('_').triggersNumberToBe(10);
    expect('_').triggersNumberToBeInRange([0, 10]);
    expect('_').triggersNumberToBeInRange([10, 20]);
    expect('_').triggersNumberToBeInRange([8, 15]);
    expect('_').not.triggersNumberToBe(2);
    expect('_').not.triggersNumberToBeInRange([0, 9]);
    expect('_').not.triggersNumberToBeInRange([11, 20]);

    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: false });
    _testingAsset_defineTriggersCounter((arg) => (arg === '_' ? 0 : NaN));

    expect('_').triggersNumberToBe(0);
    expect('_').triggersNumberToBeInRange([0, 1]);
    expect('_').not.triggersNumberToBe(1);
    expect('_').not.triggersNumberToBeInRange([1, 2]);
    expect('_').not.triggersNumberToBe(0);
    expect('_').not.triggersNumberToBeInRange([0, 1]);
    expect('_').triggersNumberToBe(1);
    expect('_').triggersNumberToBeInRange([1, 2]);

    _testingAsset_defineTriggersCounter((arg) => (arg === '_' ? 10 : NaN));

    expect('_').triggersNumberToBe(10);
    expect('_').triggersNumberToBeInRange([0, 10]);
    expect('_').triggersNumberToBeInRange([10, 20]);
    expect('_').triggersNumberToBeInRange([8, 15]);
    expect('_').not.triggersNumberToBe(2);
    expect('_').not.triggersNumberToBeInRange([0, 9]);
    expect('_').not.triggersNumberToBeInRange([11, 20]);
    expect('_').not.triggersNumberToBe(10);
    expect('_').not.triggersNumberToBeInRange([0, 10]);
    expect('_').not.triggersNumberToBeInRange([10, 20]);
    expect('_').not.triggersNumberToBeInRange([8, 15]);
    expect('_').triggersNumberToBe(2);
    expect('_').triggersNumberToBeInRange([0, 9]);
    expect('_').triggersNumberToBeInRange([11, 20]);
  });

  test('numberOfTimesStateWasSubscribedToBe matchers work', () => {
    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: true });

    expect(null).numberOfTimesStateWasSubscribedToBe(0);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([0, 0]);
    expect(null).not.numberOfTimesStateWasSubscribedToBe(1);
    expect(null).not.numberOfTimesStateWasSubscribedToBeInRange([1, 5]);

    repeatSubscribeNTimes(3);
    expect(null).numberOfTimesStateWasSubscribedToBe(3);

    repeatSubscribeNTimes(4);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([3, 4]);

    repeatSubscribeNTimes(4);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([4, 5]);

    repeatSubscribeNTimes(4);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([1, 10]);

    repeatSubscribeNTimes(2);
    expect(null).not.numberOfTimesStateWasSubscribedToBe(1);

    repeatSubscribeNTimes(2);
    expect(null).not.numberOfTimesStateWasSubscribedToBeInRange([3, 4]);

    repeatSubscribeNTimes(2);
    expect(null).not.numberOfTimesStateWasSubscribedToBeInRange([0, 1]);

    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: false });

    expect(null).numberOfTimesStateWasSubscribedToBe(0);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([0, 0]);
    expect(null).not.numberOfTimesStateWasSubscribedToBe(1);
    expect(null).not.numberOfTimesStateWasSubscribedToBeInRange([1, 5]);
    expect(null).not.numberOfTimesStateWasSubscribedToBe(0);
    expect(null).not.numberOfTimesStateWasSubscribedToBeInRange([0, 0]);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([1, 5]);

    repeatSubscribeNTimes(3);
    expect(null).numberOfTimesStateWasSubscribedToBe(3);
    expect(null).not.numberOfTimesStateWasSubscribedToBe(3);

    repeatSubscribeNTimes(4);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([3, 4]);
    expect(null).not.numberOfTimesStateWasSubscribedToBeInRange([3, 4]);

    repeatSubscribeNTimes(4);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([4, 5]);
    expect(null).not.numberOfTimesStateWasSubscribedToBeInRange([4, 5]);

    repeatSubscribeNTimes(4);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([1, 10]);
    expect(null).not.numberOfTimesStateWasSubscribedToBeInRange([1, 10]);

    repeatSubscribeNTimes(2);
    expect(null).not.numberOfTimesStateWasSubscribedToBe(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);

    repeatSubscribeNTimes(2);
    expect(null).not.numberOfTimesStateWasSubscribedToBeInRange([3, 4]);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([3, 4]);

    repeatSubscribeNTimes(2);
    expect(null).not.numberOfTimesStateWasSubscribedToBeInRange([0, 1]);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([0, 1]);
  });

  test('defInterpretResult works', () => {
    expect(stringifyState(undefined)).toBe('undefined');
    expect(stringifyState(null)).toBe('null');
    expect(stringifyState('foo')).toBe('foo');
    expect(stringifyState(1)).toBe('1');
    expect(stringifyState(true)).toBe('true');
    expect(stringifyState(Symbol())).toBe('symbol(0)');

    const obj0 = {};
    expect(stringifyState(obj0)).toBe('{}');

    const obj1 = { a: true };
    expect(stringifyState(obj1)).toBe('{"a":true}');

    const obj2 = { foo: undefined };
    expect(stringifyState(obj2)).toBe('{"foo":"undefined"}');

    const obj3 = { [Symbol()]: 'hi', [Symbol()]: Symbol() };
    expect(stringifyState(obj3)).toBe('{"symbol(0)":"hi","symbol(1)":"symbol(2)"}');

    expect(stringifyState({ 0: obj0, bar: obj1, z: obj2, [Symbol()]: obj3 })).toBe(
      '{"0":{},"bar":{"a":true},"z":{"foo":"undefined"},"symbol(0)":{"symbol(1)":"hi","symbol(2)":"symbol(3)"}}'
    );
  });
});

function repeatSubscribeNTimes(n: number): void {
  for (let i = 0; i < n; i++) {
    _testingAssets_resubscribedTimesCounter();
  }
}
