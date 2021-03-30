import { flagManager } from '../assets/testFlags';
import { testSuites } from '../testSuites';

flagManager.reset();
flagManager.set({ SHOULD_TEST_IMPLEMENTATION: false });

testSuites('../../../lib/use-interstate.cjs.js');
