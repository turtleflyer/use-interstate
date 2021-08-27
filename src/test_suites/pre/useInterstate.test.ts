import { testSuites } from '../testSuites';

testSuites('../../useInterstate.ts', [
  ['test logic', {}],
  ['test implementation details', { SHOULD_TEST_IMPLEMENTATION: true }],
  ['test performance', { SHOULD_TEST_PERFORMANCE: true }],
]);
