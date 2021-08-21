export const getEntriesOfEnumerableKeys = <S>(obj: S): [key: keyof S, value: S[keyof S]][] =>
  (
    [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)].filter((key) =>
      Object.prototype.propertyIsEnumerable.call(obj, key)
    ) as (keyof S)[]
  ).map((key) => [key, obj[key]] as const) as [key: keyof S, value: S[keyof S]][];
