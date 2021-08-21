import type { Trigger, WayToAccessValue } from './State';
import type { InterstateSelector, UseInterstateInitParam } from './UseInterstateTypes';

export interface Store<M extends object> {
  readonly getValue: GetValue<M>;

  readonly getStateUsingSelector: GetStateUsingSelector<M>;

  readonly setValue: SetValue<M>;

  readonly reactInitKey: ReactInitKey<M>;

  readonly reactEffectTask: () => void;

  readonly reactRenderTask: () => void;
}

export type InitState<M extends object> = (initParam: Partial<M>) => void;

export type GetValue<M extends object> = <K extends keyof M>(key: K) => M[K];

export type GetStateUsingSelector<M extends object> = <R>(
  selector: InterstateSelector<M, R>,

  wayToAccessValue: WayToAccessValue<M>
) => R;

export type SetValue<M extends object> = <K extends keyof M>(key: K, value: M[K]) => void;

export type ReactInitKey<M extends object> = <K extends keyof M>(
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
