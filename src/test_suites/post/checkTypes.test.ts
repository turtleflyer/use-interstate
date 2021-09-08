/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IsEqual, IsTrue } from '@~internal/check-types';
import type {
  InitInterstateDev,
  InterstateMethodsDev,
  ReadInterstateDev,
  ResetInterstateDev,
  SetInterstateDev,
  UseInterstateDev,
} from '../../../lib/DevTypes';
import type {
  InitInterstate,
  InterstateKey,
  InterstateMethods,
  InterstateSelector,
  ReadInterstate,
  ResetInterstate,
  SetInterstate,
  SetInterstateParam,
  SetInterstateSchemaParam,
  UseInterstate,
  UseInterstateInitParam,
  UseInterstateSchemaParam,
} from '../../../lib/UseInterstateTypes';
import { initInterstate } from '../../../lib/use-interstate';

describe('Check types', () => {
  test('types are consistent', () => {
    const testSuite = () => {
      const SymbolKey = Symbol('uniqueSymbol');
      type SymbolKey = typeof SymbolKey;

      type TestCase01 = [
        IsTrue<IsEqual<typeof initInterstate, InitInterstate>>,
        IsTrue<IsEqual<InterstateKey, string | number | symbol>>
      ];

      const ii01 = initInterstate();
      const ii02 = initInterstate<{ 1: number; a: string; [SymbolKey]: boolean }>();
      const ii03 = initInterstate({ 1: 11 });
      const ii04 = initInterstate({ 1: 11 as const });
      const ii05 = initInterstate({ 1: 11 } as const);
      const ii06 = initInterstate<{ 1: number }>({ 1: 11 } as const);
      const ii07 = initInterstate({ 1: undefined });
      const ii08 = initInterstate<{ 1: undefined }>({ 1: undefined });
      const ii09 = initInterstate({ 1: undefined, a: 'aa', [SymbolKey]: true });
      const ii10 = initInterstate({ 1: undefined, a: 'aa' } as const);
      const ii11 = initInterstate<{ 1: number; a: string }>({ 1: undefined, a: 'aa' });
      const ii12 = initInterstate<{ 1: number; a: string }>({ 1: undefined, a: 'aa' } as const);
      const ii13 = initInterstate<{ 1: number; a: string }>({ 1: 11 });
      const ii14 = initInterstate({ 1: () => undefined, a: (): string => 'aa' });

      type TestCase02 = [
        IsTrue<IsEqual<typeof ii01, InterstateMethods<never>>>,
        IsTrue<
          IsEqual<typeof ii02, InterstateMethods<{ 1: number; a: string; [SymbolKey]: boolean }>>
        >,
        IsTrue<IsEqual<typeof ii03, InterstateMethods<{ 1: number }>>>,
        IsTrue<IsEqual<typeof ii04, InterstateMethods<{ 1: 11 }>>>,
        IsTrue<IsEqual<typeof ii05, InterstateMethods<{ 1: 11 }>>>,
        IsTrue<IsEqual<typeof ii06, InterstateMethods<{ 1: number }>>>,
        IsTrue<IsEqual<typeof ii07, InterstateMethods<{ 1: unknown }>>>,
        IsTrue<IsEqual<typeof ii08, InterstateMethods<{ 1: undefined }>>>,
        IsTrue<
          IsEqual<typeof ii09, InterstateMethods<{ 1: unknown; a: string; [SymbolKey]: boolean }>>
        >,
        IsTrue<IsEqual<typeof ii10, InterstateMethods<{ 1: unknown; a: 'aa' }>>>,
        IsTrue<IsEqual<typeof ii11, InterstateMethods<{ 1: number; a: string }>>>,
        IsTrue<IsEqual<typeof ii12, InterstateMethods<{ 1: number; a: string }>>>,
        IsTrue<IsEqual<typeof ii13, InterstateMethods<{ 1: number; a: string }>>>,
        IsTrue<IsEqual<typeof ii14, InterstateMethods<{ 1: () => undefined; a: () => string }>>>
      ];

      // @ts-expect-error
      initInterstate<{ 1: string }>({ 1: 100 });
      // @ts-expect-error
      initInterstate<{ 1: string; a: number }>({ 1: 100 });
      // @ts-expect-error
      initInterstate<{ 1: number }>({ 1: 100, a: 'a' });
      // @ts-expect-error
      initInterstate<{ 1: boolean }>([true]);
      // @ts-expect-error
      initInterstate<{ 1: boolean }>({ 0: true });

      // @ts-expect-error
      initInterstate<true>();
      // @ts-expect-error
      initInterstate<null>();
      // @ts-expect-error
      initInterstate<undefined>();
      // @ts-expect-error
      initInterstate<() => number>();
      // @ts-expect-error
      initInterstate<[number]>();
      // @ts-expect-error
      initInterstate<{}>();
      // @ts-expect-error
      initInterstate<() => { 1: number }>({ 1: 100 });

      // @ts-expect-error
      initInterstate({});
      // @ts-expect-error
      initInterstate(1);
      // @ts-expect-error
      initInterstate(true);
      // @ts-expect-error
      initInterstate(false);
      // @ts-expect-error
      initInterstate([true]);
      // @ts-expect-error
      initInterstate(() => true);
      // @ts-expect-error
      initInterstate(null);
      // @ts-expect-error
      initInterstate(undefined);

      // @ts-expect-error
      initInterstate({ a: 'aa' }, null);
      // @ts-expect-error
      initInterstate({ a: 'aa' }, null, null);
      // @ts-expect-error
      initInterstate<{ a: string }>({ a: 'aa' }, null);

      const { useInterstate, readInterstate, setInterstate, resetInterstate } = initInterstate();

      const ui01 = useInterstate('a');
      const ui02 = useInterstate(1);
      const ui03 = useInterstate(SymbolKey);
      const ui04 = useInterstate('a', undefined);
      const ui05 = useInterstate('a', null);
      const ui06 = useInterstate<string>('a');
      const ui07 = useInterstate<string>('a', undefined);
      const ui08 = useInterstate('a', 'aa');
      const ui09 = useInterstate('a', 'aa' as string);
      const ui10 = useInterstate(1, () => 100);
      const ui11 = useInterstate(1, () => 100 as const);
      const ui12 = useInterstate(SymbolKey, () => (): number => 100);
      const ui13 = useInterstate('a', { a: 'aa' });
      const ui14 = useInterstate('a', () => undefined);
      const ui15 = useInterstate(['a', 1, SymbolKey]);
      const ui16 = useInterstate(['a', 1, SymbolKey] as const);
      const ui17 = useInterstate<{ a: string; 1: number; [SymbolKey]: {} }>(['a', 1, SymbolKey]);

      const ui18 = useInterstate({
        a: 'aa',
        1: 100,
        b: { b: 'bb' },
        2: (): boolean => true,
        [SymbolKey]: undefined,
      });

      const ui19 = useInterstate(
        {
          a: 'aa',
          1: 100,
          b: { b: 'bb' },
          2: (): boolean => true,
          [SymbolKey]: undefined,
        },
        []
      );

      const ui20 = useInterstate({ a: 'aa' } as const);
      const ui21 = useInterstate({ a: 'aa' } as const, [1, 'a']);

      const ui22 = useInterstate(() => ({
        a: 'aa',
        1: 100,
        b: { b: 'bb' },
        2: (): boolean => true,
        [SymbolKey]: undefined,
      }));

      const ui23 = useInterstate(
        () => ({
          a: 'aa',
          1: 100,
          b: { b: 'bb' },
          2: (): boolean => true,
          [SymbolKey]: undefined,
        }),
        [1, 'a'] as const
      );

      const ui24 = useInterstate(() => ({ a: 'aa' } as const));
      const ui25 = useInterstate(() => ({ a: 'aa' } as const), []);

      type TestCase03 = [
        IsTrue<IsEqual<typeof ui01, unknown>>,
        IsTrue<IsEqual<typeof ui02, unknown>>,
        IsTrue<IsEqual<typeof ui03, unknown>>,
        IsTrue<IsEqual<typeof ui04, unknown>>,
        IsTrue<IsEqual<typeof ui05, null>>,
        IsTrue<IsEqual<typeof ui06, string>>,
        IsTrue<IsEqual<typeof ui07, string>>,
        IsTrue<IsEqual<typeof ui08, 'aa'>>,
        IsTrue<IsEqual<typeof ui09, string>>,
        IsTrue<IsEqual<typeof ui10, number>>,
        IsTrue<IsEqual<typeof ui11, 100>>,
        IsTrue<IsEqual<typeof ui12, () => number>>,
        IsTrue<IsEqual<typeof ui13, { a: string }>>,
        IsTrue<IsEqual<typeof ui14, undefined>>,
        IsTrue<IsEqual<typeof ui15, { a: unknown; 1: unknown; [SymbolKey]: unknown }>>,
        IsTrue<IsEqual<typeof ui16, { a: unknown; 1: unknown; [SymbolKey]: unknown }>>,
        IsTrue<IsEqual<typeof ui17, { a: string; 1: number; [SymbolKey]: {} }>>,

        IsTrue<
          IsEqual<
            typeof ui18,
            {
              a: string;
              1: number;
              b: { b: string };
              2: () => boolean;
              [SymbolKey]: undefined;
            }
          >
        >,

        IsTrue<
          IsEqual<
            typeof ui19,
            {
              a: string;
              1: number;
              b: { b: string };
              2: () => boolean;
              [SymbolKey]: undefined;
            }
          >
        >,

        IsTrue<IsEqual<typeof ui20, { a: 'aa' }>>,
        IsTrue<IsEqual<typeof ui21, { a: 'aa' }>>,

        IsTrue<
          IsEqual<
            typeof ui22,
            {
              a: string;
              1: number;
              b: { b: string };
              2: () => boolean;
              [SymbolKey]: undefined;
            }
          >
        >,

        IsTrue<
          IsEqual<
            typeof ui23,
            {
              a: string;
              1: number;
              b: { b: string };
              2: () => boolean;
              [SymbolKey]: undefined;
            }
          >
        >,

        IsTrue<IsEqual<typeof ui24, { a: 'aa' }>>,
        IsTrue<IsEqual<typeof ui25, { a: 'aa' }>>
      ];

      // @ts-expect-error
      useInterstate();
      // @ts-expect-error
      useInterstate<number>();

      // @ts-expect-error
      useInterstate<number>(1, 100);
      // @ts-expect-error
      useInterstate<number>(1, () => 100);
      // @ts-expect-error
      useInterstate<number>(true, () => 100);
      // @ts-expect-error
      useInterstate<{}>([1]);
      // @ts-expect-error
      useInterstate<{}>([]);
      // @ts-expect-error
      useInterstate<{}>({});
      // @ts-expect-error
      useInterstate<{}>(() => ({}));
      // @ts-expect-error
      useInterstate<{ 1: number }>(true);
      // @ts-expect-error
      useInterstate<{ 1: number }>({ 1: 100 });
      // @ts-expect-error
      useInterstate<{ 1: number }>(() => ({ 1: 100 }));
      // @ts-expect-error
      useInterstate<number>([0]);
      // @ts-expect-error
      useInterstate<[number]>([0]);
      // @ts-expect-error
      useInterstate<() => number>([0]);
      // @ts-expect-error
      useInterstate<{ (): number }>([0]);
      // @ts-expect-error
      useInterstate<{ (): number; 1: number }>([0]);
      // @ts-expect-error
      useInterstate<{ 1: number; a: string }>([1, 'b']);
      // @ts-expect-error
      useInterstate<{ 1: number; a: string }>([1, 'a', 'b']);

      // @ts-expect-error
      useInterstate([]);
      // @ts-expect-error
      useInterstate([1, null]);
      // @ts-expect-error
      useInterstate([true]);
      // @ts-expect-error
      useInterstate([true] as const);

      // @ts-expect-error
      useInterstate((a: unknown) => ({ 1: 100 }));
      // @ts-expect-error
      useInterstate((a: unknown, b: unknown) => ({ 1: 100 }));

      // @ts-expect-error
      useInterstate(() => [100]);
      // @ts-expect-error
      useInterstate(() => ({}));
      // @ts-expect-error
      useInterstate(() => 100);
      // @ts-expect-error
      useInterstate(() => () => 100);

      // @ts-expect-error
      useInterstate({});

      // @ts-expect-error
      useInterstate(true);
      // @ts-expect-error
      useInterstate(null);
      // @ts-expect-error
      useInterstate(undefined);

      // @ts-expect-error
      useInterstate({}, []);
      // @ts-expect-error
      useInterstate(() => ({}), []);
      // @ts-expect-error
      useInterstate((x: { a: 100 }) => x, [1]);
      // @ts-expect-error
      useInterstate((x: unknown) => ({ a: 100 }), [1]);
      // @ts-expect-error
      useInterstate([], []);
      // @ts-expect-error
      useInterstate(null, []);
      // @ts-expect-error
      useInterstate(undefined, []);
      // @ts-expect-error
      useInterstate(true, [1]);

      // @ts-expect-error
      useInterstate(1, (x: unknown) => 100);
      // @ts-expect-error
      useInterstate(1, (x: unknown) => ({}));

      // @ts-expect-error
      useInterstate([1], [1]);
      // @ts-expect-error
      useInterstate([1], true);

      // @ts-expect-error
      useInterstate({ a: 'aa' }, true);

      // @ts-expect-error
      useInterstate('a', 'aa', 'aaa');
      // @ts-expect-error
      useInterstate('a', 'aa', 'aaa', 'aaaa');
      // @ts-expect-error
      useInterstate<number>('a', 'aa', 'aaa');

      const uias01 = useInterstate.acceptSelector((state: { a: boolean; b: boolean[] }) => [
        ...state.b,
        state.a,
      ]);

      const uias02 = useInterstate.acceptSelector(
        (state: { [SymbolKey]: number; 1: (x: number) => string }) => state[1](state[SymbolKey])
      );

      const uias03 = useInterstate.acceptSelector(
        ({ a, b }: { a: number | null; b: number | null }) => a && b && a + b
      );

      const uias04 = useInterstate.acceptSelector(
        ({ a, b }: { a: number | null; b: number | null }) => a && b && a + b,
        []
      );

      const uias05 = useInterstate.acceptSelector(
        ({ a, b }: { a: number | null; b: number | null }) => a && b && a + b,
        [1, 'a'] as const
      );

      type TestCase04 = [
        IsTrue<IsEqual<typeof uias01, boolean[]>>,
        IsTrue<IsEqual<typeof uias02, string>>,
        IsTrue<IsEqual<typeof uias03, number | null>>,
        IsTrue<IsEqual<typeof uias04, number | null>>,
        IsTrue<IsEqual<typeof uias05, number | null>>
      ];

      // @ts-expect-error
      useInterstate.acceptSelector();
      // @ts-expect-error
      useInterstate.acceptSelector<number>();

      // @ts-expect-error
      useInterstate.acceptSelector((state, x: unknown) => ({ ...state }));

      // @ts-expect-error
      useInterstate.acceptSelector(1);
      // @ts-expect-error
      useInterstate.acceptSelector([1]);
      // @ts-expect-error
      useInterstate.acceptSelector({ a: null });
      // @ts-expect-error
      useInterstate.acceptSelector({ a: () => null });
      // @ts-expect-error
      useInterstate.acceptSelector(null);
      // @ts-expect-error
      useInterstate.acceptSelector(undefined);

      // @ts-expect-error
      useInterstate.acceptSelector((state, x: unknown) => ({ ...state }), []);

      // @ts-expect-error
      useInterstate.acceptSelector(1, []);
      // @ts-expect-error
      useInterstate.acceptSelector(true, [true]);

      // @ts-expect-error
      useInterstate.acceptSelector(1, 1);
      // @ts-expect-error
      useInterstate.acceptSelector(true, true);

      // @ts-expect-error
      useInterstate.acceptSelector(() => 1, 1);
      // @ts-expect-error
      useInterstate.acceptSelector(() => 1, true);

      // @ts-expect-error
      useInterstate.acceptSelector<number>(() => 100);

      // @ts-expect-error
      useInterstate.acceptSelector(() => 100, [], []);
      // @ts-expect-error
      useInterstate.acceptSelector(() => 100, [], [], []);
      // @ts-expect-error
      useInterstate.acceptSelector<number>(() => 100, [], []);

      const ri01 = readInterstate('a');
      const ri02 = readInterstate(1);
      const ri03 = readInterstate(SymbolKey);
      const ri04 = readInterstate<string>('a');
      const ri05 = readInterstate(['a', 1, SymbolKey]);
      const ri06 = readInterstate(['a', 1, SymbolKey] as const);
      const ri07 = readInterstate<{ a: string; 1: number; [SymbolKey]: {} }>(['a', 1, SymbolKey]);

      type TestCase05 = [
        IsTrue<IsEqual<typeof ri01, unknown>>,
        IsTrue<IsEqual<typeof ri02, unknown>>,
        IsTrue<IsEqual<typeof ri03, unknown>>,
        IsTrue<IsEqual<typeof ri04, string>>,
        IsTrue<IsEqual<typeof ri05, { a: unknown; 1: unknown; [SymbolKey]: unknown }>>,
        IsTrue<IsEqual<typeof ri06, { a: unknown; 1: unknown; [SymbolKey]: unknown }>>,
        IsTrue<IsEqual<typeof ri07, { a: string; 1: number; [SymbolKey]: {} }>>
      ];

      // @ts-expect-error
      readInterstate();
      // @ts-expect-error
      readInterstate<number>();

      // @ts-expect-error
      readInterstate<number>(() => 100);
      // @ts-expect-error
      readInterstate<number>(true);
      // @ts-expect-error
      readInterstate<number>([0]);
      // @ts-expect-error
      readInterstate<{}>([1]);
      // @ts-expect-error
      readInterstate<{}>({});
      // @ts-expect-error
      readInterstate<{}>(() => ({}));
      // @ts-expect-error
      readInterstate<{ 1: number; a: string }>([1, 'b']);
      // @ts-expect-error
      readInterstate<{ 1: number; a: string }>([1, 'a', 'b']);
      // @ts-expect-error
      readInterstate<{ 1: number }>(true);
      // @ts-expect-error
      readInterstate<{ 1: number }>({ 1: 100 });
      // @ts-expect-error
      readInterstate<{ 1: number }>(() => ({ 1: 100 }));
      // @ts-expect-error
      readInterstate<number>([0]);

      // @ts-expect-error
      readInterstate([]);
      // @ts-expect-error
      readInterstate([1, null]);
      // @ts-expect-error
      readInterstate([true]);
      // @ts-expect-error
      readInterstate([true] as const);

      // @ts-expect-error
      readInterstate(() => ({}));
      // @ts-expect-error
      readInterstate({});
      // @ts-expect-error
      readInterstate({ a: 'aa' });
      // @ts-expect-error
      readInterstate(true);
      // @ts-expect-error
      readInterstate(null);
      // @ts-expect-error
      readInterstate(undefined);

      // @ts-expect-error
      readInterstate('a', 'aa');
      // @ts-expect-error
      readInterstate('a', 'aa', 'aaa');
      // @ts-expect-error
      readInterstate<number>('a', 'aa');

      const rias01 = readInterstate.acceptSelector((state: { a: boolean; b: boolean[] }) => [
        ...state.b,
        state.a,
      ]);

      const rias02 = readInterstate.acceptSelector(
        (state: { [SymbolKey]: number; 1: (x: number) => string }) => state[1](state[SymbolKey])
      );

      const rias03 = readInterstate.acceptSelector(
        ({ a, b }: { a: number | null; b: number | null }) => a && b && a + b
      );

      type TestCase06 = [
        IsTrue<IsEqual<typeof rias01, boolean[]>>,
        IsTrue<IsEqual<typeof rias02, string>>,
        IsTrue<IsEqual<typeof rias03, number | null>>
      ];

      // @ts-expect-error
      readInterstate.acceptSelector();
      // @ts-expect-error
      readInterstate.acceptSelector<number>();

      // @ts-expect-error
      readInterstate.acceptSelector((state: { a: string }, x: unknown) => ({ ...state }));

      // @ts-expect-error
      readInterstate.acceptSelector(1);
      // @ts-expect-error
      readInterstate.acceptSelector([1]);
      // @ts-expect-error
      readInterstate.acceptSelector({ a: null });
      // @ts-expect-error
      readInterstate.acceptSelector({ a: () => null });
      // @ts-expect-error
      readInterstate.acceptSelector(null);
      // @ts-expect-error
      readInterstate.acceptSelector(undefined);

      // @ts-expect-error
      readInterstate.acceptSelector<number>(() => 100);

      // @ts-expect-error
      readInterstate.acceptSelector(() => 100, 100);
      // @ts-expect-error
      readInterstate.acceptSelector(() => 100, 100, 100);
      // @ts-expect-error
      readInterstate.acceptSelector<number>(() => 100, 100);

      setInterstate('a', 'aa');
      setInterstate(1, () => 100);
      setInterstate(SymbolKey, [true]);
      setInterstate('a', undefined);
      setInterstate('a', (prevValue: number) => prevValue + 1);
      setInterstate({ 1: 100, a: 'aa', [SymbolKey]: [true] });
      setInterstate({ 1: () => 100, a: undefined, b: { b: 'bb' } });
      setInterstate(() => ({ 1: 100, a: 'aa', [SymbolKey]: [true] }));
      setInterstate(() => ({ 1: () => 100, a: undefined, b: { b: 'bb' } }));
      setInterstate((prevState: { a: number }) => ({ a: prevState.a + 1 }));
      setInterstate((prevState: { a: number }) => ({ a: 100, b: prevState.a + 1 }));
      setInterstate((prevState: { a: number }) => ({ b: prevState.a + 1 }));

      setInterstate((prevState: { a: number; b: string }) =>
        prevState.a > 0 ? { b: `${prevState.a}` } : { a: prevState.b.length }
      );

      // @ts-expect-error
      setInterstate();
      // @ts-expect-error
      setInterstate<string>();

      // @ts-expect-error
      setInterstate<string>('a', 'aa');
      // @ts-expect-error
      setInterstate<string>('a', (prevValue: string) => prevValue + 'aa');
      // @ts-expect-error
      setInterstate<{ a: string }>({ a: 'aa' });
      // @ts-expect-error
      setInterstate<{ a: string }>(true);

      // @ts-expect-error
      setInterstate((prevState: { a: number }) => ({ a: `${prevState.a}` }));
      // @ts-expect-error
      setInterstate((prevState: { a: number }, x: unknown) => ({ a: prevState.a }));
      // @ts-expect-error
      setInterstate((prevState: { a: string; 1: number }) => ({ b: prevState[1], 1: prevState.a }));
      // @ts-expect-error
      setInterstate(() => 100);
      // @ts-expect-error
      setInterstate(() => ({}));
      // @ts-expect-error
      setInterstate((prevState: { a: string }) => ({}));
      // @ts-expect-error
      setInterstate((prevState: {}) => ({ ...prevState, a: 'aa' }));

      // @ts-expect-error
      setInterstate({});

      // @ts-expect-error
      setInterstate(1);
      // @ts-expect-error
      setInterstate([1]);
      // @ts-expect-error
      setInterstate(true);
      // @ts-expect-error
      setInterstate(null);
      // @ts-expect-error
      setInterstate(undefined);

      // @ts-expect-error
      setInterstate(null, null);
      // @ts-expect-error
      setInterstate(true, () => 100);

      // @ts-expect-error
      setInterstate('a', (prevValue: number) => `${prevValue}`);
      // @ts-expect-error
      setInterstate('a', (prevValue: number, x: unknown) => prevValue);

      // @ts-expect-error
      setInterstate('a', 'aa', 'aaa');
      // @ts-expect-error
      setInterstate('a', 'aa', 'aaa', 'aaaa');
      // @ts-expect-error
      setInterstate<string>('a', 'aa', 'aaa');

      resetInterstate();
      resetInterstate({ 1: 11 });
      resetInterstate({ 1: 11 as const });
      resetInterstate({ 1: 11 } as const);
      resetInterstate({ 1: undefined });
      resetInterstate({ 1: undefined, a: 'aa', [SymbolKey]: true });
      resetInterstate({ 1: undefined, a: 'aa' } as const);
      resetInterstate({ 1: () => undefined, a: (): string => 'aa' });

      // @ts-expect-error
      resetInterstate<{ a: string }>({ a: 'aa' }, 'aaa');
      // @ts-expect-error
      resetInterstate<{ 1: string }>({ 1: 100 });
      // @ts-expect-error
      resetInterstate<{ 1: string; a: number }>({ 1: 100 });
      // @ts-expect-error
      resetInterstate<{ 1: number }>({ 1: 100, a: 'a' });
      // @ts-expect-error
      resetInterstate<{ 0: boolean }>([true]);
      // @ts-expect-error
      resetInterstate<{ 0: boolean }>({ 0: true });
      // @ts-expect-error
      resetInterstate<{ 0: boolean }>(() => ({ 0: true }));
      // @ts-expect-error
      resetInterstate<true>();
      // @ts-expect-error
      resetInterstate<null>();
      // @ts-expect-error
      resetInterstate<undefined>();
      // @ts-expect-error
      resetInterstate<() => number>();
      // @ts-expect-error
      resetInterstate<[number]>();
      // @ts-expect-error
      resetInterstate<{}>();
      // @ts-expect-error
      resetInterstate<{ a: string }>();
      // @ts-expect-error
      resetInterstate<() => { 1: number }>({ 1: 100 });

      // @ts-expect-error
      resetInterstate(1);
      // @ts-expect-error
      resetInterstate(true);
      // @ts-expect-error
      resetInterstate([true]);
      // @ts-expect-error
      resetInterstate({});
      // @ts-expect-error
      resetInterstate(() => true);
      // @ts-expect-error
      resetInterstate(null);
      // @ts-expect-error
      resetInterstate(undefined);

      // @ts-expect-error
      resetInterstate({ a: 'aa' }, null);
      // @ts-expect-error
      resetInterstate({ a: 'aa' }, null, null);
      // @ts-expect-error
      resetInterstate<{ a: string }>({ a: 'aa' }, null);

      interface State {
        0: boolean;
        a: string;
        [SymbolKey]: [boolean];
        2: { two: number };
        b: string | object;
        3: number | undefined;
        c: unknown;
        d: object;
        e: () => number;
      }

      const {
        useInterstate: useInterstateDefined,
        readInterstate: readInterstateDefined,
        setInterstate: setInterstateDefined,
        resetInterstate: resetInterstateDefined,
      } = initInterstate<State>();

      const uidef01 = useInterstateDefined('a');
      const uidef02 = useInterstateDefined(3);
      const uidef03 = useInterstateDefined('a', undefined);
      const uidef04 = useInterstateDefined(3, undefined);
      const uidef05 = useInterstateDefined('a', 'aa');
      const uidef06 = useInterstateDefined(3, 100);
      const uidef07 = useInterstateDefined(2, { two: 100 });
      const uidef08 = useInterstateDefined(SymbolKey, [true] as const);
      const uidef09 = useInterstateDefined(SymbolKey, () => [true] as const);
      const uidef10 = useInterstateDefined('b', 'bb');
      const uidef11 = useInterstateDefined('b', { b: 'bb' });
      const uidef12 = useInterstateDefined('b', () => (Math.random() > 0.5 ? 'bb' : { b: 'bb' }));
      const uidef13 = useInterstateDefined(3, () => undefined);
      const uidef14 = useInterstateDefined('c', 100);
      const uidef15 = useInterstateDefined('c', () => () => 100);
      const uidef16 = useInterstateDefined('d', { d: 'dd' });
      const uidef17 = useInterstateDefined('e', () => () => 100);
      const uidef18 = useInterstateDefined([0, 'a', SymbolKey, 2, 'b', 3, 'c', 'd', 'e']);
      const uidef19 = useInterstateDefined([0, 'a', SymbolKey, 2, 'b', 3, 'c', 'd', 'e'] as const);

      const uidef20 = useInterstateDefined({
        a: 'aa',
        [SymbolKey]: [true],
        2: { two: 100 },
        3: undefined,
        e: () => 100,
      });

      const uidef21 = useInterstateDefined({
        [SymbolKey]: [true] as const,
        b: 'bb',
        3: 100,
        c: 100,
      });

      const uidef22 = useInterstateDefined(
        {
          [SymbolKey]: [true] as const,
          b: 'bb',
          3: 100,
          c: 100,
        },
        []
      );

      const uidef23 = useInterstateDefined({
        b: { b: 'bb' },
        c: () => 100,
        d: { d: 'dd' },
      });

      const uidef24 = useInterstateDefined(
        {
          b: { b: 'bb' },
          c: () => 100,
          d: { d: 'dd' },
        },
        [1, 'a'] as const
      );

      const uidef25 = useInterstateDefined(() => ({
        a: 'aa',
        [SymbolKey]: [true] as const,
        2: { two: 100 },
        b: 'bb',
        3: undefined,
        e: () => 100,
      }));

      const uidef26 = useInterstateDefined(() => ({ b: { b: 'bb' }, 3: 100, c: 100 }));
      const uidef27 = useInterstateDefined(() => ({ b: { b: 'bb' }, 3: 100, c: 100 }), [1, 'a']);

      const uidef28 = useInterstateDefined(() => ({
        b: Math.random() > 0.5 ? 'bb' : { b: 'bb' },
        c: () => 100,
        d: { d: 'dd' },
      }));

      type TestCase07 = [
        IsTrue<IsEqual<typeof uidef01, string>>,
        IsTrue<IsEqual<typeof uidef02, number | undefined>>,
        IsTrue<IsEqual<typeof uidef03, string>>,
        IsTrue<IsEqual<typeof uidef04, number | undefined>>,
        IsTrue<IsEqual<typeof uidef05, string>>,
        IsTrue<IsEqual<typeof uidef06, number | undefined>>,
        IsTrue<IsEqual<typeof uidef07, { two: number }>>,
        IsTrue<IsEqual<typeof uidef08, [boolean]>>,
        IsTrue<IsEqual<typeof uidef09, [boolean]>>,
        IsTrue<IsEqual<typeof uidef10, string | object>>,
        IsTrue<IsEqual<typeof uidef11, string | object>>,
        IsTrue<IsEqual<typeof uidef12, string | object>>,
        IsTrue<IsEqual<typeof uidef13, number | undefined>>,
        IsTrue<IsEqual<typeof uidef14, unknown>>,
        IsTrue<IsEqual<typeof uidef15, unknown>>,
        IsTrue<IsEqual<typeof uidef16, object>>,
        IsTrue<IsEqual<typeof uidef17, () => number>>,

        IsTrue<
          IsEqual<
            typeof uidef18,
            {
              0: boolean;
              a: string;
              [SymbolKey]: [boolean];
              2: { two: number };
              b: string | object;
              3: number | undefined;
              c: unknown;
              d: object;
              e: () => number;
            }
          >
        >,

        IsTrue<
          IsEqual<
            typeof uidef19,
            {
              0: boolean;
              a: string;
              [SymbolKey]: [boolean];
              2: { two: number };
              b: string | object;
              3: number | undefined;
              c: unknown;
              d: object;
              e: () => number;
            }
          >
        >,

        IsTrue<
          IsEqual<
            typeof uidef20,
            {
              a: string;
              [SymbolKey]: [boolean];
              2: { two: number };
              3: number | undefined;
              e: () => number;
            }
          >
        >,

        IsTrue<
          IsEqual<
            typeof uidef21,
            { [SymbolKey]: [boolean]; b: string | object; 3: number | undefined; c: unknown }
          >
        >,

        IsTrue<
          IsEqual<
            typeof uidef22,
            { [SymbolKey]: [boolean]; b: string | object; 3: number | undefined; c: unknown }
          >
        >,

        IsTrue<IsEqual<typeof uidef23, { b: string | object; c: unknown; d: object }>>,

        IsTrue<IsEqual<typeof uidef24, { b: string | object; c: unknown; d: object }>>,

        IsTrue<
          IsEqual<
            typeof uidef25,
            {
              a: string;
              [SymbolKey]: [boolean];
              2: { two: number };
              b: string | object;
              3: number | undefined;
              e: () => number;
            }
          >
        >,

        IsTrue<IsEqual<typeof uidef26, { b: string | object; 3: number | undefined; c: unknown }>>,
        IsTrue<IsEqual<typeof uidef27, { b: string | object; 3: number | undefined; c: unknown }>>,
        IsTrue<IsEqual<typeof uidef28, { b: string | object; c: unknown; d: object }>>
      ];

      // @ts-expect-error
      useInterstateDefined();
      // @ts-expect-error
      useInterstateDefined<'a'>();

      // @ts-expect-error
      useInterstateDefined<'a'>('a');
      // @ts-expect-error
      useInterstateDefined<'a'>('a', 'aa');
      // @ts-expect-error
      useInterstateDefined<'a'>({ a: 'aa' });
      // @ts-expect-error
      useInterstateDefined<'a'>(() => ({ a: 'aa' }));

      // @ts-expect-error
      useInterstateDefined(['a', 1]);
      // @ts-expect-error
      useInterstateDefined(['a', null]);
      // @ts-expect-error
      useInterstateDefined([]);
      // @ts-expect-error
      useInterstateDefined([true]);
      // @ts-expect-error
      useInterstateDefined([true] as const);

      // @ts-expect-error
      useInterstateDefined((x: unknown) => ({ a: 'aa' }));

      // @ts-expect-error
      useInterstateDefined(() => 100);
      // @ts-expect-error
      useInterstateDefined(() => [true]);
      // @ts-expect-error
      useInterstateDefined(() => [true] as const);
      // @ts-expect-error
      useInterstateDefined(() => ({ a: () => 'aa' }));
      // @ts-expect-error
      useInterstateDefined(() => ({ e: {} }));
      // @ts-expect-error
      useInterstateDefined(() => ({ 1: 100 }));
      // @ts-expect-error
      useInterstateDefined(() => ({}));
      // @ts-expect-error
      useInterstateDefined(() => ({ a: 'aa', 1: 100 }));
      // @ts-expect-error
      useInterstateDefined(() => () => ({ a: 'aa' }));
      // @ts-expect-error
      useInterstateDefined(() => ({ [SymbolKey]: [true] }));

      // @ts-expect-error
      useInterstateDefined({ a: () => 'aa' });
      // @ts-expect-error
      useInterstateDefined({ e: {} });
      // @ts-expect-error
      useInterstateDefined({ 1: 100 });
      // @ts-expect-error
      useInterstateDefined({});
      // @ts-expect-error
      useInterstateDefined({ a: 'aa', 1: 100 });
      // @ts-expect-error
      useInterstateDefined({ e: () => () => 100 });

      // @ts-expect-error
      useInterstateDefined(1);
      // @ts-expect-error
      useInterstateDefined(true);
      // @ts-expect-error
      useInterstateDefined(null);
      // @ts-expect-error
      useInterstateDefined(undefined);

      // @ts-expect-error
      useInterstateDefined([], true);
      // @ts-expect-error
      useInterstateDefined({}, []);
      // @ts-expect-error
      useInterstateDefined([2, 'g'], []);
      // @ts-expect-error
      useInterstateDefined({ a: 'aa', 2: undefined }, true);
      // @ts-expect-error
      useInterstateDefined({ a: 'aa', 2: 100 }, true);
      // @ts-expect-error
      useInterstateDefined(() => ({ a: 'aa', 2: undefined }), true);
      // @ts-expect-error
      useInterstateDefined({ a: 'aa', 1: 100 }, true);
      // @ts-expect-error
      useInterstateDefined(1, []);
      // @ts-expect-error
      useInterstateDefined(null, null);
      // @ts-expect-error
      useInterstateDefined(undefined, []);
      // @ts-expect-error
      useInterstateDefined([true], []);
      // @ts-expect-error
      useInterstateDefined(() => [true], []);

      // @ts-expect-error
      useInterstateDefined('e', {});
      // @ts-expect-error
      useInterstateDefined('e', () => 100);
      // @ts-expect-error
      useInterstateDefined('e', (x: unknown) => () => 100);

      // @ts-expect-error
      useInterstateDefined('a', () => 100);
      // @ts-expect-error
      useInterstateDefined('a', null);
      // @ts-expect-error
      useInterstateDefined('a', (x: unknown) => 'aa');
      // @ts-expect-error
      useInterstateDefined('d', 100);
      // @ts-expect-error
      useInterstateDefined('d', (x: unknown) => ({ a: 'aa' }));

      // @ts-expect-error
      useInterstateDefined(['a'], []);
      // @ts-expect-error
      useInterstateDefined(['a'] as const, []);
      // @ts-expect-error
      useInterstateDefined([2, 'c'], true);

      // @ts-expect-error
      useInterstateDefined({ a: 'aa' }, true);
      // @ts-expect-error
      useInterstateDefined({ [SymbolKey]: [true] as const }, 1);
      // @ts-expect-error
      useInterstateDefined(() => ({ a: 'aa' }), true);
      // @ts-expect-error
      useInterstateDefined(() => ({ [SymbolKey]: [true] as const }), 'aa');

      // @ts-expect-error
      useInterstateDefined('a', 'aa', 'aaa');
      // @ts-expect-error
      useInterstateDefined('a', 'aa', 'aaa', 'aaaa');
      // @ts-expect-error
      useInterstateDefined<'a'>('a', 'aa', 'aaa');

      const uidefas01 = useInterstateDefined.acceptSelector((state) => state.a);

      const uidefas02 = useInterstateDefined.acceptSelector(
        ({ a, b }) => a + (typeof b === 'string' ? b : '')
      );

      const uidefas03 = useInterstateDefined.acceptSelector(({ a, e }) => (a.length > 0 ? a : e()));
      const uidefas04 = useInterstateDefined.acceptSelector((state) => ({ ...state }));
      const uidefas05 = useInterstateDefined.acceptSelector(({ a, d }) => ({ [a]: d }));
      const uidefas06 = useInterstateDefined.acceptSelector(({ a, d }) => ({ [a]: d }), []);

      const uidefas07 = useInterstateDefined.acceptSelector(({ a, d }) => ({ [a]: d }), [
        1,
        'a',
      ] as const);

      type TestCase08 = [
        IsTrue<IsEqual<typeof uidefas01, string>>,
        IsTrue<IsEqual<typeof uidefas02, string>>,
        IsTrue<IsEqual<typeof uidefas03, string | number>>,
        IsTrue<IsEqual<typeof uidefas04, State>>,
        IsTrue<IsEqual<typeof uidefas05, { [K: string]: object }>>,
        IsTrue<IsEqual<typeof uidefas06, { [K: string]: object }>>,
        IsTrue<IsEqual<typeof uidefas07, { [K: string]: object }>>
      ];

      // @ts-expect-error
      useInterstateDefined.acceptSelector();
      // @ts-expect-error
      useInterstateDefined.acceptSelector<number>();

      // @ts-expect-error
      useInterstateDefined.acceptSelector((state: { a: number }) => state.a);
      // @ts-expect-error
      useInterstateDefined.acceptSelector((state: State, x: unknown) => state.a);
      // @ts-expect-error
      useInterstateDefined.acceptSelector(2);
      // @ts-expect-error
      useInterstateDefined.acceptSelector([2]);
      // @ts-expect-error
      useInterstateDefined.acceptSelector({ a: 'aa' });
      // @ts-expect-error
      useInterstateDefined.acceptSelector(true);
      // @ts-expect-error
      useInterstateDefined.acceptSelector(false);
      // @ts-expect-error
      useInterstateDefined.acceptSelector([true]);
      // @ts-expect-error
      useInterstateDefined.acceptSelector(null);
      // @ts-expect-error
      useInterstateDefined.acceptSelector(undefined);

      // @ts-expect-error
      useInterstateDefined.acceptSelector(1, []);
      // @ts-expect-error
      useInterstateDefined.acceptSelector(true, [true]);

      // @ts-expect-error
      useInterstateDefined.acceptSelector(1, 1);
      // @ts-expect-error
      useInterstateDefined.acceptSelector(true, true);

      // @ts-expect-error
      useInterstateDefined.acceptSelector(() => 1, 1);
      // @ts-expect-error
      useInterstateDefined.acceptSelector((state: State) => state.a, true);

      // @ts-expect-error
      useInterstateDefined.acceptSelector<string>((state: { a: string }) => state.a);

      // @ts-expect-error
      useInterstateDefined.acceptSelector((state) => state.a, [], []);
      // @ts-expect-error
      useInterstateDefined.acceptSelector((state) => state.a, [], [], []);
      // @ts-expect-error
      useInterstateDefined.acceptSelector<number>((state) => state.a, [], []);

      const ridef01 = readInterstateDefined('a');
      const ridef02 = readInterstateDefined(3);
      const ridef03 = readInterstateDefined(SymbolKey);
      const ridef04 = readInterstateDefined([0, 'a', SymbolKey, 2, 'b', 3, 'c', 'd', 'e']);
      const ridef05 = readInterstateDefined([0, 'a', SymbolKey, 2, 'b', 3, 'c', 'd', 'e'] as const);

      type TestCase09 = [
        IsTrue<IsEqual<typeof ridef01, string>>,
        IsTrue<IsEqual<typeof ridef02, number | undefined>>,
        IsTrue<IsEqual<typeof ridef03, [boolean]>>,

        IsTrue<
          IsEqual<
            typeof ridef04,
            {
              0: boolean;
              a: string;
              [SymbolKey]: [boolean];
              2: { two: number };
              b: string | object;
              3: number | undefined;
              c: unknown;
              d: object;
              e: () => number;
            }
          >
        >,

        IsTrue<
          IsEqual<
            typeof ridef05,
            {
              0: boolean;
              a: string;
              [SymbolKey]: [boolean];
              2: { two: number };
              b: string | object;
              3: number | undefined;
              c: unknown;
              d: object;
              e: () => number;
            }
          >
        >
      ];

      // @ts-expect-error
      readInterstateDefined();
      // @ts-expect-error
      readInterstateDefined<'a'>();

      // @ts-expect-error
      readInterstateDefined<'a'>('a');

      // @ts-expect-error
      readInterstateDefined(['a', 1]);
      // @ts-expect-error
      readInterstateDefined(['a', null]);
      // @ts-expect-error
      readInterstateDefined([]);
      // @ts-expect-error
      readInterstateDefined([true]);
      // @ts-expect-error
      readInterstateDefined([true] as const);

      // @ts-expect-error
      readInterstateDefined(1);
      // @ts-expect-error
      readInterstateDefined(() => ({ a: 'aa' }));
      // @ts-expect-error
      readInterstateDefined({ a: 'aa' });
      // @ts-expect-error
      readInterstateDefined(true);
      // @ts-expect-error
      readInterstateDefined(null);
      // @ts-expect-error
      readInterstateDefined(undefined);

      // @ts-expect-error
      readInterstateDefined('a', 'aa');
      // @ts-expect-error
      readInterstateDefined('a', 'aa', 'aaa');
      // @ts-expect-error
      readInterstateDefined<'a'>('a', 'aa');

      const ridefas01 = readInterstateDefined.acceptSelector((state) => state.a);

      const ridefas02 = readInterstateDefined.acceptSelector(
        ({ a, b }) => a + (typeof b === 'string' ? b : '')
      );

      const ridefas03 = readInterstateDefined.acceptSelector(({ a, e }) =>
        a.length > 0 ? a : e()
      );
      const ridefas04 = readInterstateDefined.acceptSelector((state) => ({ ...state }));
      const ridefas05 = readInterstateDefined.acceptSelector(({ a, d }) => ({ [a]: d }));

      type TestCase10 = [
        IsTrue<IsEqual<typeof ridefas01, string>>,
        IsTrue<IsEqual<typeof ridefas02, string>>,
        IsTrue<IsEqual<typeof ridefas03, string | number>>,
        IsTrue<IsEqual<typeof ridefas04, State>>,
        IsTrue<IsEqual<typeof ridefas05, { [K: string]: object }>>
      ];

      // @ts-expect-error
      readInterstateDefined.acceptSelector();
      // @ts-expect-error
      readInterstateDefined.acceptSelector<number>();

      // @ts-expect-error
      readInterstateDefined.acceptSelector((state: { a: number }) => state.a);
      // @ts-expect-error
      readInterstateDefined.acceptSelector((state, x: unknown) => state.a);
      // @ts-expect-error
      readInterstateDefined.acceptSelector(2);
      // @ts-expect-error
      readInterstateDefined.acceptSelector([2]);
      // @ts-expect-error
      readInterstateDefined.acceptSelector({ a: 'aa' });
      // @ts-expect-error
      readInterstateDefined.acceptSelector(true);
      // @ts-expect-error
      readInterstateDefined.acceptSelector([true]);
      // @ts-expect-error
      readInterstateDefined.acceptSelector(null);
      // @ts-expect-error
      readInterstateDefined.acceptSelector(undefined);

      // @ts-expect-error
      readInterstateDefined.acceptSelector<string>((state: State) => state.a);

      // @ts-expect-error
      readInterstateDefined.acceptSelector((state) => state.a, null);
      // @ts-expect-error
      readInterstateDefined.acceptSelector((state) => state.a, null, null);
      // @ts-expect-error
      readInterstateDefined.acceptSelector<number>((state) => state.a, null);

      setInterstateDefined('a', 'aa');
      setInterstateDefined(SymbolKey, [true] as const);
      setInterstateDefined(2, { two: 100 });
      setInterstateDefined('b', 'bb');
      setInterstateDefined('b', { b: 'bb' });
      setInterstateDefined('b', () => (Math.random() > 0.5 ? 'bb' : { b: 'bb' }));
      setInterstateDefined('b', (prevB) => (typeof prevB === 'object' ? 'bb' : { b: 'bb' }));
      setInterstateDefined(SymbolKey, () => [true] as const);
      setInterstateDefined(3, undefined);
      setInterstateDefined(3, (prevThree) => prevThree && undefined);
      setInterstateDefined(3, 100);
      setInterstateDefined('c', 100);
      setInterstateDefined('c', () => () => 100);
      setInterstateDefined('d', { d: 'dd' });
      setInterstateDefined('d', (prevD) => ({ d: prevD }));
      setInterstateDefined('e', () => () => 100);

      setInterstateDefined({
        a: 'aa',
        [SymbolKey]: [true],
        2: { two: 100 },
        b: 'bb',
        3: undefined,
        c: 100,
        d: { d: 'dd' },
        e: () => 100,
      });

      setInterstateDefined({ [SymbolKey]: [true] as const, b: { b: 'bb' }, 3: 100, c: () => 100 });

      setInterstateDefined(() => ({
        a: 'aa',
        [SymbolKey]: [true] as const,
        2: { two: 100 },
        b: 'bb',
        3: undefined,
        c: 100,
        d: { d: 'dd' },
        e: () => 100,
      }));

      setInterstateDefined(() => ({ b: { b: 'bb' }, 3: 100, c: () => 100 }));

      setInterstateDefined(({ b: prevB }) => ({
        b: typeof prevB === 'object' ? 'bb' : { b: 'bb' },
        c: prevB,
      }));

      // @ts-expect-error
      setInterstateDefined();
      // @ts-expect-error
      setInterstateDefined<number>();

      // @ts-expect-error
      setInterstateDefined<'a'>('a', 'aa');
      // @ts-expect-error
      setInterstateDefined<'a'>('a');
      // @ts-expect-error
      setInterstateDefined<'a'>({ a: 'aa' });
      // @ts-expect-error
      setInterstateDefined<'a'>(() => ({ a: 'aa' }));

      // @ts-expect-error
      setInterstateDefined('e');

      // @ts-expect-error
      setInterstateDefined('a');

      // @ts-expect-error
      setInterstateDefined((prevState) => 100);
      // @ts-expect-error
      setInterstateDefined(() => [true]);
      // @ts-expect-error
      setInterstateDefined((prevState) => [true] as const);
      // @ts-expect-error
      setInterstateDefined((prevState) => ({ a: () => 'aa' }));
      // @ts-expect-error
      setInterstateDefined((prevState) => ({ e: {} }));
      // @ts-expect-error
      setInterstateDefined((prevState) => ({ 1: 100 }));
      // @ts-expect-error
      setInterstateDefined((prevState) => ({}));
      // @ts-expect-error
      setInterstateDefined(() => ({}));
      // @ts-expect-error
      setInterstateDefined((prevState) => ({ a: 'aa', 1: 100 }));
      // @ts-expect-error
      setInterstateDefined((prevState) => () => ({ a: 'aa' }));
      // @ts-expect-error
      setInterstateDefined((prevState: State, x: unknown) => ({ a: 'aa' }));
      // @ts-expect-error
      setInterstateDefined((prevState) => ({ [SymbolKey]: [true] }));
      // @ts-expect-error
      setInterstateDefined((prevState: { 1: unknown }) => ({ ...prevState }));
      // @ts-expect-error
      setInterstateDefined((prevState) => ({ a: prevState[2] }));

      // @ts-expect-error
      setInterstateDefined({ a: () => 'aa' });
      // @ts-expect-error
      setInterstateDefined({ e: {} });
      // @ts-expect-error
      setInterstateDefined({ 1: 100 });
      // @ts-expect-error
      setInterstateDefined({});
      // @ts-expect-error
      setInterstateDefined({ a: 'aa', 1: 100 });
      // @ts-expect-error
      setInterstateDefined({ e: () => () => 100 });

      // @ts-expect-error
      setInterstateDefined(1);
      // @ts-expect-error
      setInterstateDefined(true);
      // @ts-expect-error
      setInterstateDefined(null);
      // @ts-expect-error
      setInterstateDefined(undefined);
      // @ts-expect-error
      setInterstateDefined([true]);

      // @ts-expect-error
      setInterstateDefined(1, 100);
      // @ts-expect-error
      setInterstateDefined(null, null);

      // @ts-expect-error
      setInterstateDefined('e', (prevValue) => 100);
      // @ts-expect-error
      setInterstateDefined('e', () => 100);
      // @ts-expect-error
      setInterstateDefined('e', (prevValue: () => number, x: unknown) => () => 100);
      // @ts-expect-error
      setInterstateDefined('e', {});

      // @ts-expect-error
      setInterstateDefined('a', (prevValue) => 100);
      // @ts-expect-error
      setInterstateDefined('a', () => 100);
      // @ts-expect-error
      setInterstateDefined('a', (prevValue: string, x: unknown) => 'aa');
      // @ts-expect-error
      setInterstateDefined('a', null);
      // @ts-expect-error
      setInterstateDefined('d', 100);

      // @ts-expect-error
      setInterstateDefined('a', 'aa', 'aaa');
      // @ts-expect-error
      setInterstateDefined('a', 'aa', 'aaa', 'aaaa');
      // @ts-expect-error
      setInterstateDefined<'a'>('a', 'aa', 'aaa');

      resetInterstateDefined();

      resetInterstateDefined({
        a: 'aa',
        [SymbolKey]: [true],
        2: { two: 100 },
        b: 'bb',
        3: undefined,
        c: 100,
        d: { d: 'dd' },
        e: () => 100,
      });

      resetInterstateDefined({
        a: undefined,
        [SymbolKey]: undefined,
        2: undefined,
      });

      resetInterstateDefined({
        a: 'aa',
        [SymbolKey]: undefined,
        2: undefined,
      });

      resetInterstateDefined({ a: 'aa' as const });
      resetInterstateDefined({ a: 'aa' } as const);

      // @ts-expect-error
      resetInterstateDefined(1);
      // @ts-expect-error
      resetInterstateDefined(true);
      // @ts-expect-error
      resetInterstateDefined([true]);
      // @ts-expect-error
      resetInterstateDefined({});
      // @ts-expect-error
      resetInterstateDefined(() => true);
      // @ts-expect-error
      resetInterstateDefined(null);
      // @ts-expect-error
      resetInterstateDefined(undefined);

      // @ts-expect-error
      resetInterstateDefined<{ a: string }>({ a: 'aa' }, 'aaa');
      // @ts-expect-error
      resetInterstateDefined<{ a: string }>({ a: 'aa' });
      // @ts-expect-error
      resetInterstateDefined<{ 1: string }>({ 1: 100 });
      // @ts-expect-error
      resetInterstateDefined<{ 0: boolean }>([true]);
      // @ts-expect-error
      resetInterstateDefined<{ 0: boolean }>({ 0: true });
      // @ts-expect-error
      resetInterstateDefined<{ 1: boolean }>(() => ({ 0: true }));
      // @ts-expect-error
      resetInterstateDefined<true>();
      // @ts-expect-error
      resetInterstateDefined<null>();
      // @ts-expect-error
      resetInterstateDefined<undefined>();
      // @ts-expect-error
      resetInterstateDefined<() => number>();
      // @ts-expect-error
      resetInterstateDefined<[number]>();
      // @ts-expect-error
      resetInterstateDefined<{}>();
      // @ts-expect-error
      resetInterstateDefined<{ a: string }>();
      // @ts-expect-error
      resetInterstateDefined<() => { 1: number }>({ 1: 100 });

      // @ts-expect-error
      resetInterstateDefined({ a: 'aa' }, null);
      // @ts-expect-error
      resetInterstateDefined({ a: 'aa' }, null, null);
      // @ts-expect-error
      resetInterstateDefined<{ a: string }>({ a: 'aa' }, null);

      type TestCase11 = [
        IsTrue<IsEqual<UseInterstateInitParam<string>, string | (() => string)>>,

        IsTrue<
          IsEqual<
            UseInterstateInitParam<string | undefined>,
            string | undefined | (() => string | undefined)
          >
        >,

        IsTrue<
          IsEqual<
            UseInterstateInitParam<string | boolean>,
            string | boolean | (() => string | boolean)
          >
        >,

        IsTrue<
          IsEqual<UseInterstateInitParam<() => number | boolean>, () => () => number | boolean>
        >,

        IsTrue<
          IsEqual<
            UseInterstateInitParam<number | (() => { a: string })>,
            number | (() => number | (() => { a: string }))
          >
        >,

        IsTrue<
          IsEqual<UseInterstateInitParam<(a: boolean) => number>, () => (a: boolean) => number>
        >,

        IsTrue<
          IsEqual<
            UseInterstateInitParam<number | (() => { a: string })>,
            number | (() => number | (() => { a: string }))
          >
        >,

        IsTrue<IsEqual<UseInterstateInitParam<unknown>, () => unknown>>,
        IsTrue<IsEqual<UseInterstateInitParam<{}>, () => {}>>,
        IsTrue<IsEqual<UseInterstateInitParam<object | true>, true | (() => object | true)>>,
        IsTrue<IsEqual<UseInterstateInitParam<null>, null | (() => null)>>
      ];

      type TestCase12 = [
        IsTrue<IsEqual<UseInterstateSchemaParam<{}>, {} | (() => {})>>,

        IsTrue<
          IsEqual<
            UseInterstateSchemaParam<{ a: number; 2: string; [SymbolKey]: () => boolean }>,
            | { a: number; 2: string; [SymbolKey]: () => boolean }
            | (() => { a: number; 2: string; [SymbolKey]: () => boolean })
          >
        >
      ];

      type TestCase13 = [
        IsTrue<IsEqual<InterstateSelector<{ a: number }>, (prevState: { a: number }) => unknown>>,

        IsTrue<
          IsEqual<InterstateSelector<{ a: number }, string>, (prevState: { a: number }) => string>
        >,

        IsTrue<
          IsEqual<
            InterstateSelector<{ a: number }, () => string>,
            (prevState: { a: number }) => () => string
          >
        >,

        IsTrue<
          IsEqual<
            InterstateSelector<{ a: boolean; 1: 'aa'; [SymbolKey]: { b: string } }, true>,
            (prevState: { a: boolean; 1: 'aa'; [SymbolKey]: { b: string } }) => true
          >
        >
      ];

      type TestCase14 = [
        IsTrue<IsEqual<SetInterstateParam<string>, string | ((prevValue: string) => string)>>,

        IsTrue<
          IsEqual<
            SetInterstateParam<string | undefined>,
            string | undefined | ((prevValue: string | undefined) => string | undefined)
          >
        >,

        IsTrue<
          IsEqual<
            SetInterstateParam<string | boolean>,
            string | boolean | ((prevValue: string | boolean) => string | boolean)
          >
        >,

        IsTrue<
          IsEqual<
            SetInterstateParam<() => number | boolean>,
            (prevValue: () => number | boolean) => () => number | boolean
          >
        >,

        IsTrue<
          IsEqual<
            SetInterstateParam<(a: boolean) => number>,
            (prevValue: (a: boolean) => number) => (a: boolean) => number
          >
        >,

        IsTrue<
          IsEqual<
            SetInterstateParam<number | (() => { a: string })>,
            number | ((prevValue: number | (() => { a: string })) => number | (() => { a: string }))
          >
        >,

        IsTrue<IsEqual<SetInterstateParam<unknown>, (prevValue: unknown) => unknown>>,
        IsTrue<IsEqual<SetInterstateParam<{}>, (prevValue: {}) => {}>>,

        IsTrue<
          IsEqual<
            SetInterstateParam<object | true>,
            true | ((prevValue: object | true) => object | true)
          >
        >,

        IsTrue<IsEqual<SetInterstateParam<null>, null | ((prevValue: null) => null)>>
      ];

      type TestCase15 = [
        IsTrue<IsEqual<SetInterstateSchemaParam<{}>, {} | ((prevState: {}) => {})>>,

        IsTrue<
          IsEqual<
            SetInterstateSchemaParam<{ a: number; 2: string; [SymbolKey]: () => boolean }>,
            | { a: number; 2: string; [SymbolKey]: () => boolean }
            | ((prevState: { a: number; 2: string; [SymbolKey]: () => boolean }) => {
                a: number;
                2: string;
                [SymbolKey]: () => boolean;
              })
          >
        >
      ];

      const testInitInterstateDev = (a: InitInterstateDev) => a;

      const testIIDExtends: InitInterstateDev = {} as InitInterstate;
      const iid01 = testInitInterstateDev({} as InitInterstate);

      type TestCase16 = [IsTrue<IsEqual<typeof iid01, InitInterstateDev>>];

      const testInterstateMethodsDev = <M extends object>(a: InterstateMethodsDev<M>) => a;

      const testIMDExtends01: InterstateMethodsDev<object> = {} as InterstateMethods<object>;
      const testIMDExtends02: InterstateMethodsDev<State> = {} as InterstateMethods<State>;
      const testIMDExtends03: InterstateMethodsDev<object> = {} as InterstateMethods;
      const testIMDExtends04: InterstateMethodsDev<{ a: number }> = {} as InterstateMethods<{
        a: number;
      }>;

      const imd01 = testInterstateMethodsDev({} as InterstateMethods<object>);
      const imd02 = testInterstateMethodsDev({} as InterstateMethods<State>);
      const imd03 = testInterstateMethodsDev({} as InterstateMethods);
      const imd04 = testInterstateMethodsDev({} as InterstateMethods<{ a: number }>);

      type TestCase17 = [
        IsTrue<IsEqual<typeof imd01, InterstateMethodsDev<object>>>,
        IsTrue<IsEqual<typeof imd02, InterstateMethodsDev<State>>>,
        IsTrue<IsEqual<typeof imd03, InterstateMethodsDev<object>>>,
        IsTrue<IsEqual<typeof imd04, InterstateMethodsDev<{ a: number }>>>
      ];

      const testUseInterstateDev = <M extends object>(a: UseInterstateDev<M>) => a;

      const testUIDExtends01: UseInterstateDev<object> = {} as UseInterstate<object>;
      const testUIDExtends02: UseInterstateDev<State> = {} as UseInterstate<State>;
      const testUIDExtends03: UseInterstateDev<object> = {} as UseInterstate;
      const testUIDExtends04: UseInterstateDev<{ a: number }> = {} as UseInterstate<{ a: number }>;

      const uid01 = testUseInterstateDev({} as UseInterstate<object>);
      const uid02 = testUseInterstateDev({} as UseInterstate<State>);
      const uid03 = testUseInterstateDev({} as UseInterstate);
      const uid04 = testUseInterstateDev({} as UseInterstate<{ a: number }>);

      type TestCase18 = [
        IsTrue<IsEqual<typeof uid01, UseInterstateDev<object>>>,
        IsTrue<IsEqual<typeof uid02, UseInterstateDev<State>>>,
        IsTrue<IsEqual<typeof uid03, UseInterstateDev<object>>>,
        IsTrue<IsEqual<typeof uid04, UseInterstateDev<{ a: number }>>>
      ];

      const testReadInterstateDev = <M extends object>(a: ReadInterstateDev<M>) => a;

      const testRIDExtends01: ReadInterstateDev<object> = {} as ReadInterstate<object>;
      const testRIDExtends02: ReadInterstateDev<State> = {} as ReadInterstate<State>;
      const testRIDExtends03: ReadInterstateDev<object> = {} as ReadInterstate<never>;
      const testRIDExtends04: ReadInterstateDev<{ a: number }> = {} as ReadInterstate<{
        a: number;
      }>;

      const rid01 = testReadInterstateDev({} as ReadInterstate<object>);
      const rid02 = testReadInterstateDev({} as ReadInterstate<State>);
      const rid03 = testReadInterstateDev({} as ReadInterstate);
      const rid04 = testReadInterstateDev({} as ReadInterstate<{ a: number }>);

      type TestCase19 = [
        IsTrue<IsEqual<typeof rid01, ReadInterstateDev<object>>>,
        IsTrue<IsEqual<typeof rid02, ReadInterstateDev<State>>>,
        IsTrue<IsEqual<typeof rid03, ReadInterstateDev<object>>>,
        IsTrue<IsEqual<typeof rid04, ReadInterstateDev<{ a: number }>>>
      ];

      const testSetInterstateDev = <M extends object>(a: SetInterstateDev<M>) => a;

      const testSIDExtends01: SetInterstateDev<object> = {} as SetInterstate<object>;
      const testSIDExtends02: SetInterstateDev<State> = {} as SetInterstate<State>;
      const testSIDExtends03: SetInterstateDev<object> = {} as SetInterstate<never>;
      const testSIDExtends04: SetInterstateDev<{ a: number }> = {} as SetInterstate<{ a: number }>;

      const sid01 = testSetInterstateDev({} as SetInterstate<object>);
      const sid02 = testSetInterstateDev({} as SetInterstate<State>);
      const sid03 = testSetInterstateDev({} as SetInterstate);
      const sid04 = testSetInterstateDev({} as SetInterstate<{ a: number }>);

      type TestCase20 = [
        IsTrue<IsEqual<typeof sid01, SetInterstateDev<object>>>,
        IsTrue<IsEqual<typeof sid02, SetInterstateDev<State>>>,
        IsTrue<IsEqual<typeof sid03, SetInterstateDev<object>>>,
        IsTrue<IsEqual<typeof sid04, SetInterstateDev<{ a: number }>>>
      ];

      const testResetInterstateDev = <M extends object>(a: ResetInterstateDev<M>) => a;

      const testResIDExtends01: ResetInterstateDev<object> = {} as ResetInterstate<object>;
      const testResIDExtends02: ResetInterstateDev<State> = {} as ResetInterstate<State>;
      const testResIDExtends03: ResetInterstateDev<object> = {} as ResetInterstate<never>;
      const testResIDExtends04: ResetInterstateDev<{ a: number }> = {} as ResetInterstate<{
        a: number;
      }>;

      const ResID01 = testResetInterstateDev({} as ResetInterstate<object>);
      const ResID02 = testResetInterstateDev({} as ResetInterstate<State>);
      const ResID03 = testResetInterstateDev({} as ResetInterstate);
      const ResID04 = testResetInterstateDev({} as ResetInterstate<{ a: number }>);

      type TestCase21 = [
        IsTrue<IsEqual<typeof ResID01, ResetInterstateDev<object>>>,
        IsTrue<IsEqual<typeof ResID02, ResetInterstateDev<State>>>,
        IsTrue<IsEqual<typeof ResID03, ResetInterstateDev<object>>>,
        IsTrue<IsEqual<typeof ResID04, ResetInterstateDev<{ a: number }>>>
      ];
    };
  });
});
