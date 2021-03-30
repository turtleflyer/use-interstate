import type { SetInterstateParam, UseInterstateInitParam } from './UseInterstateTypes';

export const isFunctionParameter = <T, F extends 'UseInterstateInitParam' | 'SetInterstateParam'>(
  param: F extends 'UseInterstateInitParam' ? UseInterstateInitParam<T> : SetInterstateParam<T>
): param is F extends 'UseInterstateInitParam' ? () => T : (prevValue: T) => T =>
  typeof param === 'function';
