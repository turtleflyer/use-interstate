import type { UseInterstateErrorCodes } from './errorHandle';
import type { Setter, StateKey } from './InterstateParam';
import type { SettersListBase, SettersListEntryBase, SettersListIterator } from './SettersLists';

export interface MapValueSettersListEntry extends SettersListEntryBase {
  prev?: (MapValueSettersListEntry & { next: {} }) | undefined;
  next?: (MapValueSettersListEntry & { prev: {} }) | undefined;

  readonly setter: Setter;

  readonly removeFromWatchList: () => void;

  errorChunk: boolean;
}

export function isSetterListEntryErrorChunk(
  e: MapValueSettersListEntry | undefined
): e is MapValueSettersListEntry & { errorChunk: true } {
  return !!e?.errorChunk;
}

type InitStatus = { readonly signature: symbol };

export interface MapValue<T = any> extends SettersListBase {
  start?: MapValueSettersListEntry & { prev: undefined };
  end?: MapValueSettersListEntry & { next: undefined };

  value?: T;
  isValueSetUp: boolean;

  caughtError?: UseInterstateErrorCodes;

  initStatus?: InitStatus;

  triggerRegistered?: boolean;

  readonly [Symbol.iterator]: SettersListIterator<MapValueSettersListEntry>;
}

export type StoreMap = Map<StateKey, MapValue<any>>;
