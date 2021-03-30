/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testReadInterstateKeyInterface: TestCase = [
  'readInterstate single key interface works',

  ({ useInterstateImport: { goInterstate } }: TestParameters): void => {
    const symbolKey = Symbol('symbol_key');
    const { setInterstate, readInterstate } = goInterstate<{
      foo: number;
      77: string;
      [symbolKey]: object;
    }>();

    expect(readInterstate('foo')).toBeUndefined();
    expect(readInterstate('77')).toBeUndefined();
    expect(readInterstate(symbolKey)).toBeUndefined();

    setInterstate('foo', 100);
    expect(readInterstate('foo')).toBe(100);
    expect(readInterstate('77')).toBeUndefined();
    expect(readInterstate(symbolKey)).toBeUndefined();

    setInterstate('77', 'hi');
    expect(readInterstate('foo')).toBe(100);
    expect(readInterstate('77')).toBe('hi');
    expect(readInterstate(symbolKey)).toBeUndefined();

    setInterstate(symbolKey, { a: true });
    expect(readInterstate('foo')).toBe(100);
    expect(readInterstate('77')).toBe('hi');
    expect(readInterstate(symbolKey)).toStrictEqual({ a: true });
  },
];
