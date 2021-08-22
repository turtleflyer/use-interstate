/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { ReadInterstate } from '../../useInterstate';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testInitInterstate: TestCase = [
  'Interstate initialized correctly (initInterstate)',

  ({ useInterstateImport: { initInterstate } }: TestParameters): void => {
    const symbolKey = Symbol('symbol_key');

    interface TestState {
      foo: number;
      77: string;
      [symbolKey]: object;
    }

    let readInterstate: ReadInterstate<TestState>;

    ({ readInterstate } = initInterstate({ foo: 100, 77: 'hi', [symbolKey]: { a: true } }));

    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: 100,
      77: 'hi',
      [symbolKey]: { a: true },
    });

    ({ readInterstate } = initInterstate<TestState>());

    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: undefined,
      77: undefined,
      [symbolKey]: undefined,
    });

    ({ readInterstate } = initInterstate({ foo: 1, 77: 'lo', [symbolKey]: { 0: null } }));

    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: 1,
      77: 'lo',
      [symbolKey]: { 0: null },
    });

    ({ readInterstate } = initInterstate<TestState>({
      foo: 200,
      77: undefined,
      [symbolKey]: undefined,
    }));

    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: 200,
      77: undefined,
      [symbolKey]: undefined,
    });
  },
];
