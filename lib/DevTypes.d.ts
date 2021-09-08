import type {
  InterstateSelector,
  SetInterstateParam,
  SetInterstateSchemaParam,
  UseInterstateInitParam,
  UseInterstateSchemaParam,
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
  <K extends keyof M>(key: K, initParam?: UseInterstateInitParam<M[K]>): M[K];

  <K extends keyof M>(keys: readonly K[]): Pick<M, K>;

  <K extends keyof M>(initState: UseInterstateSchemaParam<M, K>, deps?: readonly any[]): Pick<M, K>;

  acceptSelector: {
    <R>(selector: InterstateSelector<M, R>, deps?: readonly any[]): R;
  };

  [_helpInfer]?: M;
}

export interface ReadInterstateDev<M extends object> {
  <K extends keyof M>(key: K): M[K];

  <K extends keyof M>(keys: readonly K[]): Pick<M, K>;

  acceptSelector: {
    <R>(selector: InterstateSelector<M, R>): R;
  };

  [_helpInfer]?: M;
}

export interface SetInterstateDev<M extends object = never> {
  <K extends keyof M>(key: K, setter: SetInterstateParam<M[K]>): void;

  <K extends keyof M>(setter: SetInterstateSchemaParam<M, K>): void;

  [_helpInfer]?: M;
}

export interface ResetInterstateDev<M extends object = never> {
  (initStateValues?: Partial<M>): void;

  [_helpInfer]?: M;
}
