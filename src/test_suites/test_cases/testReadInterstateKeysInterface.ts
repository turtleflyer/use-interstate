/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testReadInterstateKeysInterface: TestCase = [
  'readInterstate array of keys interface works',

  ({ useInterstateImport: { initInterstate } }: TestParameters): void => {
    const symbolKey = Symbol('symbol_key');

    type TestState = {
      foo: number;
      77: string;
      [symbolKey]: object;
    };

    const { setInterstate, readInterstate } = initInterstate<TestState>();

    expect(readInterstate([] as (keyof TestState)[])).toStrictEqual({});
    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: undefined,
      77: undefined,
      [symbolKey]: undefined,
    });

    setInterstate('foo', 100);
    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: 100,
      77: undefined,
      [symbolKey]: undefined,
    });

    setInterstate(77, 'hi');
    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: 100,
      77: 'hi',
      [symbolKey]: undefined,
    });

    setInterstate(symbolKey, { a: true });
    expect(readInterstate(['foo', 77, symbolKey])).toStrictEqual({
      foo: 100,
      77: 'hi',
      [symbolKey]: { a: true },
    });
    expect(readInterstate(['foo', '77', symbolKey] as any)).toStrictEqual({
      foo: 100,
      77: 'hi',
      [symbolKey]: { a: true },
    });
  },
];
