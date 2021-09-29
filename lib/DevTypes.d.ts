import type {
  InterstateSelector,
  SetInterstateSchemaParam,
  _helpInfer,
} from './UseInterstateTypes';

export declare type InitInterstateDev = <M extends object>(
  initStateValues?: Partial<M>
) => InterstateMethodsDev<M>;

export interface InterstateMethodsDev<M extends object> {
  useInterstate: UseInterstateDev<M>;

  readInterstate: ReadInterstateDev<M>;

  setInterstate: SetInterstateDev<M>;

  resetInterstate: ResetInterstateDev<M>;
}

export interface UseInterstateDev<M extends object> {
  <K extends keyof M>(key: K, initValue?: M[K] | (() => M[K])): M[K];

  <K extends keyof M>(keys: readonly K[]): Pick<M, K>;

  <K extends keyof M>(initState: () => Pick<M, K>, deps?: readonly any[]): Pick<M, K>;

  <K extends keyof M>(initState: Pick<M, K>): Pick<M, K>;

  <K1 extends keyof M, K2 extends keyof M>(initState: Pick<M, K1> | (() => Pick<M, K2>)): Pick<
    M,
    K1 | K2
  >;

  acceptSelector: {
    <R>(selector: InterstateSelector<M, R>, deps?: readonly any[]): R;
  };

  [_helpInfer]?: M;
}

export interface ReadInterstateDev<M extends object> {
  <K extends keyof M>(key: K): M[K];

  <K extends keyof M>(keys: readonly K[]): Pick<M, K>;

  <K1 extends keyof M, K2 extends keyof M>(keyOrKeys: K1 | readonly K2[]): M[K1] | Pick<M, K2>;

  acceptSelector: {
    <R>(selector: InterstateSelector<M, R>): R;
  };

  [_helpInfer]?: M;
}

export interface SetInterstateDev<M extends object> {
  <K extends keyof M>(key: K, setValue: M[K] | ((prevValue: M[K]) => M[K])): void;

  <K extends keyof M>(setState: SetInterstateSchemaParam<M, K>): void;

  <K1 extends keyof M, K2 extends keyof M>(
    setState: Pick<M, K1> | ((prevState: M) => Pick<M, K2>)
  ): void;

  [_helpInfer]?: M;
}

export interface ResetInterstateDev<M extends object> {
  (initStateValues?: Partial<M>): void;

  [_helpInfer]?: M;
}
