/* eslint-disable @typescript-eslint/no-unused-vars */
export type InterstateKey = string | number | symbol;

/**
 * `_helpInfer` is a name of not runtime property of interface helping to infer type of the generic
 * parameter when a method passed as argument to some function. It is used for compatibility with
 * `Dev` aliases of types declared below.
 */
export declare const _helpInfer: unique symbol;

export interface InitInterstate {
  (): InterstateMethods<never>;

  <
    S extends object,
    A extends never[] = FilterOut<
      S,
      'must have keys' | 'must not be array' | 'must not be function'
    > extends true
      ? []
      : [never]
  >(
    ...args: A
  ): InterstateMethods<S>;

  <G, DetectExplicitGenericUse = true>(
    ...args: DetectExplicitGenericUse extends true
      ? [never] &
          (FilterOut<
            G,
            'must be object' | 'must have keys' | 'must not be array' | 'must not be function'
          > extends true
            ? TypeError<'💣💥🙈 Wrong argument not suitable to explicit generic:', G>
            : TypeError<
                '💣💥🙈 The explicit generic type must be a nonempty object; but the wrong type is provided:',
                G
              >)
      : never
  ): never;

  <S extends object, DetectExplicitGenericUse = true>(
    initStateValues: FilterOut<
      S,
      'must have keys' | 'must not be array' | 'must not be function'
    > extends true
      ? DetectExplicitGenericUse extends true
        ? Partial<S> &
            (DetectExplicitGenericUse extends DetectExplicitGenericUse
              ? unknown
              : DetectExplicitGenericUse)
        : S
      : never
  ): InterstateMethods<
    DetectExplicitGenericUse extends true
      ? S
      : { -readonly [P in keyof S]: S[P] extends undefined ? unknown : S[P] }
  >;

  <PreventExplicitGenericUse extends never, A>(
    arg: A extends A
      ? TypeError<
          '💣💥🙈 The argument must be a nonempty object; but the wrong type is provided:',
          A
        >
      : A
  ): never;

  <G extends object>(
    arg1: any,
    arg2: TypeError<'💣💥🙈 Only one argument is allowed'>,
    ...restArg: any
  ): never;
}

export interface InterstateMethods<M extends object = never> {
  useInterstate: UseInterstate<M>;

  readInterstate: ReadInterstate<M>;

  setInterstate: SetInterstate<M>;

  resetInterstate: ResetInterstate<M>;
}

export type UseInterstate<M extends object = never> = ([M] extends [never]
  ? {
      <T = unknown>(key: InterstateKey, init?: undefined): T;

      <PreventExplicitGenericUse extends never, T>(
        key: InterstateKey,
        init: FilterOut<T, 'must not be function'> extends true ? T : never
      ): T;

      <PreventExplicitGenericUse extends never, T>(key: InterstateKey, init: () => T): T;

      <G, DetectExplicitGenericUse = true>(
        key: DetectExplicitGenericUse extends true
          ? DetectExplicitGenericUse &
              TypeError<'💣💥🙈 An explicit generic type is allowed only if the init argument is omitted or undefined'>
          : never,
        init: any
      ): never;

      <PreventExplicitGenericUse extends never, K, IP>(
        possibleWrongKey: K extends InterstateKey
          ? K
          : TypeError<'💣💥🙈 The argument is not a valid key:', K>,
        possibleWrongInitParam: FilterOut<IP, 'must be function'> extends true
          ? IP &
              TypeError<
                '💣💥🙈 If the init argument is a function, it must not have parameters; but the wrong type is provided:',
                IP
              >
          : never
      ): never;

      <PreventExplicitGenericUse extends never, K extends InterstateKey>(
        keys: [K] extends [never] ? never : readonly K[]
      ): Record<K, unknown>;

      <S extends object>(
        keys: FilterOut<
          S,
          'must have keys' | 'must not be array' | 'must not be function'
        > extends true
          ? readonly (keyof S)[]
          : never
      ): S;

      <PreventExplicitGenericUse extends never, S extends object>(
        initState: FilterOut<
          S,
          'must have keys' | 'must not be array' | 'must not be function'
        > extends true
          ? S | (() => S)
          : never
      ): {
        -readonly [P in keyof S]: S[P];
      };

      <G, DetectExplicitGenericUse = true>(
        arg: DetectExplicitGenericUse extends true
          ? DetectExplicitGenericUse &
              TypeError<
                '💣💥🙈 The explicit generic type defines the type of the state record if the argument is a valid key name; or it must be an nonempty object with the list of matching keys as an argument; but the wrong type is provided:',
                G
              >
          : never
      ): never;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: FilterOut<A, 'must be array'> extends true
          ? A &
              TypeError<
                '💣💥🙈 If the argument is an array, it must be a list of valid keys; but the wrong type is provided:',
                A
              >
          : FilterOut<A, 'must be function'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is a function, it must not have parameters and must return a nonempty object; but the wrong type is provided:',
              A
            >
          : FilterOut<A, 'must be object'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is an object, it must be nonempty; but the wrong type is provided:',
              A
            >
          : TypeError<
              '💣💥🙈 The argument is expected to be either a valid key, a list of keys, a nonempty object, or a function returning a nonempty object; but the wrong type is provided:',
              A
            >
      ): never;
    }
  : {
      <PreventExplicitGenericUse extends never, K extends keyof M>(key: K, init?: undefined): M[K];

      <
        PreventExplicitGenericUse extends never,
        K extends keyof M,
        IP extends ReadonlyIfArray<M[K]>
      >(
        key: K,
        init: FilterOut<IP, 'must not be function'> extends true ? IP : never
      ): M[K];

      <
        PreventExplicitGenericUse extends never,
        K extends keyof M,
        IP extends () => ReadonlyIfArray<M[K]>
      >(
        key: K,
        init: IP
      ): M[K];

      <G, DetectExplicitGenericUse = true>(
        initState: DetectExplicitGenericUse extends true
          ? DetectExplicitGenericUse & TypeError<'💣💥🙈 An explicit generic type is not allowed'>
          : never,
        arg2?: any
      ): never;

      <PreventExplicitGenericUse extends never, K, IP>(
        possibleWrongKey: K extends keyof M
          ? K
          : TypeError<
              '💣💥🙈 The argument is not a valid key:',
              K,
              '; allowed keys are:',
              keyof M & InterstateKey
            >,
        possibleWrongInitParam: FilterOut<IP, 'must be function'> extends true
          ? ((arg: any, ...restA: any) => any) extends IP
            ? IP &
                TypeError<
                  '💣💥🙈 If the init argument is a function, it must not have parameters; but the wrong type is provided:',
                  IP
                >
            : TypeError<
                '💣💥🙈 If the init argument is a function, it must be:',
                () => M[K & keyof M],
                ', returning the valid value for the key:',
                K,
                '; but the wrong type is provided:',
                IP
              >
          : [Exclude<M[K & keyof M], (...x: any) => any>] extends [never]
          ? TypeError<
              '💣💥🙈 The init argument must be a function:',
              () => M[K & keyof M],
              ', returning the valid value for the key:',
              K,
              '; but the wrong type is provided:',
              IP
            >
          : TypeError<
              '💣💥🙈 The init argument must be the valid value if it is not a function:',
              M[K & keyof M],
              'or a function:',
              () => M[K & keyof M],
              'returning the valid value for the key:',
              K,
              '; but the wrong type is provided:',
              IP
            >
      ): never;

      <PreventExplicitGenericUse extends never, K extends keyof M>(
        keys: [K] extends [never] ? never : readonly K[]
      ): Pick<M, K>;

      <PreventExplicitGenericUse extends never, K extends keyof M>(
        initState: [K] extends [never]
          ? never
          : PickWithReadonlyArrays<M, K> | (() => PickWithReadonlyArrays<M, K>)
      ): Pick<M, K>;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: FilterOut<A, 'must be array'> extends true
          ? A &
              TypeError<
                '💣💥🙈 If the argument is an array, it must be a list of valid keys:',
                (keyof M & InterstateKey)[],
                '; but the wrong type is provided:',
                A
              >
          : FilterOut<A, 'must be function'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is a function, it must not have parameters and must return an object representing the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
          : FilterOut<A, 'must be object'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is an object, it must represent the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
          : TypeError<
              '💣💥🙈 The argument is expected to be either a valid key:',
              keyof M & InterstateKey,
              ', a list of keys:',
              (keyof M & InterstateKey)[],
              ', a nonempty object, or a function returning a nonempty object representing the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
      ): never;
    }) & {
  <G extends keyof M>(
    arg1: any,
    arg2: any,
    arg3: TypeError<'💣💥🙈 The max number of arguments is 2'>,
    ...restArg: any
  ): never;
  acceptSelector: AcceptSelector<M>;
};

export type UseInterstateInitParam<T> =
  | (() => T)
  | (T extends any ? ({} extends T ? never : Exclude<T, (...x: any) => any>) : never);

export type UseInterstateSchemaParam<M extends object, K extends keyof M = keyof M> =
  | Pick<M, K>
  | (() => Pick<M, K>);

export type AcceptSelector<M extends object = never> = ([M] extends [never]
  ? {
      <PreventExplicitGenericUse extends never, S extends object, R>(
        selector: InterstateSelector<S, R>
      ): R;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: A extends A
          ? TypeError<
              '💣💥🙈 The argument must be a valid selector function; but the wrong type is provided:',
              A
            >
          : A
      ): never;
    }
  : {
      <PreventExplicitGenericUse extends never, R>(selector: InterstateSelector<M, R>): R;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: A extends A
          ? TypeError<
              '💣💥🙈 The argument must be a valid selector function for the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
          : A
      ): never;

      [_helpInfer]?: M;
    }) & {
  <G, DetectExplicitGenericUse = true>(
    selector: DetectExplicitGenericUse extends true
      ? DetectExplicitGenericUse & TypeError<'💣💥🙈 An explicit generic type is not allowed'>
      : never
  ): never;

  <G>(arg1: any, arg2: TypeError<'💣💥🙈 Only one argument is allowed'>, ...restArg: any): never;
};

export type InterstateSelector<M extends object, R = unknown> = (readState: M) => R;

export type ReadInterstate<M extends object = never> = ([M] extends [never]
  ? {
      <T = unknown>(key: InterstateKey): T;

      <PreventExplicitGenericUse extends never, K extends InterstateKey>(
        keys: [K] extends [never] ? never : readonly K[]
      ): Record<K, unknown>;

      <S extends object>(
        keys: FilterOut<
          S,
          'must have keys' | 'must not be array' | 'must not be function'
        > extends true
          ? readonly (keyof S)[]
          : never
      ): S;

      <G, DetectExplicitGenericUse = true>(
        arg: DetectExplicitGenericUse extends true
          ? DetectExplicitGenericUse &
              TypeError<
                '💣💥🙈 The explicit generic type defines the type of the state record if the argument is a valid key name; or it must be an nonempty object with the list of matching keys as an argument; but the wrong type is provided:',
                G
              >
          : never
      ): never;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: FilterOut<A, 'must be array'> extends true
          ? A &
              TypeError<
                '💣💥🙈 If the argument is an array, it must be a list of valid keys; but the wrong type is provided:',
                A
              >
          : TypeError<
              '💣💥🙈 The argument is expected to be either a valid key or a list of keys; but the wrong type is provided:',
              A
            >
      ): never;
    }
  : {
      <PreventExplicitGenericUse extends never, K extends keyof M>(key: K): M[K];

      <PreventExplicitGenericUse extends never, K extends keyof M>(
        keys: [K] extends [never] ? never : readonly K[]
      ): Pick<M, K>;

      <G, DetectExplicitGenericUse = true>(
        initState: DetectExplicitGenericUse extends true
          ? DetectExplicitGenericUse & TypeError<'💣💥🙈 An explicit generic type is not allowed'>
          : never
      ): never;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: FilterOut<A, 'must be array'> extends true
          ? A &
              TypeError<
                '💣💥🙈 If the argument is an array, it must be a list of valid keys:',
                (keyof M & InterstateKey)[],
                '; but the wrong type is provided:',
                A
              >
          : TypeError<
              '💣💥🙈 The argument is expected to be either a valid key:',
              keyof M & InterstateKey,
              ', a list of keys:',
              (keyof M & InterstateKey)[],
              '; but the wrong type is provided:',
              A
            >
      ): never;
    }) & {
  <G>(
    arg1: any,
    arg2: TypeError<'💣💥🙈 The max number of arguments is 1'>,
    ...restArg: any
  ): never;

  acceptSelector: AcceptSelector<M>;
};

export type SetInterstate<M extends object = never> = ([M] extends [never]
  ? {
      <PreventExplicitGenericUse extends never, T>(
        key: InterstateKey,
        setter: FilterOut<T, 'must not be function'> extends true ? T : never
      ): void;

      <PreventExplicitGenericUse extends never, T>(
        key: InterstateKey,
        setter: (prevValue: T) => T
      ): void;

      <G, DetectExplicitGenericUse = true>(
        setter: DetectExplicitGenericUse extends true
          ? DetectExplicitGenericUse & TypeError<'💣💥🙈 An explicit generic type is not allowed'>
          : never,
        arg2?: any
      ): never;

      <PreventExplicitGenericUse extends never, K, SP>(
        possibleWrongKey: K extends InterstateKey
          ? K
          : TypeError<'💣💥🙈 The argument is not a valid key:', K>,
        possibleWrongSetter: FilterOut<SP, 'must be function'> extends true
          ? SP &
              TypeError<
                '💣💥🙈 If the setter argument is a function, it must have one parameter (if any) of the same type as the returned value; but the wrong type is provided:',
                SP
              >
          : never
      ): never;

      <PreventExplicitGenericUse extends never, S extends object>(
        setter: FilterOut<
          S,
          'must have keys' | 'must not be array' | 'must not be function'
        > extends true
          ? S | (() => S)
          : never
      ): void;

      <PreventExplicitGenericUse extends never, SParam extends object, SReturn extends object>(
        setter: [
          FilterOut<SParam, 'must have keys' | 'must not be array' | 'must not be function'>,
          FilterOut<SReturn, 'must have keys' | 'must not be array' | 'must not be function'>
        ] extends [true, true]
          ? [SReturn] extends [
              {
                [P in keyof SReturn as P extends keyof SParam ? P : never]: SParam[P &
                  keyof SParam];
              }
            ]
            ? (prevState: SParam) => SReturn
            : never
          : never
      ): void;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: FilterOut<A, 'must be function'> extends true
          ? A &
              TypeError<
                '💣💥🙈 If the argument is a function, it must have one parameter (if any) and must return an object not conflicted with type of the parameter; but the wrong type is provided:',
                A
              >
          : FilterOut<A, 'must be object'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is an object, it must be nonempty; but the wrong type is provided:',
              A
            >
          : TypeError<
              '💣💥🙈 The argument is expected to be either an object or valid setter function; but the wrong type is provided:',
              A
            >
      ): never;
    }
  : {
      <PreventExplicitGenericUse extends never, K extends keyof M, SP>(
        key: K,
        setter: FilterOut<SP, 'must not be function'> extends true
          ? SP extends ReadonlyIfArray<M[K]>
            ? SP
            : never
          : never
      ): void;

      <
        PreventExplicitGenericUse extends never,
        K extends keyof M,
        SP extends (prevValue: M[K]) => ReadonlyIfArray<M[K]>
      >(
        key: K,
        setter: SP
      ): void;

      <G, DetectExplicitGenericUse = true>(
        setter: DetectExplicitGenericUse extends true
          ? DetectExplicitGenericUse & TypeError<'💣💥🙈 An explicit generic type is not allowed'>
          : never,
        arg2?: any
      ): never;

      <PreventExplicitGenericUse extends never, K, SP>(
        possibleWrongKey: K extends keyof M
          ? K
          : TypeError<
              '💣💥🙈 The argument is not a valid key:',
              K,
              '; allowed keys are:',
              keyof M & InterstateKey
            >,
        possibleWrongInitParam: FilterOut<SP, 'must be function'> extends true
          ? ((arg1: any, arg2: any, ...restA: any) => any) extends SP
            ? SP &
                TypeError<
                  '💣💥🙈 If the setter is a function, it must have one parameter (if any) of type:',
                  M[K & keyof M],
                  '; but the wrong type is provided:',
                  SP
                >
            : TypeError<
                '💣💥🙈 If the setter is a function, it must be:',
                ((prevValue: M[K & keyof M]) => M[K & keyof M]) | (() => M[K & keyof M]),
                ', returning the valid value for the key:',
                K,
                '; but the wrong type is provided:',
                SP
              >
          : [Exclude<M[K & keyof M], (...x: any) => any>] extends [never]
          ? TypeError<
              '💣💥🙈 The setter must be a function:',
              ((prevValue: M[K & keyof M]) => M[K & keyof M]) | (() => M[K & keyof M]),
              ', returning the valid value for the key:',
              K,
              '; but the wrong type is provided:',
              SP
            >
          : TypeError<
              '💣💥🙈 The setter must be the valid value if it is not a function:',
              M[K & keyof M],
              'or a function:',
              ((prevValue: M[K & keyof M]) => M[K & keyof M]) | (() => M[K & keyof M]),
              'returning the valid value for the key:',
              K,
              '; but the wrong type is provided:',
              SP
            >
      ): never;

      <PreventExplicitGenericUse extends never, K extends keyof M>(
        setter: [K] extends [never] ? never : PickWithReadonlyArrays<M, K>
      ): void;

      <
        PreventExplicitGenericUse extends never,
        K extends keyof M,
        SP extends (prevState: M) => any
      >(
        setter: [K] extends [never] ? never : SP & ((prevState: M) => PickWithReadonlyArrays<M, K>)
      ): void;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: A extends keyof M
          ? [Exclude<M[A & keyof M], (...x: any) => any>] extends [never]
            ? A &
                TypeError<
                  '💣💥🙈 The second argument for the key:',
                  A,
                  'is expected; it must be:',
                  ((prevValue: M[A & keyof M]) => M[A & keyof M]) | (() => M[A & keyof M])
                >
            : TypeError<
                '💣💥🙈 The second argument for the key:',
                A,
                'is expected; it must be:',
                | M[A & keyof M]
                | ((prevValue: M[A & keyof M]) => M[A & keyof M])
                | (() => M[A & keyof M])
              >
          : FilterOut<A, 'must be function'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is a function, it must have one parameter (if any) for the state:',
              M,
              'and return an object representing the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
          : FilterOut<A, 'must be object' | 'must not be array'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is an object, it must represent the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
          : TypeError<
              '💣💥🙈 The argument is expected to be either a nonempty object, or a function returning a nonempty object representing the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
      ): never;

      [_helpInfer]?: M;
    }) & {
  <G>(
    arg1: any,
    arg2: any,
    arg3: TypeError<'💣💥🙈 The max number of arguments is 2'>,
    ...restArg: any
  ): never;
};

export type SetInterstateParam<T> =
  | ((prevValue: T) => T)
  | (T extends any ? ({} extends T ? never : Exclude<T, (...x: any) => any>) : never);

export type SetInterstateSchemaParam<M extends object, K extends keyof M = keyof M> =
  | Pick<M, K>
  | ((prevState: M) => Pick<M, K>);

export type ResetInterstate<M extends object = never> = ([M] extends [never]
  ? {
      <PreventExplicitGenericUse extends never, S extends object>(
        initStateValues: FilterOut<
          S,
          'must have keys' | 'must not be array' | 'must not be function'
        > extends true
          ? S
          : never
      ): void;

      <G, DetectExplicitGenericUse = true>(
        ...wrongArgs: DetectExplicitGenericUse extends true
          ? [never] &
              DetectExplicitGenericUse &
              TypeError<'💣💥🙈 An explicit generic type is not allowed'>
          : never
      ): never;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: [A] extends [A]
          ? TypeError<
              '💣💥🙈 The argument must be a nonempty object; but the wrong type is provided:',
              A
            >
          : A
      ): never;
    }
  : {
      <PreventExplicitGenericUse extends never, ISV extends object>(
        initStateValues: FilterOut<
          ISV,
          'must have keys' | 'must not be array' | 'must not be function'
        > extends true
          ? ISV & { [P in keyof M]?: ReadonlyIfArray<M[P]> }
          : never
      ): void;

      <G, DetectExplicitGenericUse = true>(
        ...wrongArgs: DetectExplicitGenericUse extends true
          ? [never] &
              DetectExplicitGenericUse &
              TypeError<'💣💥🙈 An explicit generic type is not allowed'>
          : never
      ): never;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: [A] extends [A]
          ? TypeError<
              '💣💥🙈 The argument must be a nonempty object representing the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
          : A
      ): never;

      [_helpInfer]?: M;
    }) & {
  (): void;

  <G extends object>(
    arg1: any,
    arg2: TypeError<'💣💥🙈 Only one argument is allowed'>,
    ...restArg: any
  ): never;
};

declare const DeclareTypeError: unique symbol;
type DeclareTypeError = typeof DeclareTypeError;

type FilterOut<
  T,
  Filter extends
    | 'must be object'
    | 'must have keys'
    | 'must be array'
    | 'must not be array'
    | 'must be function'
    | 'must not be function'
> = ProcessFilterBlock<
  [
    [T, object, 'must be object', 'n/a'],
    [keyof T, never, 'n/a', 'must have keys'],
    [T, readonly any[], 'must be array', 'must not be array'],
    [T, (...x: any[]) => any, 'must be function', 'must not be function']
  ],
  Filter
>;

type ProcessFilterBlock<
  CurrentFilterBlocks extends FilterBlock[],
  FilterKeys
> = CurrentFilterBlocks extends []
  ? true
  : CurrentFilterBlocks extends [
      [infer WhatToTest, infer WhatMustExtend, infer TrueFilterKey, infer FalseFilterKey],
      ...InferGuard<infer RestFilterBlocks, FilterBlock[]>
    ]
  ? TestToFilter<
      TrueFilterKey extends FilterKeys ? true : false,
      FalseFilterKey extends FilterKeys ? true : false,
      WhatToTest,
      WhatMustExtend
    > extends infer IntermediateResult
    ? IntermediateResult extends true
      ? ProcessFilterBlock<RestFilterBlocks, FilterKeys>
      : IntermediateResult
    : never
  : never;

type FilterBlock = [
  WhatToTest: unknown,
  MustToExtends: unknown,
  TrueFilterKey: string,
  FalseFilterKey: string
];

type TestToFilter<
  MustExt extends boolean,
  MustNotExt extends boolean,
  WhatToTest,
  WhatMustExtend
> = [MustExt, MustNotExt, [WhatToTest] extends [WhatMustExtend] ? true : false] extends
  | [false, false, any]
  | [true, false, true]
  | [false, true, false]
  ? true
  : [MustExt, MustNotExt] extends [true, true]
  ? never
  : false;

type InferGuard<T extends Guard, Guard> = T extends Guard ? T : never;

type TypeError<
  Msg1 extends string = string,
  Msg2 = '',
  Msg3 = '',
  Msg4 = '',
  Msg5 = '',
  Msg6 = '',
  Msg7 = '',
  Msg8 = ''
> = {
  [P in DeclareTypeError]: Msg1;
};

type ReadonlyIfArray<T> = T extends any[] ? Readonly<T> : T;

type PickWithReadonlyArrays<O, K extends keyof O> = { [P in K]: ReadonlyIfArray<O[P]> };
