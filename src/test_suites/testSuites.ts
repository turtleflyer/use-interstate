import { cleanup } from '@testing-library/react';
import path from 'path';
import './assets/expectNumberToBeConsideringFlag';
import './assets/expectTriggersNumber';
import type { TestFlags } from './assets/testFlags';
import { flagManager } from './assets/testFlags';
import type { RunTestCase, TestCase, TestParameters } from './assets/TestTypes';
import { testCreateAndInitInterstate } from './test_cases/testCreateAndInitInterstate';
import { testInitInterstate } from './test_cases/testInitInterstate';
import { testReadInterstateAcceptSelector } from './test_cases/testReadInterstateAcceptSelector';
import { testReadInterstateKeyInterface } from './test_cases/testReadInterstateKeyInterface';
import { testReadInterstateKeysInterface } from './test_cases/testReadInterstateKeysInterface';
import { testScenariosWithSiblings } from './test_cases/testScenariosWithSiblings';
import { testSetInterstateCheckedByReadInterstate } from './test_cases/testSetInterstateCheckedByReadInterstate';
import { testUnsuccessfulChangingInterface } from './test_cases/testUnsuccessfulChangingInterface';
import { testUseInterstateAcceptSelector } from './test_cases/testUseInterstateAcceptSelector';
import { testUseInterstateKeyInterface } from './test_cases/testUseInterstateKeyInterface';
import { testUseInterstateKeysInterface } from './test_cases/testUseInterstateKeysInterface';
import { testUseInterstateSchemaFnInterface } from './test_cases/testUseInterstateSchemaFnInterface';
import { testUseInterstateSchemaObjInterface } from './test_cases/testUseInterstateSchemaObjInterface';

jest.mock('../createState.ts');

export const testSuites = (packagePath: string): void => {
  const parsedPackagePath = path.relative('..', packagePath);

  describe.each([
    ['test logic only', { SHOULD_TEST_PERFORMANCE: false }],
    ['test performance too', { SHOULD_TEST_PERFORMANCE: true }],
  ])('Test useInterstate correctness (%s)', (_name: string, flags: Partial<TestFlags>): void => {
    const testParameters = {} as TestParameters;

    beforeAll(() => {
      flagManager.set(flags);
    });

    beforeEach(() => {
      jest.isolateModules(() => {
        testParameters.useInterstateImport = require(parsedPackagePath);
        testParameters.triggersCounterImport = require('../createState');
      });
    });

    afterEach(cleanup);

    if (!flags.SHOULD_TEST_PERFORMANCE) {
      runTestCases(
        testCreateAndInitInterstate,
        testInitInterstate,
        testReadInterstateKeyInterface,
        testReadInterstateKeysInterface,
        testReadInterstateAcceptSelector,
        testSetInterstateCheckedByReadInterstate
      );
    }

    runTestCases(
      testUseInterstateKeyInterface,
      testUseInterstateKeysInterface,
      testUseInterstateSchemaObjInterface,
      testUseInterstateSchemaFnInterface,
      testUseInterstateAcceptSelector,
      testUnsuccessfulChangingInterface,
      testScenariosWithSiblings
    );

    function runTestCases(...tests: readonly TestCase[]): void {
      test.each(tests)('%s', (_n: string, runTest: RunTestCase) => {
        runTest(testParameters);
      });
    }
  });
};
