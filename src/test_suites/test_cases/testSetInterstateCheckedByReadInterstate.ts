/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { TestCase, UseInterstateImport } from '../assets/TestTypes';

export const testSetInterstateCheckedByReadInterstate: TestCase = [
  'setInterstate works (checking by readInterstate)',

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

    setInterstate('foo', (p: number) => p + 1);
    expect(readInterstate(['foo', '77', symbolKey])).toStrictEqual({
      foo: 101,
      77: undefined,
      [symbolKey]: undefined,
    });

    setInterstate({ foo: 200, 77: 'hi', [symbolKey]: { a: true } });
    expect(readInterstate(['foo', '77', symbolKey])).toStrictEqual({
      foo: 200,
      77: 'hi',
      [symbolKey]: { a: true },
    });

    setInterstate({
      foo: (p: number) => p + 99,
      77: () => 'lo',
      [symbolKey]: (p: { a: boolean }) => ({ a: !p.a, b: p.a }),
    });
    expect(readInterstate(['foo', '77', symbolKey])).toStrictEqual({
      foo: 299,
      77: 'lo',
      [symbolKey]: { a: false, b: true },
    });

    setInterstate(() => ({
      foo: 2,
      77: 'no',
    }));
    expect(readInterstate(['foo', '77', symbolKey])).toStrictEqual({
      foo: 2,
      77: 'no',
      [symbolKey]: { a: false, b: true },
    });

    setInterstate((state: { foo: number; 77: string }) => ({
      foo: state.foo + 8,
      77: state[77] + ' or yes / ' + state.foo,
      [symbolKey]: { all: false },
    }));
    expect(readInterstate(['foo', '77', symbolKey])).toStrictEqual({
      foo: 10,
      77: 'no or yes / 2',
      [symbolKey]: { all: false },
    });
  },
];
