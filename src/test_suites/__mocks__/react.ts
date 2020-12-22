import { mockReactUseMemo } from '../assets/mockReactUseMemo';
import { flagManager } from '../assets/testFlags';

const react = jest.requireActual('react');

module.exports = mockReactUseMemo(react, flagManager);
