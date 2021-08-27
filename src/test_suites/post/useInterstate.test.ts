import { testSuites } from '../testSuites';

testSuites('../../../lib/use-interstate.cjs.js', [
  ['test logic', {}],
  ['test performance', { SHOULD_TEST_PERFORMANCE: true }],
]);
