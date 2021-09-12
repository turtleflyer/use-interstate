/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TriggersCounter } from '../../__mocks__/createState';
import { stringifyState } from './createComponents';
import './expectNumberToBeConsideringFlag';
import './expectTriggersNumber';
import { flagManager } from './testFlags';

describe('Test correctness of test tools', () => {
  test('flag manager works', () => {
    flagManager.reset();

    expect(flagManager.read('SHOULD_TEST_IMPLEMENTATION')).toBeFalsy();
    expect(flagManager.read('SHOULD_TEST_PERFORMANCE')).toBeFalsy();

    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: false, SHOULD_TEST_PERFORMANCE: true });

    expect(flagManager.read('SHOULD_TEST_IMPLEMENTATION')).toBeFalsy();
    expect(flagManager.read('SHOULD_TEST_PERFORMANCE')).toBeTruthy();

    flagManager.reset();

    expect(flagManager.read('SHOULD_TEST_IMPLEMENTATION')).toBeFalsy();
    expect(flagManager.read('SHOULD_TEST_PERFORMANCE')).toBeFalsy();

    flagManager.reset();
  });

  test('numberToBeConsideringFlag matcher works', () => {
    flagManager.set({ SHOULD_TEST_PERFORMANCE: true });

    expect(1).numberToBeConsideringFlag(1);
    expect(2).not.numberToBeConsideringFlag(1);

    flagManager.set({ SHOULD_TEST_PERFORMANCE: false });

    expect(1).numberToBeConsideringFlag(1);
    expect(2).numberToBeConsideringFlag(1);

    flagManager.reset();
  });

  test('triggersNumberToBe matchers work', () => {
    const triggersCounter0: TriggersCounter = (arg) => (arg === '_' ? 1 : NaN);

    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: true });

    expect([triggersCounter0, '_']).triggersNumberToBe(1);
    expect([triggersCounter0, '_']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter0, '_']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter0, '_']).not.triggersNumberToBe(2);
    expect([triggersCounter0, '_']).not.triggersNumberToBeGreaterThanOrEqual(2);

    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: false });

    expect([triggersCounter0, '_']).triggersNumberToBe(1);
    expect([triggersCounter0, '_']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter0, '_']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter0, '_']).triggersNumberToBe(2);
    expect([triggersCounter0, '_']).triggersNumberToBeGreaterThanOrEqual(2);

    const triggersCounter1: TriggersCounter = (arg) => (arg === '_' ? 0 : NaN);

    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: true });

    expect([triggersCounter1, '_']).triggersNumberToBe(0);
    expect([triggersCounter1, '_']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter1, '_']).not.triggersNumberToBe(1);
    expect([triggersCounter1, '_']).not.triggersNumberToBeGreaterThanOrEqual(1);

    flagManager.set({ SHOULD_TEST_IMPLEMENTATION: false });

    expect([triggersCounter1, '_']).triggersNumberToBe(0);
    expect([triggersCounter1, '_']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter1, '_']).triggersNumberToBe(1);
    expect([triggersCounter1, '_']).triggersNumberToBeGreaterThanOrEqual(1);

    flagManager.reset();
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
