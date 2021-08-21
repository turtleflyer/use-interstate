import path from 'path';
import './assets/expectNumberToBeConsideringFlag';
import './assets/expectTriggersNumber';
import type { TestFlags } from './assets/testFlags';
import { flagManager } from './assets/testFlags';
import type { RunTestCase, TestParameters } from './assets/TestTypes';
import { testCreateAndInitInterstate } from './test_cases/testCreateAndInitInterstate';
import { testInitInterstate } from './test_cases/testInitInterstate';
import { testReadInterstateAcceptSelector } from './test_cases/testReadInterstateAcceptSelector';
import { testReadInterstateKeyInterface } from './test_cases/testReadInterstateKeyInterface';
import { testReadInterstateKeysInterface } from './test_cases/testReadInterstateKeysInterface';
import { testScenariosWithSiblings } from './test_cases/testScenariosWithSiblings';
import { testSetInterstateCheckedByReadInterstate } from './test_cases/testSetInterstateCheckedByReadInterstate';
import { testSetInterstateCheckedByUseInterstate } from './test_cases/testSetInterstateCheckedByUseInterstate';
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
    ['test logic', {}],
    ['test implementation details', { SHOULD_TEST_IMPLEMENTATION: true }],
    ['test performance', { SHOULD_TEST_PERFORMANCE: true }],
  ])('Test useInterstate correctness (%s)', (_name: string, flags: Partial<TestFlags>) => {
    const testParameters = {} as TestParameters;
    flagManager.reset();
    flagManager.set(flags);
    let cleanup: () => void;

    beforeEach(() => {
      jest.isolateModules(() => {
        testParameters.useInterstateImport = require(parsedPackagePath);
        testParameters.triggersCounterImport = require('../createState');
        testParameters.createComponentsImport = require('./assets/createComponents');
        testParameters.testingLibraryReact = require('@testing-library/react');
        ({ cleanup } = testParameters.testingLibraryReact);
      });
    });

    afterEach(() => cleanup());

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
      testUnsuccessfulChangingInterface,
      testScenariosWithSiblings,
      testSetInterstateCheckedByUseInterstate,
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
        testUnsuccessfulChangingInterface,
        testScenariosWithSiblings,
        testSetInterstateCheckedByUseInterstate,
      ],

      SHOULD_TEST_PERFORMANCE: [
        testUseInterstateKeyInterface,
        testUseInterstateKeysInterface,
        testUseInterstateSchemaObjInterface,
        testUseInterstateSchemaFnInterface,
        testUseInterstateAcceptSelector,
        testUnsuccessfulChangingInterface,
        testScenariosWithSiblings,
        testSetInterstateCheckedByUseInterstate,
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
    )('%s', (_n: string, runTest: RunTestCase) => {
      runTest(testParameters);
    });
  });
};
