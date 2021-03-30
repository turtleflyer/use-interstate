import { useEffect, useState } from 'react';
import { createStore } from './createStore';
import { getEntriesOfEnumerableKeys } from './getEntriesOfEnumerableKeys';
import { isFunctionParameter } from './isFunctionParameter';
import type { ReactKeyMethods, ReactTriggerMethods } from './Store';
import type {
  AcceptSelector,
  GoInterstate,
  InitInterstate,
  Interstate,
  InterstateMethods,
  InterstateSelector,
  ReadInterstate,
  SetInterstate,
  SetInterstateParam,
  SetInterstateSchemaParam,
  UseInterstate,
  UseInterstateInitParam,
  UseInterstateSchemaParam,
  UseInterstateSchemaParamObj,
} from './UseInterstateTypes';

export const goInterstate: GoInterstate = <M extends Interstate>(): InterstateMethods<M> => {
  const {
    initState,
    getValue,
    setValue,
    getStateUsingSelector,
    reactInitKey,
    reactRenderTask,
    reactEffectTask,
  } = createStore<M>();

  const useInterstatePlain = <K extends keyof M>(
    key: K,
    initParam?: UseInterstateInitParam<M[K]> | undefined
  ): M[K] => {
    const [{ useBody }] = useState(() => {
      let keyMethods: ReactKeyMethods | undefined;
      let setterMethods: ReactTriggerMethods | undefined;
      let memKey: keyof M;

      // eslint-disable-next-line no-shadow
      const useBody = (curKey: K, curInitP: UseInterstateInitParam<M[K]> | undefined): void => {
        //
        // Emit setter using to trigger rendering of component signaling when value of `key` changed
        // in global state
        //
        const [, setState] = useState({});
        //
        // For first call and any call when `key` changed it will place trigger in list of key entry
        //
        if (curKey !== memKey) {
          keyMethods = reactInitKey(curKey, curInitP);
          setterMethods?.removeTriggerFromKeyList();

          setterMethods = keyMethods.addTrigger(() => {
            setState({});
          });

          memKey = curKey;
        }
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        //
        // `setterMethods` is only `undefined` for first run on rendering. On "effect" stage it
        // always has value.
        useEffect(() => setterMethods!.removeTriggerFromWatchList(), [curKey]);
        useEffect(() => () => setterMethods!.removeTriggerFromKeyList(), []);
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      };

      return { useBody };
    });

    useBody(key, initParam);

    return getValue(key);
  };

  const useInterstate = (<K extends keyof M>(
    keyOrKeysOrInitParam?: K | UseInterstateSchemaParam<M, K> | readonly K[],
    initParam?: UseInterstateInitParam<M[K]>
  ): M[K] | Pick<M, K> => {
    reactRenderTask();
    useEffect(reactEffectTask);

    const [{ useGetState }] = useState(() => {
      let buildStructure: (readonly [K, () => M[K]])[] | undefined | null;

      // eslint-disable-next-line no-shadow
      const useGetState = (
        key?: unknown,
        init?: UseInterstateInitParam<M[K]>
      ): M[K] | Pick<M, K> => {
        //
        // In body of function props of component are captured as they were on first run because of
        // `useState` hook. `getState` itself returns state taking only most updated value of key.
        // Actually it could be any allowed parameter for `useInterstate` (that's why `key?:
        // unknown`) but it would be used only in case of variable `paramInterface` holds interface
        // type "key" fixed on first run. Since changing interface type is prohibited first argument
        // in this case is always expected to be key.
        //
        if (buildStructure === undefined) {
          switch (typeof keyOrKeysOrInitParam) {
            case 'object':
              buildStructure = Array.isArray(keyOrKeysOrInitParam)
                ? keyOrKeysOrInitParam.map((k) => [k, () => useInterstatePlain(k)] as const)
                : getEntriesOfEnumerableKeys(
                    keyOrKeysOrInitParam as UseInterstateSchemaParamObj<M, K>
                  ).map(
                    ([k, initP]: [key: K, initP: UseInterstateInitParam<M[K]> | undefined]) =>
                      [k, () => useInterstatePlain(k, initP)] as const
                  );

              break;

            case 'function':
              buildStructure = getEntriesOfEnumerableKeys(keyOrKeysOrInitParam()).map(
                ([k, initV]: [key: K, initV: M[K]]) =>
                  [k, () => useInterstatePlain(k, () => initV)] as const
              );

              break;

            default:
              buildStructure = null;

              break;
          }
        }

        return buildStructure
          ? (Object.fromEntries(buildStructure.map(([k, getV]) => [k, getV()] as const)) as Pick<
              M,
              K
            >)
          : //
            //
            // `key` and `init` are arguments of `getState` and match props of component on first
            // run
            //
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
        getEntriesOfEnumerableKeys(keyOrSetterSchema).forEach(
          (arg: [key: K, setterParam: SetInterstateParam<M[K]>]): void => {
            const [key, setterP] = arg;

            setValueNormalizingParam(key, setterP);
          }
        );

        break;

      case 'function':
        getEntriesOfEnumerableKeys(getStateUsingSelector(keyOrSetterSchema, getValue)).forEach(
          ([key, value]) => {
            setValue(key, value);
          }
        );

        break;

      default:
        setValueNormalizingParam(keyOrSetterSchema, setterParam as SetInterstateParam<M[K]>);

        break;
    }

    function setValueNormalizingParam(key: K, setterP: SetInterstateParam<M[K]>): void {
      setValue(key, isFunctionParameter(setterP) ? setterP(getValue(key)) : setterP);
    }
  }) as SetInterstate<M>;

  const readInterstate = (<K extends keyof M>(keyOrKeys: K | readonly K[]): M[K] | Pick<M, K> =>
    isKeysArray(keyOrKeys)
      ? (Object.fromEntries(keyOrKeys.map((key) => [key, getValue(key)] as const)) as Pick<M, K>)
      : getValue(keyOrKeys)) as ReadInterstate<M>;

  readInterstate.acceptSelector = (<R>(selector: InterstateSelector<M, R>): R =>
    getStateUsingSelector(selector, getValue)) as AcceptSelector<M>;

  const initInterstate = (<K extends keyof M>(
    initParam?: Pick<M, K>
  ): Omit<InterstateMethods<M>, 'initInterstate'> => {
    initState(initParam);

    return { useInterstate, setInterstate, readInterstate };
  }) as InitInterstate<M>;

  return {
    useInterstate,
    setInterstate,
    readInterstate,
    initInterstate,
  };
};

function isKeysArray<K>(keyOrKeys: K | readonly K[]): keyOrKeys is readonly K[] {
  return Array.isArray(keyOrKeys);
}

export * from './DevTypes';
export * from './UseInterstateTypes';
