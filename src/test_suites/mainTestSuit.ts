/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { cleanup } from '@testing-library/react';
import path from 'path';
import { flagManager } from './assets/testFlags';
import { AssetsImport, TestParameter, UseInterstateImport } from './assets/testsAssets';
import checkInitializationConcurrency from './test_cases/checkInitializationConcurrency';
import checkUpdateWithNoSubscribers from './test_cases/checkUpdateWithNoSubscribers';
import dynamicSubscriptionWorks from './test_cases/dynamicSubscriptionWorks';
import rerenderWithInitValueResetState from './test_cases/rerenderWithInitValueResetState';
import setSameValueRepeatedly from './test_cases/setSameValueRepeatedly';
import siblingsCanCommunicate from './test_cases/siblingsCanCommunicate';
import sophisticatedStructure from './test_cases/sophisticatedStructure';
import testChangeInterface from './test_cases/testChangeInterface';
import testContext from './test_cases/testContext';
import testEnhancedInterface from './test_cases/testEnhancedInterface';
import testErrorHandling from './test_cases/testErrorHandling';
import testErrorMethods from './test_cases/testErrorMethods';
import testIndependentMode from './test_cases/testIndependentMode';
import testMultistateInterface from './test_cases/testMultistateInterface';
import testSettersImmutability from './test_cases/testSettersImmutability';
import valuesRemainAfterTreeUnmount from './test_cases/valuesRemainAfterTreeUnmount';

const mainTestSuit = (packagePath: string): void => {
  const parsedPackagePath = path.relative('..', packagePath);

  describe.each([
    [
      'test logic',
      { MOCK_USE_MEMO: false, SHOULD_TEST_PERFORMANCE: false, INDEPENDENT_MODE: false },
      'original',
    ],
    [
      'test performance',
      { MOCK_USE_MEMO: false, SHOULD_TEST_PERFORMANCE: true, INDEPENDENT_MODE: false },
      'original',
    ],
    [
      'use mocked useMemo',
      { MOCK_USE_MEMO: true, SHOULD_TEST_PERFORMANCE: false, INDEPENDENT_MODE: false },
      'mocked',
    ],
    [
      'test in independent mode',
      { MOCK_USE_MEMO: true, SHOULD_TEST_PERFORMANCE: false, INDEPENDENT_MODE: true },
      'mocked',
    ],
  ])('Test useInterstate correctness (%s)', (_name, flags, proofOfMock) => {
    const testParameter: TestParameter = {} as TestParameter;

    beforeAll(() => {
      flagManager.set({ ...flags, PROOF_OF_MOCK: '' });
    });

    beforeEach(() => {
      jest.isolateModules(() => {
        const assetsImport = require('./assets/testsAssets') as AssetsImport;
        const { composeCanListen, composeCanUpdate, composeCanListenAndUpdate } = assetsImport;

        const useInterstateImport = require(parsedPackagePath) as UseInterstateImport;
        const useInterstateExport = flagManager.read('INDEPENDENT_MODE')
          ? { ...useInterstateImport, ...useInterstateImport.getUseInterstate() }
          : useInterstateImport;

        const [CanListen, CanUpdate, CanListenAndUpdate] = [
          composeCanListen,
          composeCanUpdate,
          composeCanListenAndUpdate,
        ].map((c) => c(useInterstateExport.useInterstate));

        testParameter.assets = {
          CanListen,
          CanUpdate,
          CanListenAndUpdate,
          ...assetsImport,
          ...useInterstateExport,
        };
      });
    });

    afterEach(cleanup);

    test(...siblingsCanCommunicate(testParameter));
    test(...sophisticatedStructure(testParameter));
    test(...dynamicSubscriptionWorks(testParameter));
    test(...testContext(testParameter));
    test(...testErrorHandling(testParameter));
    test(...testIndependentMode(testParameter));
    test(...testMultistateInterface(testParameter));
    test(...setSameValueRepeatedly(testParameter));
    test(...checkUpdateWithNoSubscribers(testParameter));

    if (!flags.SHOULD_TEST_PERFORMANCE) {
      test(...checkInitializationConcurrency(testParameter));
      test(...valuesRemainAfterTreeUnmount(testParameter));
      test(...rerenderWithInitValueResetState(testParameter));
      test(...testErrorMethods(testParameter));
      test(...testSettersImmutability(testParameter));
      test(...testChangeInterface(testParameter));
      test(...testEnhancedInterface(testParameter));
    }

    test('proof of mock', () => {
      expect(flagManager.read('PROOF_OF_MOCK')).toBe(proofOfMock);
    });
  });
};

export default mainTestSuit;
