import path from 'path';
import './assets/expectCounterToIncreaseBy';
import './assets/expectNumberOfTimesStateWasSubscribedToBe';
import {
  _testingAssets_resetResubscribedTimesCounter,
  _testingAssets_resubscribedTimesCounter,
} from './assets/expectNumberOfTimesStateWasSubscribedToBe';
import { _testingAsset_defineTriggersCounter } from './assets/expectTriggersNumber';
import type { TestFlags } from './assets/testFlags';
import { flagManager } from './assets/testFlags';
import type { RunTestCase, TestParameters } from './assets/TestTypes';
import { testAsyncSetInterstate } from './test_cases/testAsyncSetInterstate';
import { testAsyncSetInterstateOnlyOneUpdate } from './test_cases/testAsyncSetInterstateOnlyOneUpdate';
import { testBatchingAlwaysWorksCorrect } from './test_cases/testBatchingAlwaysWorksCorrect';
import { testChangingInterface } from './test_cases/testChangingInterface';
import { testCreateAndInitInterstate } from './test_cases/testCreateAndInitInterstate';
import { testFunctionsRun } from './test_cases/testFunctionsRun';
import { testInitInterstate } from './test_cases/testInitInterstate';
import { testReadInterstateAcceptSelector } from './test_cases/testReadInterstateAcceptSelector';
import { testReadInterstateKeyInterface } from './test_cases/testReadInterstateKeyInterface';
import { testReadInterstateKeysInterface } from './test_cases/testReadInterstateKeysInterface';
import { testResetInterstate } from './test_cases/testResetInterstate';
import { testScenariosWithSiblings } from './test_cases/testScenariosWithSiblings';
import { testSetInterstateCheckedByReadInterstate } from './test_cases/testSetInterstateCheckedByReadInterstate';
import { testSetInterstateCheckedByUseInterstate } from './test_cases/testSetInterstateCheckedByUseInterstate';
import { testUseInterstateAcceptSelector } from './test_cases/testUseInterstateAcceptSelector';
import { testUseInterstateKeyInterface } from './test_cases/testUseInterstateKeyInterface';
import { testUseInterstateKeysInterface } from './test_cases/testUseInterstateKeysInterface';
import { testUseInterstateSchemaFnInterface } from './test_cases/testUseInterstateSchemaFnInterface';
import { testUseInterstateSchemaObjInterface } from './test_cases/testUseInterstateSchemaObjInterface';
import { testUseWithRef } from './test_cases/testUseWithRef';
import { testUseWithUseEffect } from './test_cases/testUseWithUseEffect';

jest.mock('../createState.ts');

export const testSuites = (
  packagePath: string,
  testSuiteSets: [name: string, flags: Partial<TestFlags>][]
): void => {
  const parsedPackagePath = path.relative('..', packagePath);

  describe.each(testSuiteSets)(
    'Test useInterstate correctness (%s)',
    (_name: string, flags: Partial<TestFlags>) => {
      let testParameters: TestParameters;
      let cleanup: () => void;

      beforeAll(() => {
        flagManager.reset();
        flagManager.set(flags);
      });

      beforeEach(() => {
        jest.isolateModules(() => {
          testParameters = {} as TestParameters;
          testParameters.useInterstateImport = require(parsedPackagePath);
          testParameters.triggersCounterImport = require('../createState');
          testParameters.createComponentsImport = require('./assets/createComponents');
          testParameters.testingLibraryReact = require('@testing-library/react');
          testParameters.reactSubscribeStateNotifierImport = require('../createStore');
          ({ cleanup } = testParameters.testingLibraryReact);

          _testingAsset_defineTriggersCounter(
            testParameters.triggersCounterImport._testingAsset_triggersCounter
          );

          testParameters.reactSubscribeStateNotifierImport._toAccessWhileTesting_passReactSubscribeStateNotifier(
            _testingAssets_resubscribedTimesCounter
          );

          _testingAssets_resetResubscribedTimesCounter();
        });
      });

      afterEach(() => {
        cleanup();
      });

      const allTests = [
        testCreateAndInitInterstate,
        testInitInterstate,
        testReadInterstateKeyInterface,
        testReadInterstateKeysInterface,
        testReadInterstateAcceptSelector,
        testSetInterstateCheckedByReadInterstate,
        testUseInterstateKeyInterface,
        testUseInterstateKeysInterface,
        testUseInterstateSchemaObjInterface,
        testUseInterstateSchemaFnInterface,
        testUseInterstateAcceptSelector,
        testChangingInterface,
        testScenariosWithSiblings,
        testSetInterstateCheckedByUseInterstate,
        testResetInterstate,
        testAsyncSetInterstate,
        testAsyncSetInterstateOnlyOneUpdate,
        testBatchingAlwaysWorksCorrect,
        testFunctionsRun,
        testUseWithRef,
        testUseWithUseEffect,
      ];

      /**
       * Tests are grouped by the flags that they have test cases related to.
       */
      const testsGroupedByFlags = {
        SHOULD_TEST_IMPLEMENTATION: [
          testUseInterstateKeyInterface,
          testUseInterstateKeysInterface,
          testUseInterstateSchemaObjInterface,
          testUseInterstateSchemaFnInterface,
          testUseInterstateAcceptSelector,
          testChangingInterface,
          testScenariosWithSiblings,
          testSetInterstateCheckedByUseInterstate,
          testAsyncSetInterstate,
          testAsyncSetInterstateOnlyOneUpdate,
          testBatchingAlwaysWorksCorrect,
          testUseWithRef,
          testUseWithUseEffect,
        ],

        SHOULD_TEST_PERFORMANCE: [
          testUseInterstateKeyInterface,
          testUseInterstateKeysInterface,
          testUseInterstateSchemaObjInterface,
          testUseInterstateSchemaFnInterface,
          testUseInterstateAcceptSelector,
          testChangingInterface,
          testScenariosWithSiblings,
          testSetInterstateCheckedByUseInterstate,
          testAsyncSetInterstate,
          testAsyncSetInterstateOnlyOneUpdate,
          testBatchingAlwaysWorksCorrect,
          testUseWithRef,
          testUseWithUseEffect,
        ],
      };

      test.each(
        /**
         * Filtering the tests by the flags they need to be set.
         */
        allTests.filter((test) =>
          /**
           * Checking the flags if the test is in the list of that.
           */
          (Object.entries(flags) as [keyof TestFlags, boolean][]).every(
            /**
             * If the `flag` is set and the test is in the list `testsGroupedByFlags[flag]`, it means
             * that the test should be run.
             */
            ([flag, v]) =>
              v && testsGroupedByFlags[flag].some((testInFlagList) => testInFlagList === test)
          )
        )
      )('%s', async (_n: string, runTest: RunTestCase) => {
        await runTest(testParameters);
      });
    }
  );
};
