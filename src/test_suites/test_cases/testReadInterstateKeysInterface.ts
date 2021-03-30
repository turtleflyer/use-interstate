/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { TestCase, UseInterstateImport } from '../assets/TestTypes';

export const testReadInterstateKeysInterface: TestCase = [
  'readInterstate array of keys interface works',

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

    expect(readInterstate([])).toStrictEqual({});
    expect(readInterstate(['foo', '77', symbolKey])).toStrictEqual({
      foo: undefined,
      77: undefined,
      [symbolKey]: undefined,
    });

    setInterstate('foo', 100);
    expect(readInterstate(['foo', '77', symbolKey])).toStrictEqual({
      foo: 100,
      77: undefined,
      [symbolKey]: undefined,
    });

    setInterstate('77', 'hi');
    expect(readInterstate(['foo', '77', symbolKey])).toStrictEqual({
      foo: 100,
      77: 'hi',
      [symbolKey]: undefined,
    });

    setInterstate(symbolKey, { a: true });
    expect(readInterstate(['foo', '77', symbolKey])).toStrictEqual({
      foo: 100,
      77: 'hi',
      [symbolKey]: { a: true },
    });
  },
];
