import { flagManager } from '../assets/testFlags';
import { testSuites } from '../testSuites';

flagManager.reset();
flagManager.set({ SHOULD_TEST_IMPLEMENTATION: true });

testSuites('../../useInterstate.ts');
