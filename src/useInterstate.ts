import { useEffect, useState } from 'react';
import { createStore } from './createStore';
import type {
  InterstateMethodsDev,
  ReadInterstateDev,
  ResetInterstateDev,
  SetInterstateDev,
  UseInterstateDev,
} from './DevTypes';
import { getEntriesOfEnumerableKeys } from './getEntriesOfEnumerableKeys';
import { isFunctionParameter } from './isFunctionParameter';
import { InitValuesForSubscribing, TakeStateAndCalculateValue } from './Store';
import type {
  InitInterstate,
  InterstateKey,
  InterstateSelector,
  SetInterstateParam,
  SetInterstateSchemaParam,
  UseInterstateInitParam,
  UseInterstateSchemaParam,
} from './UseInterstateTypes';

export const initInterstate = (<M extends object>(
  initStateValues?: Partial<M>
): InterstateMethodsDev<M> => {
  const {
    getValue,
    setValue,
    resetValue,
    getStateUsingSelector,
    reactSubscribeState,
    reactRenderTask,
    reactEffectTask,
  } = createStore(initStateValues);

  type UseGetState<K extends keyof M, R> = (subscribingParams: SubscribingParams<K, R> | null) => R;

  interface SubscribingParams<K extends keyof M, R> {
    takeStateAndCalculateValue: TakeStateAndCalculateValue<M, R>;

    initValues?: InitValuesForSubscribing<M, K>;
  }

  type UseInterstateArgs<K extends keyof M> =
    | [key: K, initParam?: UseInterstateInitParam<M[K]>]
    | [keys: readonly K[]]
    | [initState: UseInterstateSchemaParam<M, K>, deps?: readonly any[]];

  type UseInterstateUnifiedInterface<K extends keyof M, R = unknown> =
    | { interfaceType: 'single key'; key: K; initParam?: UseInterstateInitParam<M[K]> }
    | { interfaceType: 'keys list'; keys: readonly K[] }
    | {
        interfaceType: 'object interface';
        initState: Pick<M, K>;
        deps?: readonly any[];
      }
    | { interfaceType: 'function interface'; initState: () => Pick<M, K>; deps?: readonly any[] }
    | { interfaceType: 'selector'; selector: InterstateSelector<M, R>; deps?: readonly any[] };

  const useInterstate = (<K extends keyof M, Args extends UseInterstateArgs<K>>(
    ...args: Args
  ): M[K] | Pick<M, K> =>
    useInterstateTakingUnifiedInterface(
      unifyUseInterstateInterface(...args) as UseInterstateUnifiedInterface<K, any> & {
        interfaceType: 'single key' | 'keys list' | 'object interface' | 'function interface';
      }
    )) as UseInterstateDev<M>;

  useInterstate.acceptSelector = <R>(
    selector: InterstateSelector<M, R>,
    deps?: readonly any[]
  ): R => useInterstateTakingUnifiedInterface({ interfaceType: 'selector', selector, deps });

  const setInterstate: SetInterstateDev<M> = <K extends keyof M>(
    keyOrSetterSchema: K | SetInterstateSchemaParam<M, K>,
    setterParam?: SetInterstateParam<M[K]>
  ): void => {
    switch (typeof keyOrSetterSchema) {
      case 'object':
        getEntriesOfEnumerableKeys(keyOrSetterSchema).forEach(([key, setterP]): void => {
          setValueNormalizingParam(key, () => setterP);
        });

        break;

      case 'function':
        getEntriesOfEnumerableKeys(getStateUsingSelector(keyOrSetterSchema)).forEach(
          ([key, value]) => {
            setValue(key, value);
          }
        );

        break;

      default:
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setValueNormalizingParam(normalizeKey(keyOrSetterSchema), setterParam!);

        break;
    }

    function setValueNormalizingParam(key: K, setterP: SetInterstateParam<M[K]>): void {
      setValue(key, isFunctionParameter(setterP) ? setterP(getValue(key)) : setterP);
    }
  };

  const readInterstate = (<K extends keyof M>(keyOrKeys: K | readonly K[]): M[K] | Pick<M, K> =>
    isArray(keyOrKeys)
      ? (Object.fromEntries(keyOrKeys.map((key) => [key, getValue(normalizeKey(key))])) as Pick<
          M,
          K
        >)
      : getValue(normalizeKey(keyOrKeys))) as ReadInterstateDev<M>;

  readInterstate.acceptSelector = <R>(selector: InterstateSelector<M, R>): R =>
    getStateUsingSelector(selector);

  const resetInterstate: ResetInterstateDev<M> = resetValue;

  return {
    useInterstate,
    setInterstate,
    readInterstate,
    resetInterstate,
  };

  function useInterstateTakingUnifiedInterface<K extends keyof M>(
    param: UseInterstateUnifiedInterface<K> & { interfaceType: 'single key' }
  ): M[K];

  function useInterstateTakingUnifiedInterface<K extends keyof M>(
    param: UseInterstateUnifiedInterface<K> & {
      interfaceType: 'keys list' | 'object interface' | 'function interface';
    }
  ): Pick<M, K>;

  function useInterstateTakingUnifiedInterface<R>(
    param: UseInterstateUnifiedInterface<any, R> & { interfaceType: 'selector' }
  ): R;

  function useInterstateTakingUnifiedInterface<K extends keyof M, R>(
    param: UseInterstateUnifiedInterface<K, R>
  ): M[K] | Pick<M, K> | R;

  function useInterstateTakingUnifiedInterface<K extends keyof M, R>(
    param: UseInterstateUnifiedInterface<K, R>
  ): M[K] | Pick<M, K> | R {
    type DetermineNeedToResubscribe = (
      paramToCheck: UseInterstateUnifiedInterface<K, R>
    ) => boolean;

    const [{ useInRender }] = useState(() => {
      let determineNeedToResubscribe: DetermineNeedToResubscribe = () => true;

      // eslint-disable-next-line no-shadow
      const useInRender = (
        paramInRender: UseInterstateUnifiedInterface<K, R>
      ): M[K] | Pick<M, K> | R => {
        const useGetState = useDriveInterstate<K, M[K] | Pick<M, K> | R>();
        let useGetStateParam: SubscribingParams<K, M[K] | Pick<M, K> | R> | null = null;

        if (determineNeedToResubscribe(paramInRender)) {
          switch (paramInRender.interfaceType) {
            case 'single key': {
              const normalizedKey = normalizeKey(paramInRender.key);
              const { initParam } = paramInRender;

              determineNeedToResubscribe = (paramToCheck) =>
                paramToCheck.interfaceType !== 'single key' ||
                paramToCheck.key !== paramInRender.key;

              useGetStateParam = {
                takeStateAndCalculateValue: (state) => state[normalizedKey],

                initValues: [
                  [normalizedKey, isFunctionParameter(initParam) ? initParam() : initParam],
                ],
              };

              break;
            }

            case 'keys list': {
              determineNeedToResubscribe = (paramToCheck) =>
                paramToCheck.interfaceType !== 'keys list' ||
                checkDepsChanged(paramToCheck.keys, paramInRender.keys);

              const initValues = paramInRender.keys.map((key) => [normalizeKey(key)] as const);

              useGetStateParam = {
                takeStateAndCalculateValue:
                  getTakeStateAndCalculateValueForObjectAndFuncAndList(initValues),

                initValues,
              };

              break;
            }

            case 'object interface': {
              determineNeedToResubscribe = getDetermineNeedToResubscribeForDepsInvolved(
                paramInRender.deps,
                ['object interface', 'function interface']
              );

              const initValues = getEntriesOfEnumerableKeys(paramInRender.initState);

              useGetStateParam = {
                takeStateAndCalculateValue:
                  getTakeStateAndCalculateValueForObjectAndFuncAndList(initValues),

                initValues,
              };

              break;
            }

            case 'function interface': {
              determineNeedToResubscribe = getDetermineNeedToResubscribeForDepsInvolved(
                paramInRender.deps,
                ['object interface', 'function interface']
              );

              const initValues = getEntriesOfEnumerableKeys(paramInRender.initState());

              useGetStateParam = {
                takeStateAndCalculateValue:
                  getTakeStateAndCalculateValueForObjectAndFuncAndList(initValues),

                initValues,
              };

              break;
            }

            case 'selector':
              determineNeedToResubscribe = getDetermineNeedToResubscribeForDepsInvolved(
                paramInRender.deps,
                ['selector']
              );

              useGetStateParam = { takeStateAndCalculateValue: paramInRender.selector };

              break;

            default:
              break;
          }
        }

        return useGetState(useGetStateParam);
      };

      return { useInRender };
    });

    return useInRender(param);

    function getDetermineNeedToResubscribeForDepsInvolved(
      depsToCheckWith: readonly any[] | undefined,
      allowedInterfaceTypes: readonly ('object interface' | 'function interface' | 'selector')[]
    ): DetermineNeedToResubscribe {
      return depsToCheckWith
        ? (paramToCheck) => {
            if (allowedInterfaceTypes.some((it) => it === paramToCheck.interfaceType)) {
              const { deps } = paramToCheck as UseInterstateUnifiedInterface<K, R> & {
                interfaceType: 'object interface' | 'function interface' | 'selector';
              };

              return !deps || checkDepsChanged(deps, depsToCheckWith);
            }

            return true;
          }
        : () => true;
    }

    function getTakeStateAndCalculateValueForObjectAndFuncAndList(
      initValues: InitValuesForSubscribing<M, K>
    ): TakeStateAndCalculateValue<M, Pick<M, K>> {
      return (state) =>
        Object.fromEntries(initValues.map(([key]) => [key, state[key]])) as Pick<M, K>;
    }
  }

  function useDriveInterstate<K extends keyof M, R>(): UseGetState<K, R> {
    reactRenderTask();
    useEffect(reactEffectTask);

    const [{ useGetState }] = useState((): { useGetState: UseGetState<K, R> } => {
      let retrieveValue: () => R;
      let unsubscribe: () => void;
      let removeFromWatchList: () => void;

      // eslint-disable-next-line no-shadow
      const useGetState = (subscribingParams: SubscribingParams<K, R> | null): R => {
        /**
         * Emit setter using to trigger rendering of component signaling when value of `key` changed
         * in global state
         */
        const [, setState] = useState({});

        if (subscribingParams) {
          unsubscribe?.();
          const { takeStateAndCalculateValue, initValues } = subscribingParams;

          ({ retrieveValue, unsubscribe, removeFromWatchList } = reactSubscribeState(
            () => {
              setState({});
            },
            takeStateAndCalculateValue,
            initValues
          ));
        }

        useEffect(removeFromWatchList, [removeFromWatchList]);

        useEffect(
          () => () => {
            unsubscribe();
          },
          []
        );

        return retrieveValue();
      };

      return { useGetState };
    });

    return useGetState;
  }

  function unifyUseInterstateInterface<K extends keyof M>(
    ...[firstArg, secondArg]: UseInterstateArgs<K>
  ): UseInterstateUnifiedInterface<K> {
    switch (typeof firstArg) {
      case 'object':
        return isArray(firstArg)
          ? { interfaceType: 'keys list', keys: firstArg }
          : {
              interfaceType: 'object interface',
              initState: firstArg,
              deps: secondArg as any[] | undefined,
            };

      case 'function':
        return {
          interfaceType: 'function interface',
          initState: firstArg,
          deps: secondArg as any[] | undefined,
        };

      default:
        return {
          interfaceType: 'single key',
          key: firstArg,
          initParam: secondArg as UseInterstateInitParam<M[K]> | undefined,
        };
    }
  }
}) as InitInterstate;

function checkDepsChanged(depsToCheck: readonly any[], depsToCheckWith: readonly any[]): boolean {
  if (depsToCheck.length === depsToCheckWith.length) {
    return depsToCheck.some((dep, index) => !Object.is(dep, depsToCheckWith[index]));
  }

  return true;
}

function isArray<T, Arr extends readonly any[]>(keyOrKeys: T | Arr): keyOrKeys is Arr {
  return Array.isArray(keyOrKeys);
}

function normalizeKey<K extends InterstateKey>(key: K): K {
  return (typeof key === 'number' ? `${key}` : key) as K;
}

export * from './DevTypes';
export * from './UseInterstateTypes';
