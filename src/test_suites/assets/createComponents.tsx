import type { PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import type { UseInterstateDev } from '../../DevTypes';
import type {
  ExtraStringKeys,
  Interstate,
  InterstateSelector,
  OnlyStringKeys,
  UseInterstateInitParam,
  UseInterstateSchemaParam,
} from '../../UseInterstateTypes';

type ListenerCompProps<M extends Interstate, K extends ExtraStringKeys<M>, R> = (
  | AllPropsElseUndefined<StateKeyProps<M, K>>
  | AllPropsElseUndefined<SchemaProps<M, K>>
  | AllPropsElseUndefined<KeysProps<M, K & OnlyStringKeys<M>>>
  | AllPropsElseUndefined<SelectorProps<M, R>>
) & {
  testId: string;
  renderFn?: () => void;
  effectFn?: () => void;
};

interface StateKeyProps<M extends Interstate, K extends keyof M> {
  stateKey: K;

  initParam?: UseInterstateInitParam<M[K]>;

  interpretResult?: (v: M[K]) => string;
}

interface SchemaProps<M extends Interstate, K extends ExtraStringKeys<M>> {
  initSchema: UseInterstateSchemaParam<M, K>;

  interpretResult?: (s: Pick<M, K>) => string;
}

interface KeysProps<M extends Interstate, K extends OnlyStringKeys<M>> {
  keys: readonly K[];

  interpretResult?: (s: Pick<M, K>) => string;
}

interface SelectorProps<M extends Interstate, R> {
  selector: InterstateSelector<M, R>;

  interpretResult?: (v: R) => string;
}

type AllPropsElseUndefined<P> = P &
  Omit<
    {
      stateKey?: undefined;
      initParam?: undefined;
      initSchema?: undefined;
      keys?: undefined;
      selector?: undefined;
    },
    keyof P
  >;

let symbolsCounter = 0;

export const defInterpretResult = (v: unknown): string => {
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
    ...Object.entries(v).map(([key, keyV]) => [key, separateAndProcessTypes(keyV)] as const),

    ...Object.getOwnPropertySymbols(v)
      .filter((key) => Object.prototype.propertyIsEnumerable.call(v, key))
      .map((key) => [interpretSymbol(), separateAndProcessTypes(v[key as keyof T])] as const),
  ]);
}

function interpretSymbol(): string {
  return `symbol(${symbolsCounter++})`;
}

export const createListenerComponent = <M extends Interstate>({
  useInterstate,
}: {
  useInterstate: UseInterstateDev<M>;
}) =>
  function ListenerComponent<K extends ExtraStringKeys<M>, R>(
    props: PropsWithChildren<ListenerCompProps<M, K, R>>
  ): JSX.Element {
    props.renderFn?.();

    useEffect(() => {
      props.effectFn?.();
    });

    const interpretResult = props.interpretResult ?? defInterpretResult;

    const stringifiedState = props.initSchema
      ? (interpretResult as NonNullable<typeof props.interpretResult>)(
          useInterstate(props.initSchema)
        )
      : props.keys
      ? (interpretResult as NonNullable<typeof props.interpretResult>)(useInterstate(props.keys))
      : props.selector
      ? (interpretResult as NonNullable<typeof props.interpretResult>)(
          useInterstate.acceptSelector(props.selector)
        )
      : (interpretResult as NonNullable<typeof props.interpretResult>)(
          useInterstate(props.stateKey, props.initParam)
        );

    return (
      <div data-testid={props.testId}>
        {stringifiedState}
        {props.children}
      </div>
    );
  };
