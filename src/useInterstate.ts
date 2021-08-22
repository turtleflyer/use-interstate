import { useEffect, useState } from 'react';
import { createStore } from './createStore';
import { getEntriesOfEnumerableKeys } from './getEntriesOfEnumerableKeys';
import { isFunctionParameter } from './isFunctionParameter';
import type { ReactKeyMethods, ReactTriggerMethods } from './Store';
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
  UseInterstateSchemaParam,
} from './UseInterstateTypes';

export const initInterstate = (<M extends object>(
  initStateValues?: Partial<M>
): InterstateMethods<M> => {
  const {
    getValue,
    setValue,
    resetValue,
    getStateUsingSelector,
    reactInitKey,
    reactRenderTask,
    reactEffectTask,
  } = createStore(initStateValues);

  const useInterstatePlain = <K extends keyof M>(
    key: K,
    initParam?: UseInterstateInitParam<M[K]>
  ): M[K] => {
    const keyNormalized = normalizeKey(key);

    const [{ useBody }] = useState(() => {
      let keyMethods: ReactKeyMethods | undefined;
      let setterMethods: ReactTriggerMethods | undefined;
      let memKey: keyof M;

      // eslint-disable-next-line no-shadow
      const useBody = (curKey: K, curInitParam?: UseInterstateInitParam<M[K]>): void => {
        /**
         *
         * Emit setter using to trigger rendering of component signaling when value of `key` changed
         * in global state
         */
        const [, setState] = useState({});

        /**
         * For first call and any call when `key` changed it will place trigger in list of key entry
         */
        if (curKey !== memKey) {
          keyMethods = reactInitKey(curKey, curInitParam);
          setterMethods?.removeTriggerFromKeyList();

          setterMethods = keyMethods.addTrigger(() => {
            setState({});
          });

          memKey = curKey;
        }

        /**
         * `setterMethods` is only `undefined` for first run on rendering. On "effect" stage it
         * always has value.
         */
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        useEffect(() => setterMethods!.removeTriggerFromWatchList(), [curKey]);
        useEffect(() => () => setterMethods!.removeTriggerFromKeyList(), []);
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      };

      return { useBody };
    });

    useBody(keyNormalized, initParam);

    return getValue(keyNormalized);
  };

  const useInterstate = (<K extends keyof M>(
    keyOrKeysOrInitParam: K | UseInterstateSchemaParam<M, K> | K[],
    initParam?: UseInterstateInitParam<M[K]>
  ): M[K] | Pick<M, K> => {
    reactRenderTask();
    useEffect(reactEffectTask);

    const [{ useGetState }] = useState(() => {
      // eslint-disable-next-line no-shadow
      const useGetState = (key: {}, init?: UseInterstateInitParam<M[K]>): M[K] | Pick<M, K> => {
        /**
         *
         * In the scope of the function the props of the component are being captured as they were
         * on the first run. It is of how `useState` hook works (it runs the init function once on
         * the creating of the react element). `useGetState` returns the state with the most updated
         * values of keys or a single value for a key. `useGetState` takes parameters from the
         * parent function (`useInterstate`). Because there are 4 possible parameter interfaces, the
         * first parameter is any not nullish value (`{}`). At the same time passed parameters are
         * interesting only for single key subscription when one can dynamically change the
         * subscription to a new key. For multi-key interfaces changing parameters is prohibited.
         */
        const [buildStructure] = useState(
          (): (readonly [key: K, initParam: () => M[K]])[] | null => {
            switch (typeof keyOrKeysOrInitParam) {
              case 'object':
                return isArray(keyOrKeysOrInitParam)
                  ? keyOrKeysOrInitParam.map((k) => [k, () => useInterstatePlain(k)])
                  : getEntriesOfEnumerableKeys(keyOrKeysOrInitParam).map(([k, initV]) => [
                      k,
                      () => useInterstatePlain(k, () => initV),
                    ]);

              case 'function':
                return getEntriesOfEnumerableKeys(keyOrKeysOrInitParam()).map(([k, initV]) => [
                  k,
                  () => useInterstatePlain(k, () => initV),
                ]);

              default:
                return null;
            }
          }
        );

        return buildStructure
          ? (Object.fromEntries(buildStructure.map(([k, getV]) => [k, getV()])) as Pick<M, K>)
          : /**
             *
             * `key` and `init` are arguments of `getState` and match props of component on first
             * run
             */
            useInterstatePlain(key as K, init);
      };

      return { useGetState };
    });

    return useGetState(keyOrKeysOrInitParam, initParam);
  }) as UseInterstate<M>;

  useInterstate.acceptSelector = (<R>(selector: InterstateSelector<M, R>): R => {
    reactRenderTask();
    useEffect(reactEffectTask);
    const [memSelector] = useState(() => selector);

    return getStateUsingSelector(memSelector, useInterstatePlain);
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
        getEntriesOfEnumerableKeys(getStateUsingSelector(keyOrSetterSchema, getValue)).forEach(
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
    getStateUsingSelector(selector, getValue)) as AcceptSelector<M>;

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
