/* eslint-disable @typescript-eslint/no-magic-numbers */
import { stringifyState } from './createComponents';
import './expectCounterToIncreaseBy';
import type { TestCounter } from './expectCounterToIncreaseBy';
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
    _testingAsset_defineTriggersCounter((arg) => (arg === '_' ? 1 : NaN));
    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: true });

    expect('_').triggersNumberToBe(1);
    expect('_').triggersNumberToBeGreaterThanOrEqual(0);
    expect('_').triggersNumberToBeGreaterThanOrEqual(1);
    expect('_').not.triggersNumberToBe(2);
    expect('_').not.triggersNumberToBeGreaterThanOrEqual(2);

    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: false });

    expect('_').triggersNumberToBe(1);
    expect('_').triggersNumberToBeGreaterThanOrEqual(0);
    expect('_').triggersNumberToBeGreaterThanOrEqual(1);
    expect('_').triggersNumberToBe(2);
    expect('_').triggersNumberToBeGreaterThanOrEqual(2);
    expect('_').not.triggersNumberToBe(1);
    expect('_').not.triggersNumberToBeGreaterThanOrEqual(0);
    expect('_').not.triggersNumberToBeGreaterThanOrEqual(1);
    expect('_').not.triggersNumberToBe(2);
    expect('_').not.triggersNumberToBeGreaterThanOrEqual(2);

    _testingAsset_defineTriggersCounter((arg) => (arg === '_' ? 0 : NaN));

    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: true });

    expect('_').triggersNumberToBe(0);
    expect('_').triggersNumberToBeGreaterThanOrEqual(0);
    expect('_').not.triggersNumberToBe(1);
    expect('_').not.triggersNumberToBeGreaterThanOrEqual(1);

    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: false });

    expect('_').triggersNumberToBe(0);
    expect('_').triggersNumberToBeGreaterThanOrEqual(0);
    expect('_').triggersNumberToBe(1);
    expect('_').triggersNumberToBeGreaterThanOrEqual(1);
    expect('_').not.triggersNumberToBe(0);
    expect('_').not.triggersNumberToBeGreaterThanOrEqual(0);
    expect('_').not.triggersNumberToBe(1);
    expect('_').not.triggersNumberToBeGreaterThanOrEqual(1);
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
