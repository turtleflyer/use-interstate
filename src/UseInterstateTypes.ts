import type { _fixInfer } from './fixInferKey';

export type InterstateKey = string | symbol;

export type Interstate = Record<InterstateKey, unknown>;

export type GoInterstate = <M extends Interstate = never>() => InterstateMethods<M>;

export interface InterstateMethods<M extends Interstate> {
  initInterstate: InitInterstate<M>;

  useInterstate: UseInterstate<M>;

  readInterstate: ReadInterstate<M>;

  setInterstate: SetInterstate<M>;
}

export type InitInterstate<M extends Interstate = never> = [M] extends [never]
  ? {
      <S extends Interstate>(initParam?: S & EliminateFunction<S>): Omit<
        InterstateMethods<M>,
        'initInterstate'
      >;

      [_fixInfer]?: Interstate;
    }
  : <K extends ExtraStringKeys<M>, SI = Pick<M, K>>(
      initParam?: Pick<M, K> & SI & EliminateFunction<SI>
    ) => Omit<InterstateMethods<M>, 'initInterstate'>;

export type UseInterstate<M extends Interstate = never> = ([M] extends [never]
  ? {
      (key: InterstateKey, init?: undefined): unknown;

      <T, TI = UseInterstateInitParam<T>>(
        key: InterstateKey,
        init?: UseInterstateInitParam<T> & TI & EliminateFunction<TI, []>
      ): T;

      <S extends Interstate>(initState: UseInterstateSchemaParamFn<S>): UnReadOnly<S>;

      <S extends Interstate = never, SI = UseInterstateSchemaParamObj<S>>(
        initState: UseInterstateSchemaParamObj<S> & SI & EliminateFunctionsAlsoInProperties<SI, []>
      ): NormalizeUndefined<S, SI>;

      <K extends InterstateKey>(keys: readonly K[]): Record<K, unknown>;

      <S extends Interstate>(keys: readonly OnlyStringKeys<S>[]): S;
    }
  : {
      <K extends OnlyStringKeys<M>, TI = UseInterstateInitParam<M[K]>>(
        key: K,
        init?: UseInterstateInitParam<M[K]> & TI & EliminateFunction<TI, []>
      ): M[K];

      <K extends ExtraStringKeys<M>, SI = UseInterstateSchemaParam<M, K>>(
        initState: UseInterstateSchemaParam<M, K> & SI & EliminateFunctionsAlsoInProperties<SI, []>
      ): Pick<M, K>;

      <K extends OnlyStringKeys<M>>(keys: readonly K[]): Pick<M, K>;
    }) & {
  acceptSelector: AcceptSelector<M>;
};

export type UseInterstateInitParam<T> = Exclude<T, ((...x: any) => any) | undefined> | (() => T);

export type UseInterstateSchemaParam<M extends Interstate, K extends keyof M = keyof M> =
  | UseInterstateSchemaParamObj<M, K>
  | UseInterstateSchemaParamFn<M, K>;

export type UseInterstateSchemaParamObj<M extends Interstate, K extends keyof M = keyof M> = {
  [P in K]: UseInterstateInitParam<M[P]> | undefined;
};

export type UseInterstateSchemaParamFn<
  M extends Interstate,
  K extends keyof M = keyof M
> = () => Pick<M, K>;

export type AcceptSelector<M extends Interstate = never> = [M] extends [never]
  ? <S extends Interstate, R>(selector: InterstateSelector<S, R>) => R
  : <R>(selector: InterstateSelector<M, R>) => R;

export type InterstateSelector<M extends Interstate, R = unknown> = (readState: M) => R;

type NormalizeUndefined<S0, S1> = {
  -readonly [P in keyof S1]: S1[P] extends undefined
    ? unknown
    : S0[(P | `${P & number}`) & keyof S0];
};

export type ReadInterstate<M extends Interstate = never> = ([M] extends [never]
  ? {
      <T = unknown>(key: InterstateKey): T;

      <K extends InterstateKey>(keys: readonly K[]): Record<K, unknown>;

      <S extends Interstate>(keys: readonly OnlyStringKeys<S>[]): S;
    }
  : {
      <K extends OnlyStringKeys<M>>(key: K): M[K];

      <K extends OnlyStringKeys<M>>(keys: readonly K[]): Pick<M, K>;
    }) & {
  acceptSelector: AcceptSelector<M>;
};

export type SetInterstate<M extends Interstate = never> = [M] extends [never]
  ? {
      <T, TI = SetInterstateParam<T>>(
        key: InterstateKey,
        set: SetInterstateParam<T> & TI & EliminateFunction<TI, [x?: any]>
      ): void;

      <S extends Interstate, SI = SetInterstateSchemaParam<S>>(
        set: SetInterstateSchemaParam<S> & SI & EliminateFunctionsAlsoInProperties<SI, [x?: any]>
      ): void;

      <S0 extends Interstate, S1 extends Interstate>(set: SetInterstateFnParam<S0, S1>): void;
    }
  : {
      <K extends OnlyStringKeys<M>, TI = SetInterstateParam<M[K]>>(
        key: K,
        set: SetInterstateParam<M[K]> & TI & EliminateFunction<TI, [x?: any]>
      ): void;

      <K extends ExtraStringKeys<M>, SI = SetInterstateSchemaParam<M, K>>(
        set: SetInterstateSchemaParam<M, K> & SI & EliminateFunctionsAlsoInProperties<SI, [x?: any]>
      ): void;

      [_fixInfer]?: M;
    };

export type SetInterstateParam<T> = Exclude<T, (...x: any) => any> | ((prevValue: T) => T);

export type SetInterstateSchemaParam<M extends Interstate, K extends keyof M = keyof M> =
  | SetInterstateSchemaParamObj<M, K>
  | SetInterstateSchemaParamFn<M, K>;

export type SetInterstateSchemaParamObj<M extends Interstate, K extends keyof M = keyof M> = {
  [P in K]: SetInterstateParam<M[P]>;
};

export type SetInterstateSchemaParamFn<
  M extends Interstate,
  K extends keyof M = keyof M
> = SetInterstateFnParam<M, Pick<M, K>>;

type SetInterstateFnParam<S0, S1> = S1 extends { [P in keyof S0 & keyof S1]: S0[P] & S1[P] }
  ? (prevState: S0) => S1
  : never;

export type OnlyStringKeys<S> = StringifyNumber<keyof S>;

export type ExtraStringKeys<S> = keyof S | StringifyNumber<keyof S>;

type StringifyNumber<T> = T extends number ? `${T}` : T;

type EliminateFunction<F, AllowedArgs extends any[] = never> = F extends (...x: infer A) => any
  ? A extends AllowedArgs
    ? unknown
    : never
  : unknown;

type EliminateFunctionsAlsoInProperties<F, AllowedArgs extends any[] = never> = EliminateFunction<
  F,
  AllowedArgs
> &
  (F extends { [P in keyof F]: EliminateFunction<F[P], AllowedArgs> } ? unknown : never);

type UnReadOnly<T> = { -readonly [P in keyof T]: T[P] };
