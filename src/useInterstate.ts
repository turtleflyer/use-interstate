import { useEffect, useState } from 'react';
import { createStore } from './createStore';
import type {
  InterstateMethodsDev,
  ReadInterstateDev,
  ResetInterstateDev,
  SetInterstateDev,
  UseInterstateDev,
} from './DevTypes';
import { getEntriesOfEnumerableKeys, getEnumerableKeys } from './getEntriesOfEnumerableKeys';
import { isFunctionParameter } from './isFunctionParameter';
import { InitRecordsForSubscribing, TakeStateAndCalculateValue } from './Store';
import type {
  InitInterstate,
  InterstateKey,
  InterstateSelector,
  SetInterstateParam,
  SetInterstateSchemaParam,
  UseInterstateInitParam,
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

  type UseInterstateArgs<K extends keyof M> =
    | [key: K, initParam?: UseInterstateInitParam<M[K]>]
    | [keys: readonly K[]]
    | [initState: Pick<M, K>]
    | [createInitState: () => Pick<M, K>, deps?: readonly any[]];

  type UnifiedInterfaceForUseInterstate<K extends keyof M, R = unknown> =
    | { interfaceType: 'single key'; key: K; initParam?: UseInterstateInitParam<M[K]> }
    | { interfaceType: 'keys list'; keys: readonly K[] }
    | {
        interfaceType: 'object interface';
        initState: Pick<M, K>;
      }
    | {
        interfaceType: 'function interface';
        createInitState: () => Pick<M, K>;
        deps?: readonly any[];
      }
    | { interfaceType: 'selector'; selector: InterstateSelector<M, R>; deps?: readonly any[] };

  const useInterstate = (<K extends keyof M, Args extends UseInterstateArgs<K>>(
    ...args: Args
  ): M[K] | Pick<M, K> =>
    useInterstateTakingUnifiedInterface(
      unifyUseInterstateInterface(...args) as UnifiedInterfaceForUseInterstate<K> & {
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
        getEntriesOfEnumerableKeys(keyOrSetterSchema).forEach(
          ([key, setterV], index, allKeys): void => {
            setValue(key, setterV, index === allKeys.length - 1);
          }
        );

        break;

      case 'function':
        getEntriesOfEnumerableKeys(getStateUsingSelector(keyOrSetterSchema)).forEach(
          ([key, value], index, allKeys) => {
            setValue(key, value, index === allKeys.length - 1);
          }
        );

        break;

      default: {
        const normalizedKey = normalizeKey(keyOrSetterSchema);
        const setterParamMustBeDefined = setterParam as SetInterstateParam<M[K]>;

        setValue(
          normalizedKey,
          isFunctionParameter(setterParamMustBeDefined)
            ? setterParamMustBeDefined(getValue(normalizedKey))
            : setterParamMustBeDefined,
          true
        );

        break;
      }
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
    param: UnifiedInterfaceForUseInterstate<K> & { interfaceType: 'single key' }
  ): M[K];

  function useInterstateTakingUnifiedInterface<K extends keyof M>(
    param: UnifiedInterfaceForUseInterstate<K> & {
      interfaceType: 'keys list' | 'object interface' | 'function interface';
    }
  ): Pick<M, K>;

  function useInterstateTakingUnifiedInterface<R>(
    param: UnifiedInterfaceForUseInterstate<any, R> & { interfaceType: 'selector' }
  ): R;

  function useInterstateTakingUnifiedInterface<K extends keyof M, R>(
    param: UnifiedInterfaceForUseInterstate<K, R>
  ): M[K] | Pick<M, K> | R;

  function useInterstateTakingUnifiedInterface<K extends keyof M, R>(
    param: UnifiedInterfaceForUseInterstate<K, R>
  ): M[K] | Pick<M, K> | R {
    reactRenderTask();
    useEffect(reactEffectTask);

    type UseInterstateReturn = M[K] | Pick<M, K> | R;

    type DetermineNeedToResubscribe = (
      paramToCheck: UnifiedInterfaceForUseInterstate<K, R>
    ) => DetermineNeedToResubscribeReturn;

    interface DetermineNeedToResubscribeReturn {
      determination: boolean;
      calculatedKeys?: K[];
    }

    interface SubscribingParam {
      takeStateAndCalculateValue: TakeStateAndCalculateValue<M, UseInterstateReturn>;

      initRecords?: InitRecordsForSubscribing<M, K>;
    }

    const [{ useInRender }] = useState(() => {
      const useRetrieveState = createUseRetrieveState();
      let determineNeedToResubscribe: DetermineNeedToResubscribe = () => ({ determination: true });

      // eslint-disable-next-line no-shadow
      const useInRender = (
        paramInRender: UnifiedInterfaceForUseInterstate<K, R>
      ): UseInterstateReturn => {
        let paramForUseRetrieveState: SubscribingParam | null = null;
        const { determination, calculatedKeys } = determineNeedToResubscribe(paramInRender);

        if (determination) {
          switch (paramInRender.interfaceType) {
            case 'single key': {
              const normalizedKey = normalizeKey(paramInRender.key);
              const { initParam } = paramInRender;

              determineNeedToResubscribe = (paramToCheck) => ({
                determination:
                  paramToCheck.interfaceType !== 'single key' ||
                  paramToCheck.key !== paramInRender.key,
              });

              paramForUseRetrieveState = {
                takeStateAndCalculateValue: (state) => state[normalizedKey],

                initRecords: [
                  initParam === undefined
                    ? { key: normalizedKey }
                    : {
                        key: normalizedKey,
                        initValueToCalculate: initParam,
                        needToCalculateValue: true,
                      },
                ],
              };

              break;
            }

            case 'keys list': {
              const keysSet = new Set(paramInRender.keys);

              const initRecords = paramInRender.keys.map((key) => ({
                key: normalizeKey(key),
              }));

              determineNeedToResubscribe = (paramToCheck) => ({
                determination:
                  paramToCheck.interfaceType !== 'keys list' ||
                  paramToCheck.keys.length !== keysSet.size ||
                  paramToCheck.keys.some((key) => !keysSet.has(key)),
              });

              paramForUseRetrieveState = {
                takeStateAndCalculateValue:
                  createTakeStateAndCalculateValueForObjectAndFuncAndList(initRecords),

                initRecords,
              };

              break;
            }

            case 'object interface': {
              const { initState } = paramInRender;
              const keys = calculatedKeys ?? getEnumerableKeys(initState);
              const keysSet = new Set(keys);
              const initRecords = keys.map((key) => ({ key, initValue: initState[key] }));

              determineNeedToResubscribe = (paramToCheck) => {
                if (paramToCheck.interfaceType === 'object interface') {
                  const nextKeys = getEnumerableKeys(paramToCheck.initState);

                  return {
                    determination:
                      nextKeys.length !== keysSet.size || nextKeys.some((key) => !keysSet.has(key)),

                    calculatedKeys: nextKeys,
                  };
                }

                return { determination: true };
              };

              paramForUseRetrieveState = {
                takeStateAndCalculateValue:
                  createTakeStateAndCalculateValueForObjectAndFuncAndList(initRecords),

                initRecords,
              };

              break;
            }

            case 'function interface': {
              const initState = paramInRender.createInitState();

              const initRecords = getEnumerableKeys(initState).map((key) => ({
                key,
                initValue: initState[key],
              }));

              determineNeedToResubscribe = createDetermineNeedToResubscribeWithDepsInvolved(
                paramInRender.deps,
                'function interface'
              );

              paramForUseRetrieveState = {
                takeStateAndCalculateValue:
                  createTakeStateAndCalculateValueForObjectAndFuncAndList(initRecords),

                initRecords,
              };

              break;
            }

            case 'selector':
              determineNeedToResubscribe = createDetermineNeedToResubscribeWithDepsInvolved(
                paramInRender.deps,
                'selector'
              );

              paramForUseRetrieveState = { takeStateAndCalculateValue: paramInRender.selector };

              break;

            default:
              break;
          }
        }

        return useRetrieveState(paramForUseRetrieveState);
      };

      return { useInRender };
    });

    return useInRender(param);

    type UseRetrieveState = (subscribingParams: SubscribingParam | null) => UseInterstateReturn;

    function createUseRetrieveState(): UseRetrieveState {
      let retrieveValue: () => UseInterstateReturn;
      let unsubscribe: () => void;
      let removeFromWatchList: () => void;

      // eslint-disable-next-line no-shadow
      const useRetrieveState: UseRetrieveState = (subscribingParams) => {
        /**
         * Emit setter using to trigger rendering of component signaling when value of `key` changed
         * in global state
         */
        const [, setState] = useState({});

        if (subscribingParams) {
          unsubscribe?.();
          const { takeStateAndCalculateValue, initRecords } = subscribingParams;

          ({ retrieveValue, unsubscribe, removeFromWatchList } = reactSubscribeState(
            () => {
              setState({});
            },

            takeStateAndCalculateValue,

            initRecords
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

      return useRetrieveState;
    }

    function createTakeStateAndCalculateValueForObjectAndFuncAndList(
      initRecords: InitRecordsForSubscribing<M, K>
    ): TakeStateAndCalculateValue<M, Pick<M, K>> {
      return (state) =>
        Object.fromEntries(initRecords.map(({ key }) => [key, state[key]])) as Pick<M, K>;
    }

    function createDetermineNeedToResubscribeWithDepsInvolved(
      depsToCheckWith: readonly any[] | undefined,
      allowedInterfaceTypes: 'function interface' | 'selector'
    ): DetermineNeedToResubscribe {
      return depsToCheckWith
        ? (paramToCheck) => ({
            determination:
              paramToCheck.interfaceType !== allowedInterfaceTypes ||
              !paramToCheck.deps ||
              paramToCheck.deps.length !== depsToCheckWith.length ||
              paramToCheck.deps.some((dep, index) => !Object.is(dep, depsToCheckWith[index])),
          })
        : () => ({ determination: true });
    }
  }

  function unifyUseInterstateInterface<K extends keyof M>(
    ...[firstArg, secondArg]: UseInterstateArgs<K>
  ): UnifiedInterfaceForUseInterstate<K> {
    switch (typeof firstArg) {
      case 'object':
        return isArray(firstArg)
          ? { interfaceType: 'keys list', keys: firstArg }
          : {
              interfaceType: 'object interface',
              initState: firstArg,
            };

      case 'function':
        return {
          interfaceType: 'function interface',
          createInitState: firstArg,
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

function normalizeKey<K extends InterstateKey>(key: K): K {
  return (typeof key === 'number' ? `${key}` : key) as K;
}

function isArray<T, Arr extends readonly any[]>(keyOrKeys: T | Arr): keyOrKeys is Arr {
  return Array.isArray(keyOrKeys);
}

export * from './DevTypes';
export * from './UseInterstateTypes';
