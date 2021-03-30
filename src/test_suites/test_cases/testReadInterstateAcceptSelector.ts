/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { TestCase, UseInterstateImport } from '../assets/TestTypes';

export const testReadInterstateAcceptSelector: TestCase = [
  'readInterstate.acceptSelector works',

  ({
    useInterstateImport: { goInterstate },
  }: {
    useInterstateImport: UseInterstateImport;
  }): void => {
    const symbolKey = Symbol('symbol_key');
    const { setInterstate, readInterstate } = goInterstate<{
      foo: number;
      77: string;
      [symbolKey]: object;
    }>();

    expect(readInterstate.acceptSelector((state) => ({ ...state }))).toStrictEqual({});

    setInterstate('foo', 100);
    expect(readInterstate.acceptSelector((state) => ({ ...state }))).toStrictEqual({ foo: 100 });

    setInterstate('77', 'hi');
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
