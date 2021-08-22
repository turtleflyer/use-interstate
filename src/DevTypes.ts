import type {
  _helpInfer,
  InterstateSelector,
  SetInterstateParam,
  SetInterstateSchemaParam,
  UseInterstateInitParam,
  UseInterstateSchemaParam,
} from './UseInterstateTypes';

export type InitInterstateDev = <M extends object>(
  initStateValues?: Partial<M>
) => InterstateMethodsDev<M>;
export interface InterstateMethodsDev<M extends object> {
  useInterstate: UseInterstateDev<M>;

  readInterstate: ReadInterstateDev<M>;

  setInterstate: SetInterstateDev<M>;

  resetInterstate: ResetInterstateDev<M>;
}

export interface UseInterstateDev<M extends object> {
  <K extends keyof M>(key: K, init?: UseInterstateInitParam<M[K]>): M[K];

  <K extends keyof M>(initState: UseInterstateSchemaParam<M, K>): Pick<M, K>;

  <K extends keyof M>(keys: readonly K[]): Pick<M, K>;

  acceptSelector: AcceptSelectorDev<M>;
}

export interface AcceptSelectorDev<M extends object> {
  <R>(selector: InterstateSelector<M, R>): R;

  [_helpInfer]?: M;
}

export interface ReadInterstateDev<M extends object> {
  acceptSelector: AcceptSelectorDev<M>;

  <K extends keyof M>(key: K): M[K];

  <K extends keyof M>(keys: readonly K[]): Pick<M, K>;
}

export interface SetInterstateDev<M extends object = never> {
  <K extends keyof M>(key: K, set: SetInterstateParam<M[K]>): void;

  <K extends keyof M>(set: SetInterstateSchemaParam<M, K>): void;

  [_helpInfer]?: M;
}

export interface ResetInterstateDev<M extends object = never> {
  (initStateValues?: Partial<M>): void;

  [_helpInfer]?: M;
}
