/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testReadInterstateAcceptSelector: TestCase = [
  'readInterstate.acceptSelector works',

  ({ useInterstateImport: { initInterstate } }: TestParameters): void => {
    const symbolKey = Symbol('symbol_key');

    type TestState = {
      foo: number;
      77: string;
      [symbolKey]: object;
    };

    const { setInterstate, readInterstate } = initInterstate<TestState>();

    expect(readInterstate.acceptSelector((state) => ({ ...state }))).toStrictEqual({});

    setInterstate('foo', 100);
    expect(readInterstate.acceptSelector((state) => ({ ...state }))).toStrictEqual({ foo: 100 });

    setInterstate(77, 'hi');
    expect(readInterstate.acceptSelector((state) => ({ ...state }))).toStrictEqual({
      foo: 100,
      77: 'hi',
    });

    setInterstate(symbolKey, { a: true });
    expect(readInterstate.acceptSelector((state) => ({ ...state }))).toStrictEqual({
      foo: 100,
      77: 'hi',
      [symbolKey]: { a: true },
    });
  },
];
