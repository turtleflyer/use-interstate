import type * as useInterstateImport from '../../useInterstate';
import type { TriggersCounter } from '../../__mocks__/createState';

export type TestCase = readonly [name: string, test: RunTestCase];

export type RunTestCase = (testParameters: TestParameters) => void;

export interface TestParameters {
  useInterstateImport: UseInterstateImport;

  triggersCounterImport: TriggersCounterImport;
}

export type UseInterstateImport = typeof useInterstateImport;

interface TriggersCounterImport {
  createTriggersCounter: () => TriggersCounter;
}
