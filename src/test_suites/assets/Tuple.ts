export type Tuple<T, R extends number> = TupleIterated<[], T, R>;

type TupleIterated<Tup extends [] | [...T[], T], T, R extends number> = Tup['length'] extends R
  ? Tup
  : TupleIterated<[...Tup, T], T, R>;
