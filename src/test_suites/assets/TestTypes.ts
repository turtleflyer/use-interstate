import type * as testingLibraryReactImport from '@testing-library/react';
import type * as reactSubscribeStateNotifierImport from '../../createStore';
import type * as useInterstateImport from '../../useInterstate';
import type * as triggersCounterImport from '../../__mocks__/createState';
import type * as createComponentsImport from '../assets/createComponents';

export type TestCase = readonly [name: string, test: RunTestCase];

export type RunTestCase = (testParameters: TestParameters) => Promise<void> | void;

export interface TestParameters {
  useInterstateImport: UseInterstateImport;

  triggersCounterImport: TriggersCounterImport;

  createComponentsImport: CreateComponentsImport;

  testingLibraryReact: TestingLibraryReactImport;

  reactSubscribeStateNotifierImport: ReactSubscribeStateNotifierImport;
}

export type UseInterstateImport = typeof useInterstateImport;
export type TriggersCounterImport = typeof triggersCounterImport;
export type CreateComponentsImport = typeof createComponentsImport;
export type TestingLibraryReactImport = typeof testingLibraryReactImport;
export type ReactSubscribeStateNotifierImport = typeof reactSubscribeStateNotifierImport;
