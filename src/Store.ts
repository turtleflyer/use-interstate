import type { Trigger } from './State';
import type {
  InterstateSelector,
  SetInterstateParam,
  UseInterstateInitParam,
} from './UseInterstateTypes';

export interface Store<M extends object> {
  readonly getValue: GetValue<M>;

  readonly setValue: SetValue<M>;

  readonly resetValue: ResetValue<M>;

  readonly getStateUsingSelector: GetStateUsingSelector<M>;

  readonly reactSubscribeState: ReactSubscribeState<M>;

  readonly reactEffectTask: () => void;

  readonly reactRenderTask: () => void;
}

export type GetValue<M extends object> = <K extends keyof M>(key: K) => M[K];

export type SetValue<M extends object> = <K extends keyof M>(
  setValueParam: SetValueParm<M, K>
) => void;

export type SetValueParm<M extends object, K extends keyof M> =
  | {
      key: K;
      value: M[K];
      needToCalculateValue?: false;
      lastInSeries: boolean;
    }
  | {
      key: K;
      valueToCalculate: SetInterstateParam<M[K]>;
      needToCalculateValue: true;
      lastInSeries: boolean;
    };

export type ResetValue<M extends object> = (initStateValues?: Partial<M>) => void;

export type GetStateUsingSelector<M extends object> = <R>(selector: InterstateSelector<M, R>) => R;

export type ReactSubscribeState<M extends object> = <K extends keyof M, R>(
  notifyingTrigger: () => void,
  takeStateAndCalculateValue: TakeStateAndCalculateValue<M, R>,
  initValues?: InitRecordsForSubscribing<M, K>
) => SubscribeStateMethods<R>;

export type TakeStateAndCalculateValue<M extends object, R> = (state: M) => R;

export type InitRecordsForSubscribing<M extends object, K extends keyof M> = readonly InitRecord<
  M,
  K
>[];

export type InitRecord<M extends object, K extends keyof M> =
  | { key: K; initValue?: M[K]; needToCalculateValue?: false }
  | { key: K; initValueToCalculate: UseInterstateInitParam<M[K]>; needToCalculateValue: true };

export interface SubscribeStateMethods<R> {
  retrieveValue: () => R;

  unsubscribe: () => void;

  removeFromWatchList: () => void;
}

export interface ReactKeyMethods {
  readonly addTrigger: (trigger: Trigger) => ReactTriggerMethods;
}

export interface ReactTriggerMethods {
  readonly removeTriggerFromKeyList: () => void;

  readonly removeTriggerFromWatchList: () => void;
}
