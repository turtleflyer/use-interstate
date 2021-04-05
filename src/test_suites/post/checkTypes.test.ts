/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IsEqual, IsTrue } from '@~internal/check-types';
import type {
  AcceptSelector,
  AcceptSelectorDev,
  GoInterstate,
  InitInterstate,
  InitInterstateDev,
  Interstate,
  InterstateKey,
  InterstateMethods,
  InterstateMethodsDev,
  InterstateSelector,
  ReadInterstate,
  ReadInterstateDev,
  SetInterstate,
  SetInterstateDev,
  SetInterstateParam,
  SetInterstateSchemaParam,
  SetInterstateSchemaParamFn,
  SetInterstateSchemaParamObj,
  UseInterstate,
  UseInterstateDev,
  UseInterstateInitParam,
  UseInterstateSchemaParam,
  UseInterstateSchemaParamFn,
  UseInterstateSchemaParamObj,
} from '../../../lib/use-interstate';
import { goInterstate } from '../../../lib/use-interstate';

describe('Check types', () => {
  test('types are consistent', () => {
    const testSuite = () => {
      const symbolKey = Symbol('uniqueSymbol');

      const { initInterstate, useInterstate, readInterstate, setInterstate } = goInterstate();

      type TestCase00 = [
        IsTrue<IsEqual<typeof goInterstate, GoInterstate>>,
        IsTrue<IsEqual<InterstateKey, string | symbol>>,
        IsTrue<IsEqual<Interstate, Record<string | symbol, unknown>>>
      ];

      const tii00 = { a: undefined, 33: () => 5 as const, [symbolKey]: 'boo' };

      const ii00 = initInterstate(tii00);
      const ii01 = initInterstate();
      const ii02 = initInterstate({});

      type TestCase01 = [
        IsTrue<IsEqual<typeof ii00, Omit<InterstateMethods<never>, 'initInterstate'>>>,
        IsTrue<IsEqual<typeof ii01, Omit<InterstateMethods<never>, 'initInterstate'>>>,
        IsTrue<IsEqual<typeof ii02, Omit<InterstateMethods<never>, 'initInterstate'>>>
      ];

      // @ts-expect-error
      initInterstate((a: unknown) => ({}));
      // @ts-expect-error
      initInterstate((a: unknown) => ({ a: 'no' }));

      let tui00 = 'ni'; // eslint-disable-line prefer-const
      const tui01 = () => 'ni';
      const tui02 = () => () => {};
      const tui03 = () => undefined;
      const tui04 = undefined;

      const ui000 = useInterstate('1', tui00);
      const ui010 = useInterstate('1', tui01);
      const ui02 = useInterstate('1', tui02);
      const ui03 = useInterstate('1', tui03);
      const ui040 = useInterstate('1', tui04);
      const ui06 = useInterstate('1');
      const ui011 = useInterstate('1', tui01);
      const ui012 = useInterstate(symbolKey, tui01);
      const ui001 = useInterstate<string>(symbolKey, tui00);
      const ui013 = useInterstate<string>(symbolKey, tui01);
      const ui002 = useInterstate<string | boolean>(symbolKey, tui00);
      const ui014 = useInterstate<string | boolean>(symbolKey, tui01);
      const ui041 = useInterstate<string>(symbolKey, tui04);

      type TestCase02 = [
        IsTrue<IsEqual<typeof ui000, string>>,
        IsTrue<IsEqual<typeof ui010, string>>,
        IsTrue<IsEqual<typeof ui02, () => void>>,
        IsTrue<IsEqual<typeof ui03, undefined>>,
        IsTrue<IsEqual<typeof ui040, unknown>>,
        IsTrue<IsEqual<typeof ui06, unknown>>,
        IsTrue<IsEqual<typeof ui011, string>>,
        IsTrue<IsEqual<typeof ui012, string>>,
        IsTrue<IsEqual<typeof ui001, string>>,
        IsTrue<IsEqual<typeof ui013, string>>,
        IsTrue<IsEqual<typeof ui002, string | boolean>>,
        IsTrue<IsEqual<typeof ui014, string | boolean>>,
        IsTrue<IsEqual<typeof ui041, string>>
      ];

      // @ts-expect-error
      useInterstate('1', (c: unknown) => null);
      // @ts-expect-error
      useInterstate('1', (c: unknown) => ({}));
      // @ts-expect-error
      useInterstate('1', (c: number) => c + 1);
      // @ts-expect-error
      useInterstate<string | boolean[]>(77, () => ['a']);
      // @ts-expect-error
      useInterstate(1);

      const tuim00 = { a: 1, 2: 'uy' } as const;
      const tuim01 = { [symbolKey]: false };
      const tuim02 = { a: () => 'nis', 2: () => () => {} };
      const tuim03 = { a: undefined, 2: () => undefined };
      const tuim04 = () =>
        ({
          yes: () => 'no',
          low: 'high',
          7: undefined,
        } as const);
      const tuim05 = () => ({
        yes: () => 'no',
        low: 'high',
        7: undefined,
      });

      const uim00 = useInterstate(tuim00);
      const uim010 = useInterstate(tuim01);
      const uim011 = useInterstate<{ [symbolKey]: number | boolean }>(tuim01);
      const uim020 = useInterstate(tuim02);
      const uim021 = useInterstate<{ a: string; 2: () => undefined | void }>(tuim02);
      const uim030 = useInterstate(tuim03);
      const uim031 = useInterstate<{ a: unknown; 2: undefined }>(tuim03);
      const uim032 = useInterstate<{
        readonly a: string | boolean;
        readonly 2: (() => string) | undefined;
      }>(tuim03);
      const uim04 = useInterstate(tuim04);
      const uim05 = useInterstate(tuim05);
      const uim06 = useInterstate(['33', 'a', symbolKey]);
      const uim07 = useInterstate<{ 33: null; a: () => string; [symbolKey]: { b: 7 } }>([
        '33',
        'a',
        symbolKey,
      ] as const);

      type TestCase03 = [
        IsTrue<IsEqual<typeof uim00, { a: 1; 2: 'uy' }>>,
        IsTrue<IsEqual<typeof uim010, { [symbolKey]: boolean }>>,
        IsTrue<IsEqual<typeof uim011, { [symbolKey]: number | boolean }>>,
        IsTrue<IsEqual<typeof uim020, { a: string; 2: () => void }>>,
        IsTrue<IsEqual<typeof uim021, { a: string; 2: () => undefined | void }>>,
        IsTrue<IsEqual<typeof uim030, { a: unknown; 2: undefined }>>,
        IsTrue<IsEqual<typeof uim031, { a: unknown; 2: undefined }>>,
        IsTrue<IsEqual<typeof uim032, { a: string | boolean; 2: (() => string) | undefined }>>,
        IsTrue<IsEqual<typeof uim04, { yes: () => string; low: 'high'; 7: undefined }>>,
        IsTrue<IsEqual<typeof uim05, { yes: () => string; low: string; 7: undefined }>>,
        IsTrue<IsEqual<typeof uim06, { 33: unknown; a: unknown; [symbolKey]: unknown }>>,
        IsTrue<IsEqual<typeof uim07, { 33: null; a: () => string; [symbolKey]: { b: 7 } }>>
      ];

      // @ts-expect-error
      useInterstate();
      // @ts-expect-error
      useInterstate({ a: (p: unknown) => 'no' });
      // @ts-expect-error
      useInterstate({ a: (p: unknown) => ({}) });
      // @ts-expect-error
      useInterstate((x: unknown) => 3);
      // @ts-expect-error
      useInterstate((x: unknown) => ({}));
      // @ts-expect-error
      useInterstate([33]);

      const uias00 = useInterstate.acceptSelector((state: { a: boolean; b: boolean[] }) => [
        ...state.b,
        state.a,
      ]);
      const uias01 = useInterstate.acceptSelector(
        (state: { [symbolKey]: number; 33: (x: number) => string }) => state[33](state[symbolKey])
      );
      const uias02 = useInterstate.acceptSelector((state) =>
        'foo' in state ? (state as { foo: number }).foo : null
      );

      type TestCase04 = [
        IsTrue<IsEqual<typeof uias00, boolean[]>>,
        IsTrue<IsEqual<typeof uias01, string>>,
        IsTrue<IsEqual<typeof uias02, number | null>>
      ];

      // @ts-expect-error
      useInterstate.acceptSelector((state: unknown, x: unknown) => 3);
      // @ts-expect-error
      useInterstate.acceptSelector((state: unknown, x: unknown) => ({}));

      const ri00 = readInterstate('a');
      const ri01 = readInterstate<string>('1');
      const ri02 = readInterstate<1>(symbolKey);

      type TestCase05 = [
        IsTrue<IsEqual<typeof ri00, unknown>>,
        IsTrue<IsEqual<typeof ri01, string>>,
        IsTrue<IsEqual<typeof ri02, 1>>
      ];

      // @ts-expect-error
      readInterstate(1);

      const rim00 = readInterstate(['12', 'foo', symbolKey]);
      const rim01 = readInterstate<{ 77: 'a'; b: true; [symbolKey]: number }>([
        '77',
        'b',
        symbolKey,
      ]);
      const rim02 = readInterstate<{ 77: 'a'; b: true }>(['77', 'b'] as const);
      const rim03 = readInterstate(['77']);
      const rim04 = readInterstate(['1', '2', '3'] as const);

      type TestCase06 = [
        IsTrue<IsEqual<typeof rim00, { 12: unknown; foo: unknown; [symbolKey]: unknown }>>,
        IsTrue<IsEqual<typeof rim01, { 77: 'a'; b: true; [symbolKey]: number }>>,
        IsTrue<IsEqual<typeof rim02, { 77: 'a'; b: true }>>,
        IsTrue<IsEqual<typeof rim03, { 77: unknown }>>,
        IsTrue<IsEqual<typeof rim04, { 1: unknown; 2: unknown; 3: unknown }>>
      ];

      // @ts-expect-error
      readInterstate<{ b: true; [symbolKey]: number }>(['a', symbolKey]);
      // @ts-expect-error
      readInterstate([77]);
      // @ts-expect-error
      readInterstate<{ 77: 'a' }>([77]);

      const rias00 = readInterstate.acceptSelector((state: { a: boolean; b: boolean[] }) => [
        ...state.b,
        state.a,
      ]);
      const rias01 = readInterstate.acceptSelector(
        (state: { [symbolKey]: number; 33: (x: number) => string }) => state[33](state[symbolKey])
      );
      const rias02 = readInterstate.acceptSelector((state) =>
        'foo' in state ? (state as { foo: number }).foo : null
      );

      type TestCase07 = [
        IsTrue<IsEqual<typeof rias00, boolean[]>>,
        IsTrue<IsEqual<typeof rias01, string>>,
        IsTrue<IsEqual<typeof rias02, number | null>>
      ];

      // @ts-expect-error
      readInterstate.acceptSelector((state: unknown, x: unknown) => 3);
      // @ts-expect-error
      readInterstate.acceptSelector((state: unknown, x: unknown) => ({}));

      setInterstate('a', 1);
      setInterstate('7', '1');
      setInterstate(symbolKey, true);
      setInterstate('foo', undefined);
      setInterstate('foo', () => undefined);
      setInterstate('b', (state: number) => state + 1);
      setInterstate('c', (a) => `${a}`);
      setInterstate<number | string>('c', (a) => `${a}`);

      // @ts-expect-error
      setInterstate('c', (a: number) => `${a}`);
      // @ts-expect-error
      setInterstate('c', (a: number) => ({}));
      // @ts-expect-error
      setInterstate('c', (a: null, b: unknown) => null);
      // @ts-expect-error
      setInterstate('c', (a: unknown, b: unknown) => ({}));
      // @ts-expect-error
      setInterstate<null>('c', (a: number) => null);
      // @ts-expect-error
      setInterstate(7, undefined);

      setInterstate({ a: 1, 2: () => 'go', [symbolKey]: undefined });
      setInterstate<{ a: number | string; 2: string | string[] }>({ a: 1, 2: () => 'go' });
      setInterstate(() => ({ foo: undefined, 77: () => 3, [symbolKey]: [1, 2, 3] }));
      setInterstate({ 11: () => {}, foo: () => () => {} });
      setInterstate((state: { a: string }) => ({ ...state, a: 'no' }));
      setInterstate((state: { foo: unknown }) => ({ foo: state.foo, 77: () => 3 }));
      setInterstate({ a: (state: number) => state });
      setInterstate((state: { a: number }) => ({ foo: state.a + 1 }));
      setInterstate((state: { a: number; b: number }) => ({ foo: state.a + 1, b: state.a + 1 }));
      setInterstate((state: { a: number }): { a: 1 | 2; b: boolean } => ({
        a: state.a > 0 ? 1 : 2,
        b: state.a > 0,
      }));
      setInterstate<{ a: string[] }>((state) => ({ a: Object.keys(state) }));
      setInterstate((state) => ({ a: Object.keys(state) }));

      // @ts-expect-error
      setInterstate((a: unknown, b: string) => ({ a, b }));
      // @ts-expect-error
      setInterstate((a: unknown, b: unknown) => ({}));
      // @ts-expect-error
      setInterstate({ a: (x: boolean) => ({ 77: x }) });
      // @ts-expect-error
      setInterstate({ a: (x: number, y: number) => x + y });
      // @ts-expect-error
      setInterstate({ a: (x: unknown, y: unknown) => [x, y] });
      // @ts-expect-error
      setInterstate({ a: (x: unknown, y: unknown) => ({}) });
      // @ts-expect-error
      setInterstate((state: { a: number }) => ({ a: state.a.toString() }));
      // @ts-expect-error
      setInterstate((state: { a: -1 | 1 }): { a: number; b: boolean } => ({
        a: state.a > 0 ? 1 : 2,
        b: state.a > 0,
      }));
      // @ts-expect-error
      setInterstate((state: { a: number }) => ({ a: 'wrong' }));
      // @ts-expect-error
      setInterstate<{ a: string }>((state: { a: number }) => ({ a: 'wrong' }));

      type State = {
        a: string;
        2: (boolean | number)[];
        [symbolKey]: (() => unknown) | { b: number | object };
        77: undefined;
        go: null | undefined | string[];
      };

      const withInitInterstate = goInterstate<State>();
      const { initInterstate: initInterstateDefined } = withInitInterstate;
      const getUseInterstate = withInitInterstate.initInterstate();
      const {
        useInterstate: useInterstateDefined,
        readInterstate: readInterstateDefined,
        setInterstate: setInterstateDefined,
      } = getUseInterstate;

      type TestCase08 = [
        IsTrue<
          IsEqual<
            typeof withInitInterstate,
            {
              initInterstate: InitInterstate<State>;
              useInterstate: UseInterstate<State>;
              readInterstate: ReadInterstate<State>;
              setInterstate: SetInterstate<State>;
            }
          >
        >,
        IsTrue<
          IsEqual<
            typeof getUseInterstate,
            {
              useInterstate: UseInterstate<State>;
              readInterstate: ReadInterstate<State>;
              setInterstate: SetInterstate<State>;
            }
          >
        >,
        IsTrue<IsEqual<typeof useInterstateDefined.acceptSelector, AcceptSelector<State>>>
      ];

      initInterstateDefined({
        a: 'no',
        '2': [100],
        [symbolKey]: { b: 3 },
        77: undefined,
      });
      initInterstateDefined();

      // @ts-expect-error
      initInterstateDefined({ [symbolKey]: () => () => 3, b: null });
      // @ts-expect-error
      initInterstateDefined((x: unknown) => ({ a: 'no' }));
      // @ts-expect-error
      initInterstateDefined((x: unknown) => ({}));

      const tuid00 = 'la';
      const tuid01 = () => [true];
      const tuid02 = { b: 1 };
      const tuid03 = () => undefined;
      const tuid04 = undefined;

      const uid000 = useInterstateDefined('a', tuid00);
      const uid01 = useInterstateDefined('2', tuid01);
      const uid02 = useInterstateDefined(symbolKey, tuid02);
      const uid030 = useInterstateDefined('77', tuid03);
      const uid031 = useInterstateDefined('go', tuid03);
      const uid040 = useInterstateDefined('go', tuid04);
      const uid041 = useInterstateDefined('2', tuid04);
      const uid001 = useInterstateDefined<'2' | 'a'>('a', tuid00);

      type TestCase09 = [
        IsTrue<IsEqual<typeof uid000, string>>,
        IsTrue<IsEqual<typeof uid01, (boolean | number)[]>>,
        IsTrue<IsEqual<typeof uid02, (() => unknown) | { b: number | object }>>,
        IsTrue<IsEqual<typeof uid030, undefined>>,
        IsTrue<IsEqual<typeof uid031, null | undefined | string[]>>,
        IsTrue<IsEqual<typeof uid040, null | undefined | string[]>>,
        IsTrue<IsEqual<typeof uid041, (boolean | number)[]>>,
        IsTrue<IsEqual<typeof uid001, string | (boolean | number)[]>>
      ];

      // @ts-expect-error
      useInterstateDefined();
      // @ts-expect-error
      useInterstateDefined('a', (x: string) => x);
      // @ts-expect-error
      useInterstateDefined('1', () => 1);
      // @ts-expect-error
      useInterstateDefined<string[]>(77, () => ['a']);
      // @ts-expect-error
      useInterstateDefined(symbolKey, tuid01);
      // @ts-expect-error
      useInterstateDefined<string>('a', tuid00);
      // @ts-expect-error
      useInterstateDefined(2);

      const tuidm00 = { a: () => 'hurray' };
      const tuidm01 = {
        a: 'tree',
        '77': () => undefined,
        [symbolKey]: { b: { bb: 6 } },
      };
      const tuidm02 = { [symbolKey]: () => () => 'eh' };
      const tuidm03 = {
        a: undefined,
        2: undefined,
        [symbolKey]: undefined,
      };
      const tuidm04 = () =>
        ({
          a: 'omg',
          [symbolKey]: () => 'zzz',
        } as const);

      const uidm00 = useInterstateDefined(tuidm00);
      const uidm01 = useInterstateDefined(tuidm01);
      const uidm02 = useInterstateDefined(tuidm02);
      const uidm03 = useInterstateDefined(tuidm03);
      const uidm04 = useInterstateDefined(tuidm04);
      const uidm05 = useInterstateDefined(['a', '2', symbolKey]);

      type TestCase10 = [
        IsTrue<IsEqual<typeof uidm00, { a: string }>>,
        IsTrue<
          IsEqual<
            typeof uidm01,
            {
              a: string;
              77: undefined;
              [symbolKey]: (() => unknown) | { b: number | object };
            }
          >
        >,
        IsTrue<IsEqual<typeof uidm02, { [symbolKey]: (() => unknown) | { b: number | object } }>>,
        IsTrue<
          IsEqual<
            typeof uidm03,
            {
              a: string;
              2: (boolean | number)[];
              [symbolKey]: (() => unknown) | { b: number | object };
            }
          >
        >,
        IsTrue<
          IsEqual<
            typeof uidm04,
            { a: string; [symbolKey]: (() => unknown) | { b: number | object } }
          >
        >,
        IsTrue<
          IsEqual<
            typeof uidm05,
            {
              a: string;
              2: (boolean | number)[];
              [symbolKey]: (() => unknown) | { b: number | object };
            }
          >
        >
      ];

      // @ts-expect-error
      useInterstateDefined({ a: () => 1, [symbolKey]: { b: 6 } });
      // @ts-expect-error
      useInterstateDefined({ [symbolKey]: () => 'eh' });
      // @ts-expect-error
      useInterstateDefined({ [symbolKey]: () => () => 'eh', b: null });
      // @ts-expect-error
      useInterstateDefined({ a: 'bo', er: 2 });
      // @ts-expect-error
      useInterstateDefined<'a' | 77>({ a: 'bo', go: undefined });
      // @ts-expect-error
      useInterstateDefined((x: unknown) => ({ a: 'bo' }));
      // @ts-expect-error
      useInterstateDefined((x: unknown) => ({}));
      // @ts-expect-error
      useInterstateDefined({ a: (x: string) => 'hi' });
      // @ts-expect-error
      useInterstateDefined(['a', 'sad']);
      // @ts-expect-error
      useInterstateDefined([2, 77]);

      const twsd00 = (state: { a: string; go: null | undefined | string[] }) =>
        Array.isArray(state.go) && state.go.length > 0 ? state.go[0] : state.a;
      const twsd01 = (state: {
        [symbolKey]: (() => unknown) | { b: number | object } | number;
        go: null | undefined | string[];
      }) => {
        const s = state[symbolKey];
        return typeof s === 'function' ? (s() as string) : typeof s === 'number' ? s : state.go;
      };

      const uiasd00 = useInterstateDefined.acceptSelector(twsd00);
      const uiasd01 = useInterstateDefined.acceptSelector(twsd01);
      const uiasd02 = useInterstateDefined.acceptSelector((state) => state[77]);
      const uiasd03 = useInterstateDefined.acceptSelector((state) => state);
      const uiasd04 = useInterstateDefined.acceptSelector(({ 2: two }) => two);
      const uiasd05 = useInterstateDefined.acceptSelector(({ a, go }) => ({
        [a]: go,
      }));

      type TestCase11 = [
        IsTrue<IsEqual<typeof uiasd00, string>>,
        IsTrue<IsEqual<typeof uiasd01, string | number | null | undefined | string[]>>,
        IsTrue<IsEqual<typeof uiasd02, undefined>>,
        IsTrue<IsEqual<typeof uiasd03, State>>,
        IsTrue<IsEqual<typeof uiasd04, (boolean | number)[]>>,
        IsTrue<IsEqual<typeof uiasd05, { [x: string]: null | undefined | string[] }>>
      ];

      // @ts-expect-error
      useInterstateDefined.acceptSelector((state: { a: number; 77: undefined }) => [
        state.a,
        state[77],
      ]);
      // @ts-expect-error
      useInterstateDefined.acceptSelector((state: State, x: unknown) => 3);
      // @ts-expect-error
      useInterstateDefined.acceptSelector((state: State, x: unknown) => ({}));

      const rid00 = readInterstateDefined('go');
      const rid01 = readInterstateDefined('2');
      const rid02 = readInterstateDefined(symbolKey);

      type TestCase12 = [
        IsTrue<IsEqual<typeof rid00, null | undefined | string[]>>,
        IsTrue<IsEqual<typeof rid01, (boolean | number)[]>>,
        IsTrue<IsEqual<typeof rid02, (() => unknown) | { b: number | object }>>
      ];

      // @ts-expect-error
      readInterstateDefined<string>(1);
      // @ts-expect-error
      readInterstateDefined<{ b: string }>(symbolKey);
      // @ts-expect-error
      readInterstateDefined(2);

      const ridm00 = readInterstateDefined(['77', 'a', symbolKey]);
      const ridm01 = readInterstateDefined(['77', 'go'] as const);

      type TestCase13 = [
        IsTrue<
          IsEqual<
            typeof ridm00,
            { 77: undefined; a: string; [symbolKey]: (() => unknown) | { b: number | object } }
          >
        >,
        IsTrue<IsEqual<typeof ridm01, { 77: undefined; go: null | undefined | string[] }>>
      ];

      // @ts-expect-error
      readInterstateDefined(['go', 3]);
      // @ts-expect-error
      readInterstateDefined([2]);

      const riasd00 = readInterstateDefined.acceptSelector(twsd00);
      const riasd01 = readInterstateDefined.acceptSelector(twsd01);
      const riasd02 = readInterstateDefined.acceptSelector((state) => state[77]);
      const riasd03 = readInterstateDefined.acceptSelector((state) => state);

      type TestCase14 = [
        IsTrue<IsEqual<typeof riasd00, string>>,
        IsTrue<IsEqual<typeof riasd01, string | number | null | undefined | string[]>>,
        IsTrue<IsEqual<typeof riasd02, undefined>>,
        IsTrue<IsEqual<typeof riasd03, State>>
      ];

      // @ts-expect-error
      readInterstateDefined.acceptSelector((state: { a: number; 77: undefined }) => [
        state.a,
        state[77],
      ]);
      // @ts-expect-error
      readInterstateDefined.acceptSelector((state: State, x: unknown) => 3);
      // @ts-expect-error
      readInterstateDefined.acceptSelector((state: State, x: unknown) => ({}));

      setInterstateDefined('a', 'yes');
      setInterstateDefined('77', undefined);
      setInterstateDefined(symbolKey, { b: 2 });
      setInterstateDefined('go', (a?: string[] | null) => [...(a || []), 'stop']);
      setInterstateDefined('a', (x) => `${x}!`);

      // @ts-expect-error
      setInterstateDefined('a', (a: string, b: string) => a + b);
      // @ts-expect-error
      setInterstateDefined('77', 77);
      // @ts-expect-error
      setInterstateDefined(77, undefined);
      // @ts-expect-error
      setInterstateDefined('go', (a?: string[] | null) => a && a[0]);
      // @ts-expect-error
      setInterstateDefined<null>('a', () => null);
      // @ts-expect-error
      setInterstateDefined<unknown>('2', [true]);
      // @ts-expect-error
      setInterstateDefined(2, [true]);

      setInterstateDefined({ a: 'star' });
      setInterstateDefined({ a: 'star', 2: () => [true], [symbolKey]: { b: 2 } });
      setInterstateDefined(() => ({
        '2': [3],
        77: undefined,
        [symbolKey]: { b: [1, 2, 3] },
      }));
      setInterstateDefined({ [symbolKey]: () => () => {} });
      setInterstateDefined((state: { a: string }) => ({
        77: undefined,
        go: [state.a],
      }));
      setInterstateDefined({ a: (x: string) => `${x}new` });
      setInterstateDefined((state) => ({
        77: undefined,
        go: [state.a],
      }));

      // @ts-expect-error
      setInterstateDefined((state: { a: number }) => ({
        77: undefined,
      }));
      // @ts-expect-error
      setInterstateDefined((state: { fake: number }) => ({ a: 'no' }));
      // @ts-expect-error
      setInterstateDefined((a: unknown, b: unknown) => ({}));
      // @ts-expect-error
      setInterstateDefined({ a: (x: boolean) => ({ 77: x }) });

      type TestCase15 = [
        IsTrue<IsEqual<UseInterstateInitParam<string>, string | (() => string)>>,
        IsTrue<
          IsEqual<UseInterstateInitParam<string | undefined>, string | (() => string | undefined)>
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
            UseInterstateInitParam<number | (() => { foo: string })>,
            number | (() => number | (() => { foo: string }))
          >
        >
      ];

      type TestCase16 = [
        IsTrue<
          IsEqual<
            UseInterstateSchemaParamObj<{
              one: string;
              [symbolKey]: number | undefined | null;
            }>,
            {
              one: string | (() => string) | undefined;
              [symbolKey]: number | null | undefined | (() => number | undefined | null);
            }
          >
        >,
        IsTrue<
          IsEqual<
            UseInterstateSchemaParamFn<{
              one: string;
              [symbolKey]: number | undefined | null;
            }>,
            () => { one: string; [symbolKey]: number | undefined | null }
          >
        >,
        IsTrue<
          IsEqual<
            UseInterstateSchemaParamObj<
              { one: string; [symbolKey]: number | undefined | null },
              typeof symbolKey
            >,
            {
              [symbolKey]: number | null | undefined | (() => number | undefined | null);
            }
          >
        >,
        IsTrue<
          IsEqual<
            UseInterstateSchemaParamFn<
              { one: string; [symbolKey]: number | undefined | null },
              typeof symbolKey
            >,
            () => { [symbolKey]: number | undefined | null }
          >
        >,

        IsTrue<
          IsEqual<
            UseInterstateSchemaParam<{}>,
            UseInterstateSchemaParamObj<{}> | UseInterstateSchemaParamFn<{}>
          >
        >,
        IsTrue<
          IsEqual<
            UseInterstateSchemaParam<{ a: number; 33: string; [symbolKey]: () => boolean }>,
            | UseInterstateSchemaParamObj<{
                a: number;
                33: string;
                [symbolKey]: () => boolean;
              }>
            | UseInterstateSchemaParamFn<{
                a: number;
                33: string;
                [symbolKey]: () => boolean;
              }>
          >
        >,

        UseInterstateSchemaParamObj<
          { one: string; [symbolKey]: number | undefined | null },
          // @ts-expect-error
          typeof symbolKey | 'two'
        >
      ];

      type TestCase17 = [
        IsTrue<IsEqual<InterstateSelector<{ a: number }>, (readState: { a: number }) => unknown>>,
        IsTrue<
          IsEqual<
            InterstateSelector<{ foo: boolean; 77: 'go'; [symbolKey]: { x: string } }, 5>,
            (readState: { foo: boolean; 77: 'go'; [symbolKey]: { x: string } }) => 5
          >
        >
      ];

      type TestCase18 = [
        IsTrue<IsEqual<SetInterstateParam<string>, string | ((a: string) => string)>>,
        IsTrue<
          IsEqual<
            SetInterstateParam<string | undefined>,
            string | undefined | ((a: string | undefined) => string | undefined)
          >
        >,
        IsTrue<
          IsEqual<
            SetInterstateParam<string | boolean>,
            string | boolean | ((a: string | boolean) => string | boolean)
          >
        >,
        IsTrue<
          IsEqual<
            SetInterstateParam<() => number | boolean>,
            (a: () => number | boolean) => () => number | boolean
          >
        >,
        IsTrue<
          IsEqual<
            SetInterstateParam<number | (() => { foo: string })>,
            number | ((a: number | (() => { foo: string })) => number | (() => { foo: string }))
          >
        >,
        IsTrue<
          IsEqual<
            SetInterstateParam<(a: boolean) => number>,
            (p: (a: boolean) => number) => (a: boolean) => number
          >
        >,
        IsTrue<IsEqual<SetInterstateParam<{}>, {} | ((x: {}) => {})>>
      ];

      type TestCase19 = [
        IsTrue<
          IsEqual<
            SetInterstateSchemaParamObj<{
              one: string;
              [symbolKey]: number | undefined | null;
            }>,
            {
              one: string | ((p: string) => string);
              [symbolKey]:
                | number
                | undefined
                | null
                | ((p: number | undefined | null) => number | undefined | null);
            }
          >
        >,
        IsTrue<
          IsEqual<
            SetInterstateSchemaParamFn<{
              one: string;
              [symbolKey]: number | undefined | null;
            }>,
            (p: {
              one: string;
              [symbolKey]: number | undefined | null;
            }) => { one: string; [symbolKey]: number | undefined | null }
          >
        >,
        IsTrue<
          IsEqual<
            SetInterstateSchemaParamObj<
              { one: string; [symbolKey]: number | undefined | null },
              typeof symbolKey
            >,
            {
              [symbolKey]:
                | number
                | undefined
                | null
                | ((p: number | undefined | null) => number | undefined | null);
            }
          >
        >,
        IsTrue<
          IsEqual<
            SetInterstateSchemaParamFn<
              { one: string; [symbolKey]: number | undefined | null },
              typeof symbolKey
            >,
            (p: {
              one: string;
              [symbolKey]: number | undefined | null;
            }) => { [symbolKey]: number | undefined | null }
          >
        >,

        IsTrue<
          IsEqual<
            SetInterstateSchemaParam<{}>,
            SetInterstateSchemaParamObj<{}> | SetInterstateSchemaParamFn<{}>
          >
        >,
        IsTrue<
          IsEqual<
            SetInterstateSchemaParam<{ a: number; 33: string; [symbolKey]: () => boolean }>,
            | SetInterstateSchemaParamObj<{
                a: number;
                33: string;
                [symbolKey]: () => boolean;
              }>
            | SetInterstateSchemaParamFn<{
                a: number;
                33: string;
                [symbolKey]: () => boolean;
              }>
          >
        >,

        SetInterstateSchemaParamObj<
          { one: string; [symbolKey]: number | undefined | null },
          // @ts-expect-error
          typeof symbolKey | 'two'
        >
      ];

      const imdef = <M extends Interstate>(a: InterstateMethodsDev<M>) => a;
      const imde00: InterstateMethodsDev<Interstate> = {} as InterstateMethods<Interstate>;
      const imde01: InterstateMethodsDev<State> = {} as InterstateMethods<State>;
      const imde02: InterstateMethodsDev<Interstate> = {} as InterstateMethods<never>;
      const imde03 = imdef({} as InterstateMethods<Interstate>);
      const imde04 = imdef({} as InterstateMethods<State>);
      const imde05 = imdef({} as InterstateMethods<never>);

      type TestCase20 = [
        IsTrue<IsEqual<typeof imde03, InterstateMethodsDev<Interstate>>>,
        IsTrue<IsEqual<typeof imde04, InterstateMethodsDev<State>>>,
        IsTrue<IsEqual<typeof imde05, InterstateMethodsDev<Interstate>>>
      ];

      const iidef = <M extends Interstate>(a: InitInterstateDev<M>) => a;
      const iide00: InitInterstateDev<Interstate> = {} as InitInterstate<Interstate>;
      const iide01: InitInterstateDev<State> = {} as InitInterstate<State>;
      const iide02: InitInterstateDev<Interstate> = {} as InitInterstate<never>;
      const iide03 = iidef({} as InitInterstate<Interstate>);
      const iide04 = iidef({} as InitInterstate<State>);
      const iide05 = iidef({} as InitInterstate<never>);

      type TestCase21 = [
        IsTrue<IsEqual<typeof iide03, InitInterstateDev<Interstate>>>,
        IsTrue<IsEqual<typeof iide04, InitInterstateDev<State>>>,
        IsTrue<IsEqual<typeof iide05, InitInterstateDev<Interstate>>>
      ];

      const uidef = <M extends Interstate>(a: UseInterstateDev<M>) => a;
      const uide00: UseInterstateDev<Interstate> = {} as UseInterstate<Interstate>;
      const uide01: UseInterstateDev<State> = {} as UseInterstate<State>;
      const uide02: UseInterstateDev<Interstate> = {} as UseInterstate<never>;
      const uide03 = uidef({} as UseInterstate<Interstate>);
      const uide04 = uidef({} as UseInterstate<State>);
      const uide05 = uidef({} as UseInterstate<never>);

      type TestCase22 = [
        IsTrue<IsEqual<typeof uide03, UseInterstateDev<Interstate>>>,
        IsTrue<IsEqual<typeof uide04, UseInterstateDev<State>>>,
        IsTrue<IsEqual<typeof uide05, UseInterstateDev<Interstate>>>
      ];

      const asdef = <M extends Interstate>(a: AcceptSelectorDev<M>) => a;
      const asde00: AcceptSelectorDev<Interstate> = {} as AcceptSelector<Interstate>;
      const asde01: AcceptSelectorDev<State> = {} as AcceptSelector<State>;
      const asde02: AcceptSelectorDev<Interstate> = {} as AcceptSelector<never>;
      const asde03 = asdef({} as AcceptSelector<Interstate>);
      const asde04 = asdef({} as AcceptSelector<State>);
      const asde05 = asdef({} as AcceptSelector<never>);

      type TestCase23 = [
        IsTrue<IsEqual<typeof asde03, AcceptSelectorDev<Interstate>>>,
        IsTrue<IsEqual<typeof asde04, AcceptSelectorDev<State>>>,
        IsTrue<IsEqual<typeof asde05, AcceptSelectorDev<Interstate>>>
      ];

      const ridef = <M extends Interstate>(a: ReadInterstateDev<M>) => a;
      const ride00: ReadInterstateDev<Interstate> = {} as ReadInterstate<Interstate>;
      const ride01: ReadInterstateDev<State> = {} as ReadInterstate<State>;
      const ride02: ReadInterstateDev<Interstate> = {} as ReadInterstate<never>;
      const ride03 = ridef({} as ReadInterstate<Interstate>);
      const ride04 = ridef({} as ReadInterstate<State>);
      const ride05 = ridef({} as ReadInterstate<never>);

      type TestCase24 = [
        IsTrue<IsEqual<typeof ride03, ReadInterstateDev<Interstate>>>,
        IsTrue<IsEqual<typeof ride04, ReadInterstateDev<State>>>,
        IsTrue<IsEqual<typeof ride05, ReadInterstateDev<Interstate>>>
      ];

      const sidef = <M extends Interstate>(a: SetInterstateDev<M>) => a;
      const side00: SetInterstateDev<Interstate> = {} as SetInterstate<Interstate>;
      const side01: SetInterstateDev<State> = {} as SetInterstate<State>;
      const side02: SetInterstateDev<Interstate> = {} as SetInterstate<never>;
      const side03 = sidef({} as SetInterstate<Interstate>);
      const side04 = sidef({} as SetInterstate<State>);
      const side05 = sidef({} as SetInterstate<never>);

      type TestCase25 = [
        IsTrue<IsEqual<typeof side03, SetInterstateDev<Interstate>>>,
        IsTrue<IsEqual<typeof side04, SetInterstateDev<State>>>,
        IsTrue<IsEqual<typeof side05, SetInterstateDev<Interstate>>>
      ];
    };
  });
});
