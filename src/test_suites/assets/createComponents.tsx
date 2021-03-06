import type { PropsWithChildren, ReactElement } from 'react';
import * as reactImport from 'react';
import { useEffect } from 'react';
import type { UseInterstateDev } from '../../DevTypes';
import type { InterstateSelector, UseInterstateInitParam } from '../../UseInterstateTypes';

interface TestProps {
  testId: string;
  renderFn?: () => void;
  effectFn?: () => void;
}

interface StateKeyProps<M extends object = any, K extends keyof M = any> {
  stateKey: K;

  initParam?: UseInterstateInitParam<M[K]>;

  interpretResult?: (v: M[K]) => string;
}

interface SchemaObjProps<M extends object = any, K extends keyof M = any> {
  initSchemaObj: Pick<M, K>;

  interpretResult?: (s: Pick<M, K>) => string;
}

interface SchemaFnProps<M extends object = any, K extends keyof M = any> {
  initSchemaFn: () => Pick<M, K>;

  deps?: any[];

  interpretResult?: (s: Pick<M, K>) => string;
}

interface KeysProps<M extends object = any, K extends keyof M = any> {
  keys: readonly K[];

  interpretResult?: (s: Pick<M, K>) => string;
}

interface SelectorProps<M extends object = any, R = any> {
  selector: InterstateSelector<M, R>;

  deps?: any[];

  interpretResult?: (v: R) => string;
}

type PropsWithRemainingUndefined<
  C extends StateKeyProps | SchemaObjProps | SchemaFnProps | KeysProps | SelectorProps
> = C &
  TestProps & {
    [P in keyof (StateKeyProps &
      SchemaObjProps &
      SchemaFnProps &
      KeysProps &
      SelectorProps) as P extends keyof C ? never : P]?: undefined;
  };

let symbolsCounter = 0;

export const stringifyState = (v: unknown): string => {
  symbolsCounter = 0;
  const processedV = separateAndProcessTypes(v);

  return typeof processedV === 'string' ? processedV : JSON.stringify(processedV);
};

function separateAndProcessTypes(v: unknown): unknown {
  return typeof v === 'object'
    ? v && processObject(v)
    : v === undefined
    ? `${v}`
    : typeof v === 'symbol'
    ? interpretSymbol()
    : v;
}

function processObject<T extends object>(v: T): Record<any, unknown> {
  return Object.fromEntries([
    ...Object.entries(v).map(([key, keyV]) => [key, separateAndProcessTypes(keyV)]),

    ...Object.getOwnPropertySymbols(v)
      .filter((key) => Object.prototype.propertyIsEnumerable.call(v, key))
      .map((key) => [interpretSymbol(), separateAndProcessTypes(v[key as keyof T])]),
  ]);
}

function interpretSymbol(): string {
  return `symbol(${symbolsCounter++})`;
}

type StateKeyPropsWithNoInitParam<M extends object, K extends keyof M> = Omit<
  StateKeyProps<M, K>,
  'initParam'
> &
  TestProps;

export const createListenerComponent = <M extends object>({
  useInterstate,
}: {
  useInterstate: UseInterstateDev<M>;
}): {
  <K extends keyof M, InitPConstrain extends { initParam?: unknown }>(
    props: (
      InitPConstrain['initParam'] extends infer InitP
        ? InitP extends (...x: any) => any
          ? InitP extends () => M[K]
            ? 'acceptable function'
            : 'wrong function'
          : InitP extends M[K]
          ? 'acceptable param'
          : 'wrong param'
        : never
    ) extends 'acceptable function' | 'acceptable param'
      ? PropsWithChildren<StateKeyPropsWithNoInitParam<M, K>> & InitPConstrain
      : PropsWithChildren<StateKeyPropsWithNoInitParam<M, K>> & { initParam?: undefined }
  ): ReactElement;

  <K extends keyof M, R>(
    props: PropsWithChildren<
      | PropsWithRemainingUndefined<SchemaObjProps<M, K>>
      | PropsWithRemainingUndefined<SchemaFnProps<M, K>>
      | PropsWithRemainingUndefined<KeysProps<M, K>>
      | PropsWithRemainingUndefined<SelectorProps<M, R>>
    >
  ): ReactElement;
} =>
  function ListenerComponent<K extends keyof M, R>(
    props: PropsWithChildren<
      | PropsWithRemainingUndefined<StateKeyProps<M, K>>
      | PropsWithRemainingUndefined<SchemaObjProps<M, K>>
      | PropsWithRemainingUndefined<SchemaFnProps<M, K>>
      | PropsWithRemainingUndefined<KeysProps<M, K>>
      | PropsWithRemainingUndefined<SelectorProps<M, R>>
    >
  ): ReactElement {
    props.renderFn?.();

    useEffect(() => {
      props.effectFn?.();
    });

    const interpretResult = props.interpretResult ?? stringifyState;

    const stringifiedState = props.initSchemaObj
      ? (interpretResult as NonNullable<SchemaObjProps['interpretResult']>)(
          useInterstate(props.initSchemaObj)
        )
      : props.initSchemaFn
      ? (interpretResult as NonNullable<typeof props.interpretResult>)(
          useInterstate(props.initSchemaFn, props.deps)
        )
      : props.keys
      ? (interpretResult as NonNullable<typeof props.interpretResult>)(useInterstate(props.keys))
      : props.selector
      ? (interpretResult as NonNullable<typeof props.interpretResult>)(
          useInterstate.acceptSelector(props.selector, props.deps)
        )
      : (interpretResult as NonNullable<StateKeyProps['interpretResult']>)(
          useInterstate(props.stateKey as StateKeyProps['stateKey'], props.initParam)
        );

    return (
      <div data-testid={props.testId}>
        {stringifiedState}
        {props.children}
      </div>
    );
  };

export { reactImport };
