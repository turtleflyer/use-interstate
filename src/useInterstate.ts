import { useEffect, useState } from 'react';
import { createStore } from './createStore';
import { getEntriesOfEnumerableKeys } from './getEntriesOfEnumerableKeys';
import { isFunctionParameter } from './isFunctionParameter';
import { InitValuesForSubscribing, TakeStateAndCalculateValue } from './Store';
import type {
  AcceptSelector,
  InitInterstate,
  InterstateKey,
  InterstateMethods,
  InterstateSelector,
  ReadInterstate,
  ResetInterstate,
  SetInterstate,
  SetInterstateParam,
  SetInterstateSchemaParam,
  UseInterstate,
  UseInterstateInitParam,
  UseInterstateSchemaParam
} from './UseInterstateTypes';

export const initInterstate = (<M extends object>(
  initStateValues?: Partial<M>
): InterstateMethods<M> => {
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

  type SubscribingParams<K extends keyof M, R> = {
    takeStateAndCalculateValue: TakeStateAndCalculateValue<M, K, R>;
    initValues?: InitValuesForSubscribing<M, K>;
  };

  const useDriveInterstate = <K extends keyof M, R>(): UseGetState<K, R> => {
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
  };

  const useInterstate = (<K extends keyof M>(
    keyOrKeysOrInitParam: K | UseInterstateSchemaParam<M, K> | K[],
    initParam?: UseInterstateInitParam<M[K]>
  ): M[K] | Pick<M, K> => {
    const [{ useBody }] = useState(() => {
      let memKey: keyof M | null = null;
      let firstTimeRunSealed = false;
      let subscribingParams: SubscribingParams<K, M[K] | Pick<M, K>> | null = null;

      // eslint-disable-next-line no-shadow
      const useBody = (
        keyOrKeysOrInitParamCurr: K | UseInterstateSchemaParam<M, K> | K[],
        initParamCurr?: UseInterstateInitParam<M[K]>
      ): M[K] | Pick<M, K> => {
        switch (typeof keyOrKeysOrInitParamCurr) {
          case 'object':
            if (!firstTimeRunSealed) {
              const initValues = isArray(keyOrKeysOrInitParamCurr)
                ? keyOrKeysOrInitParamCurr.map((key) => [normalizeKey(key)] as const)
                : getEntriesOfEnumerableKeys(keyOrKeysOrInitParamCurr);

              subscribingParams = {
                takeStateAndCalculateValue: (state) =>
                  Object.fromEntries(initValues.map(([key]) => [key, state[key]])) as Pick<M, K>,
                initValues,
              };

              break;
            }

            subscribingParams = null;

            break;

          case 'function':
            if (!firstTimeRunSealed) {
              const initValues = getEntriesOfEnumerableKeys(keyOrKeysOrInitParamCurr());

              subscribingParams = {
                takeStateAndCalculateValue: (state) =>
                  Object.fromEntries(initValues.map(([key]) => [key, state[key]])) as Pick<M, K>,
                initValues,
              };

              break;
            }

            subscribingParams = null;

            break;

          default: {
            const normalizedKey = normalizeKey(keyOrKeysOrInitParamCurr);

            if (!firstTimeRunSealed || (memKey !== null && normalizedKey !== memKey)) {
              subscribingParams = {
                takeStateAndCalculateValue: (state) => state[normalizedKey],
                initValues: [
                  [
                    normalizedKey,
                    isFunctionParameter(initParamCurr) ? initParamCurr() : initParamCurr,
                  ],
                ],
              };

              memKey = normalizedKey;

              break;
            }

            subscribingParams = null;
          }
        }

        firstTimeRunSealed = true;
        const useGetState = useDriveInterstate<K, M[K] | Pick<M, K>>();

        return useGetState(subscribingParams);
      };

      return { useBody };
    });

    return useBody(keyOrKeysOrInitParam, initParam);
  }) as UseInterstate<M>;

  useInterstate.acceptSelector = (<R>(selector: InterstateSelector<M, R>): R => {
    const [{ useBody }] = useState(() => {
      let firstTimeRunSealed = false;

      // eslint-disable-next-line no-shadow
      const useBody = (selectorCurr: InterstateSelector<M, R>): R => {
        const subscribingParams = firstTimeRunSealed
          ? null
          : { takeStateAndCalculateValue: selectorCurr };
        firstTimeRunSealed = true;
        const useGetState = useDriveInterstate<keyof M, R>();

        return useGetState(subscribingParams);
      };

      return { useBody };
    });

    return useBody(selector);
  }) as AcceptSelector<M>;

  const setInterstate = (<K extends keyof M>(
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
  }) as SetInterstate<M>;

  const readInterstate = (<K extends keyof M>(keyOrKeys: K | readonly K[]): M[K] | Pick<M, K> =>
    isArray(keyOrKeys)
      ? (Object.fromEntries(keyOrKeys.map((key) => [key, getValue(normalizeKey(key))])) as Pick<
          M,
          K
        >)
      : getValue(normalizeKey(keyOrKeys))) as ReadInterstate<M>;

  readInterstate.acceptSelector = (<R>(selector: InterstateSelector<M, R>): R =>
    getStateUsingSelector(selector)) as AcceptSelector<M>;

  const resetInterstate = resetValue as ResetInterstate<M>;

  return {
    useInterstate,
    setInterstate,
    readInterstate,
    resetInterstate,
  };
}) as InitInterstate;

function isArray<T, Arr extends readonly any[]>(keyOrKeys: T | Arr): keyOrKeys is Arr {
  return Array.isArray(keyOrKeys);
}

function normalizeKey<K extends InterstateKey>(key: K): K {
  return (typeof key === 'number' ? `${key}` : key) as K;
}

export * from './DevTypes';
export * from './UseInterstateTypes';

