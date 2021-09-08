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

  <PreventExplicitGenericUse extends never, S extends object>(
    initStateValues: FilterOut<
      S,
      'must have keys' | 'must not be array' | 'must not be function'
    > extends true
      ? S
      : never
  ): InterstateMethods<{ -readonly [P in keyof S]: S[P] extends undefined ? unknown : S[P] }>;

  <S extends object = never, DetectExplicitGenericUse = [S] extends [never] ? false : true>(
    initStateValues: [
      DetectExplicitGenericUse,
      FilterOut<S, 'must have keys' | 'must not be array' | 'must not be function'>,
      S
    ] extends [true, true, infer SD]
      ? Partial<SD>
      : never
  ): InterstateMethods<S>;

  <G = never, DetectExplicitGenericUse = [G] extends [never] ? false : true>(
    ...wrongArgs: DetectExplicitGenericUse extends true
      ? [never] &
          (FilterOut<
            G,
            'must be object' | 'must have keys' | 'must not be array' | 'must not be function'
          > extends true
            ? TypeError<'💣💥🙈 The argument is not suitable to explicit generic:', G>
            : TypeError<
                '💣💥🙈 The explicit generic type is expected to be a nonempty object; but the wrong type is provided:',
                G
              >)
      : never
  ): never;

  <PreventExplicitGenericUse extends never, A>(
    wrongArg: A extends A
      ? TypeError<
          '💣💥🙈 The argument is expected to be a nonempty object; but the wrong type is provided:',
          A
        >
      : A
  ): never;

  <G>(
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
      <T = unknown>(key: InterstateKey, initParam?: undefined): T;

      <PreventExplicitGenericUse extends never, T>(
        key: InterstateKey,
        initParam: FilterOut<T, 'must not be function'> extends true ? T : never
      ): T;

      <PreventExplicitGenericUse extends never, T>(key: InterstateKey, init: () => T): T;

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
          : never,

        deps?: readonly any[]
      ): {
        -readonly [P in keyof S]: S[P];
      };

      <G = never, DetectExplicitGenericUse = [G] extends [never] ? false : true>(
        firstArg: DetectExplicitGenericUse extends true
          ? TypeError<
              '💣💥🙈 The explicit generic type defines the type of the state value if the argument is a valid key with no init value being provided; it also can be a nonempty object in the case of the argument being a list of the matching keys; but the wrong type is provided:',
              G
            >
          : never,

        secondArg?: any
      ): never;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: FilterOut<A, 'must be array'> extends true
          ? A &
              TypeError<
                '💣💥🙈 If the argument is an array, it is expected to be a list of valid keys; but the wrong type is provided:',
                A
              >
          : FilterOut<A, 'must be function'> extends true
          ? ((arg: any, ...restA: any) => any) extends A
            ? TypeError<
                '💣💥🙈 If the argument is a function, it is expected to have no parameters; but the wrong type is provided:',
                A
              >
            : TypeError<
                '💣💥🙈 If the argument is a function, it is expected to return a nonempty object; but the wrong type is provided:',
                A
              >
          : FilterOut<A, 'must be object'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is an object, it is expected to be nonempty; but the wrong type is provided:',
              A
            >
          : TypeError<
              '💣💥🙈 The argument is expected to be either a valid key, list of keys, object, or function returning an object; but the wrong type is provided:',
              A
            >
      ): never;

      <PreventExplicitGenericUse extends never, FA, SA>(
        firstArg: FA extends readonly [InterstateKey, ...InterstateKey[]]
          ? FA
          : FA extends infer FAD
          ? [
              FAD,
              FilterOut<
                FAD,
                'must be object' | 'must have keys' | 'must not be array' | 'must not be function'
              >,
              FAD extends () => infer FAR
                ? FilterOut<
                    FAR,
                    | 'must be object'
                    | 'must have keys'
                    | 'must not be array'
                    | 'must not be function'
                  > extends true
                  ? 'valid init parameter'
                  : 'wrong parameter'
                : 'not a case'
            ] extends [InterstateKey, any, any] | [any, true, any] | [any, any, 'valid parameter']
            ? FAD
            : TypeError<
                '💣💥🙈 The first argument is expected to be either a valid key, list of keys, nonempty object, or function with no parameters returning a nonempty object; but the wrong type is provided:',
                FAD
              >
          : never,

        secondArg: FA extends InterstateKey
          ? FilterOut<SA, 'must be function'> extends true
            ? SA &
                TypeError<
                  '💣💥🙈 If the second argument is a function, it is expected to have no parameters; but the wrong type is provided:',
                  SA
                >
            : never
          : FilterOut<FA, 'must be array'> extends true
          ? TypeError<'💣💥🙈 No second argument is allowed'>
          : TypeError<
              '💣💥🙈 The second argument is optional and expected to be a list of deps; but the wrong type is provided:',
              SA
            >
      ): never;

      acceptSelector: {
        <PreventExplicitGenericUse extends never, S extends object, R>(
          selector: InterstateSelector<S, R>,
          deps?: readonly any[]
        ): R;

        <PreventExplicitGenericUse extends never, A>(
          wrongArg: ((arg1: any, arg2: any, ...restA: any) => any) extends A
            ? A &
                TypeError<
                  '💣💥🙈 The argument is expected to be a valid selector function with one parameter (if any); but the wrong type is provided:',
                  A
                >
            : TypeError<
                '💣💥🙈 The argument is expected to be a valid selector function; but the wrong type is provided:',
                A
              >
        ): never;

        <PreventExplicitGenericUse extends never, FA, SA>(
          firstArg: ((arg1: any, arg2: any, ...restA: any) => any) extends FA
            ? TypeError<
                '💣💥🙈 The first argument is expected to be a valid selector function with one parameter (if any); but the wrong type is provided:',
                FA
              >
            : FA extends InterstateSelector<object, unknown>
            ? FA
            : TypeError<
                '💣💥🙈 The first arguments is expected to be a valid selector function; but the wrong type is provided:',
                FA
              >,

          secondArg: FA extends InterstateSelector<object, unknown>
            ? TypeError<
                '💣💥🙈 The second argument is optional and expected to be a list of deps; but the wrong type is provided:',
                SA
              >
            : SA
        ): never;
      };
    }
  : {
      <PreventExplicitGenericUse extends never, K extends keyof M>(
        key: K,
        initParam?: undefined
      ): M[K];

      <
        PreventExplicitGenericUse extends never,
        K extends keyof M,
        IP extends ReadonlyIfArray<M[K]>
      >(
        key: K,
        initParam: FilterOut<IP, 'must not be function'> extends true ? IP : never
      ): M[K];

      <
        PreventExplicitGenericUse extends never,
        K extends keyof M,
        IP extends () => ReadonlyIfArray<M[K]>
      >(
        key: K,
        initParam: IP
      ): M[K];

      <PreventExplicitGenericUse extends never, K extends keyof M>(
        keys: [K] extends [never] ? never : readonly K[]
      ): Pick<M, K>;

      <PreventExplicitGenericUse extends never, K extends keyof M>(
        initState: [K] extends [never]
          ? never
          : PickWithReadonlyArrays<M, K> | (() => PickWithReadonlyArrays<M, K>),

        deps?: readonly any[]
      ): Pick<M, K>;

      <G = never, DetectExplicitGenericUse = [G] extends [never] ? false : true>(
        firstParam: DetectExplicitGenericUse extends true
          ? TypeError<'💣💥🙈 No explicit generic type is allowed'>
          : never,

        secondParam?: any
      ): never;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: FilterOut<A, 'must be array'> extends true
          ? A &
              TypeError<
                '💣💥🙈 If the argument is an array, it is expected to be a list of valid keys:',
                (keyof M & InterstateKey)[],
                '; but the wrong type is provided:',
                A
              >
          : FilterOut<A, 'must be function'> extends true
          ? ((arg: any, ...restA: any) => any) extends A
            ? A &
                TypeError<
                  '💣💥🙈 If the argument is a function, it is expected to have no parameters; but the wrong type is provided:',
                  A
                >
            : TypeError<
                '💣💥🙈 If the argument is a function, it is expected to return an object representing the part of the state:',
                M,
                '; but the wrong type is provided:',
                A
              >
          : FilterOut<A, 'must be object' | 'must not be array'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is an object, it is expected to represent the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
          : TypeError<
              '💣💥🙈 The argument is expected to be either a valid key:',
              keyof M & InterstateKey,
              ', a list of keys, object, or function returning an object representing the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
      ): never;

      <PreventExplicitGenericUse extends never, FA, SA>(
        firstArg: FA extends readonly [keyof M, ...(keyof M)[]]
          ? FA
          : FA extends infer FAD
          ? [
              FAD,
              FilterOut<FAD, 'must have keys'>,
              FAD extends (keyof FAD extends keyof M ? PickWithReadonlyArrays<M, keyof FAD> : never)
                ? 'valid init parameter'
                : 'not a case',
              FAD extends () => infer FAR
                ? FAR extends (
                    keyof FAR extends keyof M ? PickWithReadonlyArrays<M, keyof FAR> : never
                  )
                  ? 'valid init parameter'
                  : 'wrong parameter'
                : 'not a case'
            ] extends
              | [keyof M, any, any, any]
              | [any, true, 'valid init parameter', any]
              | [any, any, any, 'valid init parameter']
            ? FAD
            : TypeError<
                '💣💥🙈 The first argument is expected to be either a valid key:',
                keyof M & InterstateKey,
                ', a list of keys, object, or function returning an object representing the part of the state:',
                M,
                '; but the wrong type is provided:',
                FA
              >
          : never,

        secondArg: FA extends keyof M
          ? [Exclude<M[FA], (...x: any) => any>] extends [never]
            ? SA &
                TypeError<
                  '💣💥🙈 The allowed type of the second argument is:',
                  () => M[FA],
                  '; but the wrong type is provided:',
                  SA
                >
            : TypeError<
                '💣💥🙈 The allowed type of the second argument is:',
                M[FA] | (() => M[FA]),
                '; but the wrong type is provided:',
                SA
              >
          : FilterOut<FA, 'must be array'> extends true
          ? TypeError<'💣💥🙈 No second argument is allowed'>
          : TypeError<
              '💣💥🙈 The second argument is optional and expected to be a list of deps; but the wrong type is provided:',
              SA
            >
      ): never;

      acceptSelector: {
        <PreventExplicitGenericUse extends never, R>(
          selector: InterstateSelector<M, R>,
          deps?: readonly any[]
        ): R;

        <PreventExplicitGenericUse extends never, A>(
          wrongArg: A extends A
            ? TypeError<
                '💣💥🙈 The argument is expected to be a valid selector function for the state:',
                M,
                '; but the wrong type is provided:',
                A
              >
            : A
        ): never;

        <PreventExplicitGenericUse extends never, FA, SA>(
          firstArg: FA extends InterstateSelector<M, unknown>
            ? FA
            : TypeError<
                '💣💥🙈 The first argument is expected to be a valid selector function for the state:',
                M,
                '; but the wrong type is provided:',
                FA
              >,

          secondArg: FA extends InterstateSelector<M, unknown>
            ? TypeError<
                '💣💥🙈 The second argument is optional and expected to be a list of deps; but the wrong type is provided:',
                SA
              >
            : SA
        ): never;
      };

      [_helpInfer]?: M;
    }) & {
  <G>(
    arg1: any,
    arg2: any,
    arg3: TypeError<'💣💥🙈 The max number of arguments is 2'>,
    ...restArg: any
  ): never;

  acceptSelector: {
    <G = never, DetectExplicitGenericUse = [G] extends [never] ? false : true>(
      firstArg: DetectExplicitGenericUse extends true
        ? TypeError<'💣💥🙈 No explicit generic type is allowed'>
        : never,

      secondArg?: any
    ): never;

    <G>(
      arg1: any,
      arg2: any,
      arg3: TypeError<'💣💥🙈 The max number of arguments is 2'>,
      ...restArg: any
    ): never;
  };
};

export type UseInterstateInitParam<T> =
  | (() => T)
  | (T extends any ? ({} extends T ? never : Exclude<T, (...x: any) => any>) : never);

export type UseInterstateSchemaParam<M extends object, K extends keyof M = keyof M> =
  | Pick<M, K>
  | (() => Pick<M, K>);

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

      <G = never, DetectExplicitGenericUse = [G] extends [never] ? false : true>(
        arg: DetectExplicitGenericUse extends true
          ? TypeError<
              '💣💥🙈 The explicit generic type defines the type of the state value if the argument is a valid key; it also can be a nonempty object in the case of the argument being a list of the matching keys; but the wrong type is provided:',
              G
            >
          : never
      ): never;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: FilterOut<A, 'must be array'> extends true
          ? A &
              TypeError<
                '💣💥🙈 If the argument is an array, it is expected to be a list of valid keys; but the wrong type is provided:',
                A
              >
          : TypeError<
              '💣💥🙈 The argument is expected to be either a valid key or list of keys; but the wrong type is provided:',
              A
            >
      ): never;

      acceptSelector: {
        <PreventExplicitGenericUse extends never, S extends object, R>(
          selector: InterstateSelector<S, R>
        ): R;

        <PreventExplicitGenericUse extends never, A>(
          wrongArg: ((arg1: any, arg2: any, ...restA: any) => any) extends A
            ? A &
                TypeError<
                  '💣💥🙈 The argument is expected to be a valid selector function with one parameter (if any); but the wrong type is provided:',
                  A
                >
            : TypeError<
                '💣💥🙈 The argument is expected to be a valid selector function; but the wrong type is provided:',
                A
              >
        ): never;
      };
    }
  : {
      <PreventExplicitGenericUse extends never, K extends keyof M>(key: K): M[K];

      <PreventExplicitGenericUse extends never, K extends keyof M>(
        keys: [K] extends [never] ? never : readonly K[]
      ): Pick<M, K>;

      <G = never, DetectExplicitGenericUse = [G] extends [never] ? false : true>(
        initState: DetectExplicitGenericUse extends true
          ? TypeError<'💣💥🙈 No explicit generic type is allowed'>
          : never
      ): never;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: FilterOut<A, 'must be array'> extends true
          ? A &
              TypeError<
                '💣💥🙈 If the argument is an array, it is expected to be a list of valid keys:',
                (keyof M & InterstateKey)[],
                '; but the wrong type is provided:',
                A
              >
          : TypeError<
              '💣💥🙈 The argument is expected to be either a valid key:',
              keyof M & InterstateKey,
              ', or a list of keys; but the wrong type is provided:',
              A
            >
      ): never;

      acceptSelector: {
        <PreventExplicitGenericUse extends never, R>(selector: InterstateSelector<M, R>): R;

        <PreventExplicitGenericUse extends never, A>(
          wrongArg: A extends A
            ? TypeError<
                '💣💥🙈 The argument is expected to be a valid selector function for the state:',
                M,
                '; but the wrong type is provided:',
                A
              >
            : A
        ): never;
      };

      [_helpInfer]?: M;
    }) & {
  <G>(arg1: any, arg2: TypeError<'💣💥🙈 Only one argument is allowed'>, ...restArg: any): never;

  acceptSelector: {
    <G = never, DetectExplicitGenericUse = [G] extends [never] ? false : true>(
      selector: DetectExplicitGenericUse extends true
        ? TypeError<'💣💥🙈 No explicit generic type is allowed'>
        : never
    ): never;

    <G>(arg1: any, arg2: TypeError<'💣💥🙈 Only one argument is allowed'>, ...restArg: any): never;
  };
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

      <G = never, DetectExplicitGenericUse = [G] extends [never] ? false : true>(
        firstArg: DetectExplicitGenericUse extends true
          ? TypeError<'💣💥🙈 No explicit generic type is allowed'>
          : never,

        secondArg?: any
      ): never;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: FilterOut<A, 'must be function'> extends true
          ? A &
              TypeError<
                '💣💥🙈 If the argument is a function, it is expected to have one parameter (if any) and return a nonempty object not conflicting with the type of the parameter; but the wrong type is provided:',
                A
              >
          : FilterOut<A, 'must be object' | 'must not be array'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is an object, it is expected to be nonempty; but the wrong type is provided:',
              A
            >
          : TypeError<
              '💣💥🙈 The argument is expected to be either a nonempty object or valid setter function; but the wrong type is provided:',
              A
            >
      ): never;

      <PreventExplicitGenericUse extends never, FA, SA>(
        firstArg: FA extends InterstateKey
          ? FA
          : TypeError<'💣💥🙈 The argument is not a valid key:', FA>,

        secondArg: FilterOut<SA, 'must be function'> extends true
          ? SA &
              TypeError<
                '💣💥🙈 If the second argument is a function, it is expected to have one parameter (if any) of the same type as the returned value; but the wrong type is provided:',
                SA
              >
          : never
      ): never;
    }
  : {
      <PreventExplicitGenericUse extends never, K extends keyof M, SP>(
        key: K,

        setter: [FilterOut<SP, 'must not be function'>, SP] extends [true, ReadonlyIfArray<M[K]>]
          ? SP
          : never
      ): void;

      <PreventExplicitGenericUse extends never, K extends keyof M>(
        key: K,
        setter: (prevValue: M[K]) => ReadonlyIfArray<M[K]>
      ): void;

      <PreventExplicitGenericUse extends never, K extends keyof M>(
        setter: [K] extends [never] ? never : PickWithReadonlyArrays<M, K>
      ): void;

      <PreventExplicitGenericUse extends never, K extends keyof M>(
        setter: [K] extends [never] ? never : (prevState: M) => PickWithReadonlyArrays<M, K>
      ): void;

      <G = never, DetectExplicitGenericUse = [G] extends [never] ? false : true>(
        firstArg: DetectExplicitGenericUse extends true
          ? TypeError<'💣💥🙈 No explicit generic type is allowed'>
          : never,

        secondArg?: any
      ): never;

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: A extends keyof M
          ? [Exclude<M[A], (...x: any) => any>] extends [never]
            ? A &
                TypeError<
                  '💣💥🙈 The second argument for the key:',
                  A,
                  'is expected:',
                  ((prevValue: M[A]) => M[A]) | (() => M[A])
                >
            : TypeError<
                '💣💥🙈 The second argument for the key:',
                A,
                'is expected:',
                M[A] | ((prevValue: M[A]) => M[A]) | (() => M[A])
              >
          : FilterOut<A, 'must be function'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is a function, it is expected to take the state:',
              M,
              'as an argument and return an object representing the part of the state; but the wrong type is provided:',
              A
            >
          : FilterOut<A, 'must be object' | 'must not be array'> extends true
          ? TypeError<
              '💣💥🙈 If the argument is an object, it is expected to represent the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
          : TypeError<
              '💣💥🙈 The argument is expected to be either an object, or function returning an object representing the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
      ): never;

      <PreventExplicitGenericUse extends never, FA, SA>(
        firstArg: FA extends keyof M
          ? FA
          : TypeError<
              '💣💥🙈 The argument is not a valid key:',
              FA,
              '; allowed keys are:',
              keyof M & InterstateKey
            >,

        secondArg: FA extends keyof M
          ? [Exclude<M[FA], (...x: any) => any>] extends [never]
            ? SA &
                TypeError<
                  '💣💥🙈 The allowed type of the second argument is:',
                  ((prevValue: M[FA]) => M[FA]) | (() => M[FA]),
                  '; but the wrong type is provided:',
                  SA
                >
            : TypeError<
                '💣💥🙈 The allowed type of the second argument is:',
                M[FA] | ((prevValue: M[FA]) => M[FA]) | (() => M[FA]),
                '; but the wrong type is provided:',
                SA
              >
          : never
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

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: A extends A
          ? TypeError<
              '💣💥🙈 The argument is expected to be a nonempty object; but the wrong type is provided:',
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

      <PreventExplicitGenericUse extends never, A>(
        wrongArg: [A] extends [A]
          ? TypeError<
              '💣💥🙈 The argument is expected to be an object representing the part of the state:',
              M,
              '; but the wrong type is provided:',
              A
            >
          : A
      ): never;

      [_helpInfer]?: M;
    }) & {
  (): void;

  <G = never, DetectExplicitGenericUse = [G] extends [never] ? false : true>(
    ...wrongArgs: DetectExplicitGenericUse extends true
      ? [never] & TypeError<'💣💥🙈 No explicit generic type is allowed'>
      : never
  ): never;

  <G>(arg1: any, arg2: TypeError<'💣💥🙈 Only one argument is allowed'>, ...restArg: any): never;
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
