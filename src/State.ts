import type { LinkedList, LinkedListEntry } from './LinkedList';
import type { Interstate } from './UseInterstateTypes';

export interface State<M extends Interstate = Interstate> {
  readonly stateMap: StateMap<M>;

  readonly getAccessHandler: GetAccessHandler<M>;

  readonly clearState: () => void;
}

export interface StateMap<M extends Interstate> {
  get: <K extends keyof M>(key: K) => StateEntry<M[K]>;

  set: <K extends keyof M>(
    key: K,
    entryProperties?: Omit<StateEntry<M[K]>, 'reactTriggersList'>
  ) => StateEntry<M[K]>;
}

export type StateEntry<T> = {
  stateValue?: StateValue<T>;

  reactTriggersList: ReactTriggersList;
};

type StateValue<T> = { value: T };

type ReactTriggersList = LinkedList<TriggersListEntry> & { triggersFired?: boolean };

export type TriggersListEntry = LinkedListEntry<TriggersListEntry> & {
  readonly trigger: Trigger;
};

export type Trigger = () => void;

export type GetAccessHandler<M extends Interstate> = (wayToAccessValue: WayToAccessValue<M>) => M;

export type WayToAccessValue<M extends Interstate> = <K extends keyof M>(key: K) => M[K];
