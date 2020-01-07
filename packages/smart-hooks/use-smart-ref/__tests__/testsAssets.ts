import { useSmartRef } from '../useSmartRef';
import { executionCountersFactory } from '../../../../test_utilities/executionCounter';

interface AssetsImport {
  executionCountersFactory: typeof executionCountersFactory;
}

interface UseSmartRefImport {
  useSmartRef: typeof useSmartRef;
}

interface TestParameter {
  assets: AssetsImport & UseSmartRefImport;
}

type TestDescription = (p: TestParameter) => [string, () => void];

export {
  executionCountersFactory,
  AssetsImport,
  UseSmartRefImport,
  TestParameter,
  TestDescription,
};
