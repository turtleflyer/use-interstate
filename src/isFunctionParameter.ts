import type { SetInterstateParam, UseInterstateInitParam } from './UseInterstateTypes';

export const isFunctionParameter = (<T>(
  param?: UseInterstateInitParam<T> | SetInterstateParam<T>
): param is (() => T) | ((prevValue: T) => T) => typeof param === 'function') as {
  <T>(param?: UseInterstateInitParam<T>): param is () => T;

  <T>(param?: SetInterstateParam<T>): param is (prevValue: T) => T;
};
