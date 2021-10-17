/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { initInterstate } from '../src/useInterstate';

const { useInterstate, readInterstate, setInterstate, resetInterstate } = initInterstate({
  // initial state
  color: 'red',
  density: 100,
  integrity: true,
});

/******************************************************************************/

const Component1 = () => {
  // If the record for "color" was not initialized before then `color === undefined`
  const color = useInterstate('color');

  // Providing the default state
  const integrity = useInterstate('integrity', true);

  /**
   * The function runs only once (if the record for "density" was initialized before in another part
   * of the code the function is never called)
   */
  const density = useInterstate('density', () => Math.random() * 100);

  // state1: { color: string; density: number }
  const state1 = useInterstate(['color', 'density']);

  // state2: { color: string; density: number; integrity: boolean }
  const state2 = useInterstate({ color: '#9e9e9e', density: 100, integrity: true });

  // state3: { density: number }
  const state3 = useInterstate(() => ({ integrity: false }));

  return <>{/** ... */}</>;
};

/******************************************************************************/

const Component2 = ({ subscribe }) => {
  /**
   * `subscribe` prop could be any key of the state. For example, if it receives the key "color" on
   * the first run, `useInterstate` gives the value of the "color" record. If later the component
   * has "density" for the `subscribe` prop, it re-subscribes and `val` holds the value of the
   * "density" record.
   */
  const val = useInterstate(subscribe);

  return <>{/** ... */}</>;
};

const Component3 = () => <Component2 subscribe={Math.random() < 0.5 ? 'color' : 'density'} />;

/******************************************************************************/

const Component4 = () => {
  const chooseSubscription = Math.random();

  return (
    <Component2
      subscribe={
        chooseSubscription < 0.25
          ? 'color'
          : chooseSubscription < 0.5
          ? ['density', 'integrity']
          : chooseSubscription < 0.75
          ? { color: 'red', density: 10 }
          : () => ({ color: 'blue', integrity: false })
      }
    />
  );
};

/******************************************************************************/

const color = readInterstate('color');

// state1: { color: string; density: number }
const state1 = readInterstate(['color', 'density']);

/******************************************************************************/

const val1 = useInterstate.acceptSelector((state) => (state.integrity ? state.density : null));

const val2 = useInterstate.acceptSelector(
  ({ color, density }) => `color is: ${color} and density is: ${density}`
);

// Destructuring is required. `(state) => state` returns an unstable immutable object.
const stateSnapshot = readInterstate.acceptSelector(({ ...state }) => state);

/******************************************************************************/

setInterstate('color', 'black');

setInterstate('integrity', (prevIntegrity) => !prevIntegrity);

setInterstate({ density: 3, integrity: false });

setInterstate(({ density: prevDensity, integrity: prevIntegrity }) => ({
  density: prevIntegrity ? prevDensity + 1 : 0,
}));

/******************************************************************************/

resetInterstate();

resetInterstate({ color: 'blue', density: 15, integrity: false });

/******************************************************************************/

const Component5 = ({ choice }) => {
  const state = useInterstate(
    // The function runs when the value of `choice` changes causing re-subscribing
    () => (choice === 0 ? { color: undefined } : { density: undefined }),
    [choice]
  );

  // The function runs only one time on the creation of the component
  const val = useInterstate.acceptSelector(
    ({ color, density }) => `color is: ${color} and density is: ${density}`,
    []
  );

  return <>{/** ... */}</>;
};
