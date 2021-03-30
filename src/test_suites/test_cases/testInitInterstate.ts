/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { TestCase, UseInterstateImport } from '../assets/TestTypes';

export const testInitInterstate: TestCase = [
  'Interstate initialized correctly (initInterstate)',

  ({
    useInterstateImport: { goInterstate },
  }: {
    useInterstateImport: UseInterstateImport;
  }): void => {
    const symbolKey = Symbol('symbol_key');
    const { initInterstate, readInterstate } = goInterstate<{
      foo: number;
      77: string;
      [symbolKey]: object;
    }>();

    expectUndefined();

    initInterstate({ foo: 100, 77: 'hi', [symbolKey]: { a: true } });
    expectDefined();

    initInterstate();
    expectUndefined();

    initInterstate({ foo: 100, 77: 'hi', [symbolKey]: { a: true } });
    expectDefined();

    function expectUndefined() {
      expect(readInterstate.acceptSelector((state) => state)).toStrictEqual({});
      expect(readInterstate('foo')).toBeUndefined();
      expect(readInterstate('77')).toBeUndefined();
      expect(readInterstate(symbolKey)).toBeUndefined();
      expect(readInterstate.acceptSelector((state) => state)).toStrictEqual({
        foo: undefined,
        77: undefined,
        [symbolKey]: undefined,
      });
    }

    function expectDefined() {
      expect(readInterstate('foo')).toBe(100);
      expect(readInterstate('77')).toBe('hi');
      expect(readInterstate(symbolKey)).toStrictEqual({ a: true });
      expect(readInterstate.acceptSelector((state) => state)).toStrictEqual({
        foo: 100,
        77: 'hi',
        [symbolKey]: { a: true },
      });
    }
  },
];
