import type { _fixInfer } from './fixInferKey';
import type {
  Interstate,
  InterstateMethods,
  InterstateSelector,
  SetInterstateParam,
  SetInterstateSchemaParam,
  UseInterstateInitParam,
  UseInterstateSchemaParam,
} from './UseInterstateTypes';

export interface InterstateMethodsDev<M extends Interstate> {
  initInterstate: InitInterstateDev<M>;

  useInterstate: UseInterstateDev<M>;

  readInterstate: ReadInterstateDev<M>;

  setInterstate: SetInterstateDev<M>;
}

export type InitInterstateDev<M extends Interstate> = {
  <K extends keyof M>(initParam?: Pick<M, K>): Omit<InterstateMethods<M>, 'initInterstate'>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <K extends keyof M>(i: never): Omit<InterstateMethods<M>, 'initInterstate'>;

  [_fixInfer]?: M;
};

export type UseInterstateDev<M extends Interstate> = {
  acceptSelector: AcceptSelectorDev<M>;

  <K extends keyof M>(key: K, init?: UseInterstateInitParam<M[K]>): M[K];

  <K extends keyof M>(initState: UseInterstateSchemaParam<M, K>): Pick<M, K>;

  <K extends keyof M>(keys: readonly K[]): Pick<M, K>;
};

export type AcceptSelectorDev<M extends Interstate> = <R>(selector: InterstateSelector<M, R>) => R;

export type ReadInterstateDev<M extends Interstate> = {
  acceptSelector: AcceptSelectorDev<M>;

  <K extends keyof M>(key: K): M[K];

  <K extends keyof M>(keys: readonly K[]): Pick<M, K>;
};

export type SetInterstateDev<M extends Interstate = never> = {
  <K extends keyof M>(key: K, set: SetInterstateParam<M[K]>): void;

  <K extends keyof M>(set: SetInterstateSchemaParam<M, K>): void;

  [_fixInfer]?: M;
};
