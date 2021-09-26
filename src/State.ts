import type { LinkedList, LinkedListEntry } from './LinkedList';

export interface State<M extends object> {
  readonly getStateValue: GetStateValue<M>;

  readonly setStateValue: SetStateValue<M>;

  readonly getAccessMapHandler: GetAccessMapHandler<M>;

  readonly clearState: () => void;
}

export type GetStateValue<M extends object> = <K extends keyof M>(key: K) => StateEntry<M[K]>;

export type SetStateValue<M extends object> = <K extends keyof M>(
  key: K,
  entryProperties?: Omit<StateEntry<M[K]>, 'reactTriggersList'>
) => StateEntry<M[K]>;

export type StateEntry<T> = {
  stateValue?: StateValue<T>;

  reactTriggersList: ReactTriggersList;
};

type StateValue<T> = { value: T };

type ReactTriggersList = LinkedList<TriggersListEntry> & { triggersFired?: boolean };

export type TriggersListEntry = LinkedListEntry<TriggersListEntry> & {
  readonly trigger: Trigger;
};

export interface Trigger {
  fire: () => void;

  addToTriggersBatchPool: () => void;
}

export type GetAccessMapHandler<M extends object> = () => AccessMapHandlerAndGetKeysMethod<M>;

export interface AccessMapHandlerAndGetKeysMethod<M extends object> {
  readonly accessMapHandler: Readonly<M>;

  readonly getKeysBeingAccessed: () => readonly (keyof M)[];
}
