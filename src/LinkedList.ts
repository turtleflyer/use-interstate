export type LinkedList<E extends LinkedListEntry = LinkedListEntry> =
  | LinkedListEmpty
  | LinkedListNonempty<E>;

interface LinkedListEmpty {
  start?: null;
}

export interface LinkedListNonempty<E extends LinkedListEntry> {
  start: E & { prev: undefined | null };
}

export interface LinkedListEntry<
  E extends LinkedListEntry<{ prev?: any; next?: any }> = LinkedListEntry<{
    prev?: any;
    next?: any;
  }>
> {
  prev?: (E & { next: {} }) | null;

  next?: (E & { prev: {} }) | null;

  beenRemoved?: boolean;
}

export const traverseLinkedList = <E extends LinkedListEntry<E>>(
  list: LinkedList<E>,
  callbackfn: (entry: E) => void
): void => {
  let curEntry: E | null | undefined = list.start;

  while (curEntry) {
    callbackfn(curEntry);
    curEntry = curEntry.next;
  }
};

export const addLinkedListEntry = <E extends LinkedListEntry<E>>(
  list: LinkedList<E>,
  entryProps: Omit<E, 'prev' | 'next'>
): E & { prev: undefined | null } => {
  const createdEntry = { ...entryProps } as E & { prev: undefined | null; next: {} };

  /* eslint-disable no-param-reassign */
  if (isLinkedListFilled(list)) {
    [createdEntry.next, (list.start as E).prev, list.start] = [
      list.start as E as E & { prev: {} },
      createdEntry,
      createdEntry,
    ];
  } else {
    (list as LinkedList<E> as LinkedListNonempty<E>).start = createdEntry;
  }
  /* eslint-enable no-param-reassign */

  return createdEntry;
};

function isLinkedListFilled<E extends LinkedListEntry<E>>(
  list: LinkedList<E>
): list is LinkedListNonempty<E> {
  return list.start as unknown as boolean;
}

const determineOppositeDirection = { prev: 'next', next: 'prev' } as const;

export const removeLinkedListEntry = <E extends LinkedListEntry<E>>(
  list: LinkedListNonempty<E>,
  entry: E
): void => {
  if (entry.beenRemoved) {
    return;
  }

  type Direction = 'prev' | 'next';

  // eslint-disable-next-line no-param-reassign
  (list as LinkedList<E>).start = closeSettersListInSingleDirection('prev', list.start);
  closeSettersListInSingleDirection('next');

  function closeSettersListInSingleDirection<
    D extends Direction,
    EC extends E & { [P in D]: undefined | null }
  >(direction: D, sideEnd?: EC): EC | null | undefined {
    const neighbor = entry[direction] as E | null | undefined;
    const oppositeDirection = determineOppositeDirection[direction];

    if (!neighbor) {
      return entry[oppositeDirection] as EC | null | undefined;
    }

    neighbor[oppositeDirection] = entry[oppositeDirection];

    return sideEnd;
  }

  // eslint-disable-next-line no-param-reassign
  entry.beenRemoved = true;
};
