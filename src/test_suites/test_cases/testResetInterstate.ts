/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testResetInterstate: TestCase = [
  'resetInterstate works',

  ({ useInterstateImport: { initInterstate } }: TestParameters): void => {
    const symbolKey = Symbol('symbol_key');

    interface TestState {
      foo: number;
      77: string;
      [symbolKey]: object;
    }

    const { resetInterstate, readInterstate } = initInterstate<TestState>({
      foo: 100,
      77: 'hi',
      [symbolKey]: { a: true },
    });

    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: 100,
      77: 'hi',
      [symbolKey]: { a: true },
    });

    resetInterstate();

    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: undefined,
      77: undefined,
      [symbolKey]: undefined,
    });

    resetInterstate({ foo: 1, 77: 'lo', [symbolKey]: { 0: null } });

    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: 1,
      77: 'lo',
      [symbolKey]: { 0: null },
    });

    resetInterstate({ foo: 200, 77: undefined, [symbolKey]: undefined });

    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: 200,
      77: undefined,
      [symbolKey]: undefined,
    });
  },
];
