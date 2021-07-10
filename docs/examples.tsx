/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { goInterstate } from '../lib/use-interstate';

type State = { color: string; density: number; integrity: boolean };

const { useInterstate, readInterstate, setInterstate, initInterstate } = goInterstate<State>();

const useInterstateExamples = () => {
  // Not providing default init state. `undefined` if the state not initialized before.
  const color = useInterstate('color');

  // Providing default state. If the state already initialized the default value is skipping (the
  // function will not even run to calculate it).
  const density = useInterstate('density', () => 10 + 3);

  const integrity = useInterstate('integrity', true);

  // typeof state1 = { color: string; density: number }
  const state1 = useInterstate(['color', 'density']);

  // typeof state2 = { color: string; density: number; integrity: boolean }
  const state2 = useInterstate({ color: '#9e9e9e', density: undefined, integrity: () => true });

  // typeof state3 = { density: number }
  const state3 = useInterstate(() => ({ integrity: false }));
};

const useInterstateChangingInterfaceWorkingExamples = (props: {
  subscribe: 'color' | 'density';
}) => {
  // At the first run `props.subscribe === 'color'` that gives the value of `color` of the state. If
  // it changes to 'density', `val` holds the value of `density`
  const val = useInterstate(props.subscribe);
};

const useInterstateChangingInterfaceNotWorkingExamples = (props: {
  subscribe: ['color', 'density'] | (() => { integrity: boolean });
}) => {
  // At the first run `props.subscribe === ['color', 'density']`. If it changes to
  // `() => ({ integrity: boolean })`, `val` is still to be
  // `{ color: string; density: number }`
  const val = useInterstate(props.subscribe);
};

const readInterstateExamples = () => {
  // `undefined` if state not initialized before.
  const color = readInterstate('color');

  // typeof state = { color: string; density: number }
  const state = readInterstate(['color', 'density']);
};

const acceptSelectorExamples = () => {
  const v1 = useInterstate.acceptSelector((state) => (state.integrity ? state.density : 0));

  const v2 = readInterstate.acceptSelector(({ color }) => 'color is: ' + color);

  // Creating the snapshot of the state. If to return `state` without destructuring,
  // i.e. (state) => state, the returning object will not be stable.
  const stateSnapshot = readInterstate.acceptSelector(({ ...state }) => state);
};

const setInterstateExamples = () => {
  setInterstate('color', 'white');

  setInterstate('integrity', (prevIntegrity) => !prevIntegrity);

  setInterstate({ density: 3, integrity: false });

  setInterstate({ density: (prevDensity) => prevDensity + 1 });

  setInterstate(({ density: prevDensity, integrity: prevIntegrity }) => ({
    density: prevIntegrity ? prevDensity + 1 : 0,
  }));
};

const initInterstateExamples = () => {
  const { useInterstate, readInterstate, setInterstate } = initInterstate({
    color: 'black',
    density: 1000,
    integrity: true,
  });
};
