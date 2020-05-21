import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import * as mockedCreateStoreMap from '../src/createStoreMap';
import {
  Scope,
  useInterstate,
  InterstateParam,
  InterstateInitializeParam,
  getUseInterstateErrorMethods,
  isUseInterstateError,
  UseInterstateError,
} from '../src/useInterstate';
import React, { useEffect, useMemo } from 'react';
import { executionCountersFactory } from '../../../../test_utilities/executionCounter';

jest.mock('../src/createStoreMap.ts');

const { settersCounterFactory } = mockedCreateStoreMap as typeof mockedCreateStoreMap & {
  settersCounterFactory(): (key: InterstateID) => number | undefined;
};

type ExtractFirstArgType<T> = T extends (firstArg: infer R, ...restArg: any) => any ? R : never;

function newRender(arg: ExtractFirstArgType<typeof render>) {
  const fromRender = render(arg);
  const { getByTestId } = fromRender;

  const fireNode = (testId: string, value: string) => {
    const element = getByTestId(testId);
    if (element) {
      const inputChild = element.querySelector(`[data-testid=${testId}] > input`);
      if (inputChild) {
        fireEvent.change(inputChild, {
          target: { value },
        });
      }
    }
  };

  const getTextFromNode = (testId: string) => {
    const element = getByTestId(testId);
    return element && element.firstChild && element.firstChild.nodeName === '#text'
      ? element.firstChild.textContent
      : '';
  };

  return { ...fromRender, fireNode, getTextFromNode };
}

type FieldsValue = string;
type InitType = InterstateInitializeParam<FieldsValue>;
type InterstateID = string | number;

export type ComposeCallback = (
  set: (v: InterstateParam<FieldsValue>) => void
) => ({ target: { value } }: { target: { value: string } }) => void;

interface TestComponentsProps {
  readonly subscribeId: InterstateID;
  readonly initialValue?: InitType;
  readonly testId?: string;
  readonly composeCallback?: (...args: any[]) => any;
  readonly countRender?: () => void;
}

const defaultComposeCallback: ComposeCallback = (set) => ({ target: { value } }) => {
  set(value);
};

type ComposeComponent = (
  importedUseInterstate: typeof useInterstate
) => React.FunctionComponent<TestComponentsProps>;

const composeCanListen: ComposeComponent = (importedUseInterstate) => ({
  subscribeId,
  initialValue,
  testId = '',
  countRender = () => {},
  children,
}) => {
  const [useSubscribe] = importedUseInterstate(subscribeId, initialValue);
  const state = useSubscribe();
  useEffect(() => {
    countRender();
  });

  return (
    <div data-testid={testId}>
      {state}
      {children}
    </div>
  );
};

const composeCanUpdate: ComposeComponent = (importedUseInterstate) => ({
  subscribeId,
  initialValue,
  testId = '',
  composeCallback = defaultComposeCallback,
  countRender = () => {},
  children,
}) => {
  const [, setState] = importedUseInterstate(subscribeId, initialValue);
  const callback = useMemo(() => composeCallback(setState), [composeCallback, setState]);
  useEffect(() => {
    countRender();
  });

  return (
    <div data-testid={testId}>
      <input value="" onChange={callback} />
      {children ? <div>{children}</div> : null}
    </div>
  );
};

const composeCanListenAndUpdate: ComposeComponent = (importedUseInterstate) => ({
  subscribeId,
  initialValue,
  testId = '',
  composeCallback = defaultComposeCallback,
  countRender = () => {},
  children,
}) => {
  const [useSubscribe, setState] = importedUseInterstate(subscribeId, initialValue);
  const state = useSubscribe();
  const callback = useMemo(() => composeCallback(setState), [composeCallback, setState]);
  useEffect(() => {
    countRender();
  });

  return (
    <div data-testid={testId}>
      {state}
      <input value="" onChange={callback} />
      <div>{children}</div>
    </div>
  );
};

interface ErrorRecord {
  current: Error | UseInterstateError;
}

type AssertWrapperCreator = () => [<R>(a: () => R) => R | never, ErrorRecord];

const createAssertWrapper: AssertWrapperCreator = () => {
  const errorRecord = {} as ErrorRecord;
  return [
    function assertWrapper(a) {
      const originalErrorLogging = console.error;
      console.error = jest.fn();
      try {
        return a();
      } catch (e) {
        errorRecord.current = e;

        throw e;
      } finally {
        console.error = originalErrorLogging;
      }
    },
    errorRecord,
  ];
};

export interface UseInterstateImport {
  readonly Scope: typeof Scope;
  readonly useInterstate: typeof useInterstate;
  readonly getUseInterstateErrorMethods: typeof getUseInterstateErrorMethods;
  readonly isUseInterstateError: typeof isUseInterstateError;
}

interface AssetsBase {
  readonly render: typeof newRender;
  readonly settersCounterFactory: typeof settersCounterFactory;
  readonly executionCountersFactory: typeof executionCountersFactory;
  readonly createAssertWrapper: AssertWrapperCreator;
}

export interface AssetsImport extends AssetsBase {
  readonly composeCanListen: ComposeComponent;
  readonly composeCanUpdate: ComposeComponent;
  readonly composeCanListenAndUpdate: ComposeComponent;
}

export interface TestParameter {
  assets: AssetsBase &
    UseInterstateImport & {
      readonly CanListen: React.FunctionComponent<TestComponentsProps>;
      readonly CanUpdate: React.FunctionComponent<TestComponentsProps>;
      readonly CanListenAndUpdate: React.FunctionComponent<TestComponentsProps>;
    };
}

export type TestDescription = (p: TestParameter) => [string, () => void];

export {
  newRender as render,
  settersCounterFactory,
  executionCountersFactory,
  composeCanListen,
  composeCanUpdate,
  composeCanListenAndUpdate,
  createAssertWrapper,
};
