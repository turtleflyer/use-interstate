import type { Trigger, WayToAccessValue } from './State';
import type { Interstate, InterstateSelector, UseInterstateInitParam } from './UseInterstateTypes';

export interface Store<M extends Interstate> {
  readonly initState: InitState<M>;

  readonly getValue: GetValue<M>;

  readonly getStateUsingSelector: GetStateUsingSelector<M>;

  readonly setValue: SetValue<M>;

  readonly reactInitKey: ReactInitKey<M>;

  readonly reactEffectTask: () => void;

  readonly reactRenderTask: () => void;
}

export type InitState<M extends Interstate> = <K extends keyof M>(initParam?: Pick<M, K>) => void;

export type GetValue<M extends Interstate> = <K extends keyof M>(key: K) => M[K];

export type GetStateUsingSelector<M extends Interstate> = <R>(
  selector: InterstateSelector<M, R>,

  wayToAccessValue: WayToAccessValue<M>
) => R;

export type SetValue<M extends Interstate> = <K extends keyof M>(key: K, value: M[K]) => void;

export type ReactInitKey<M extends Interstate> = <K extends keyof M>(
  key: K,
  initP?: UseInterstateInitParam<M[K]>
) => ReactKeyMethods;

export interface ReactKeyMethods {
  readonly addTrigger: (trigger: Trigger) => ReactTriggerMethods;
}

export interface ReactTriggerMethods {
  readonly removeTriggerFromKeyList: () => void;

  readonly removeTriggerFromWatchList: () => void;
}
