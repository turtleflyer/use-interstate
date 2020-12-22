import mainTestSuit from '../mainTestSuit';
import { flagManager } from '../assets/testFlags';

flagManager.set({ SHOULD_TEST_IMPLEMENTATION: true });

mainTestSuit('../../useInterstate.tsx');
