# Use

## `initInterstate`

*use-interstate* does not require a *Context Provider* at the root of the components tree. Instead, 
it is needed to create a unique copy of methods (as the set of unique keys). It provides better
security for the whole app. Using *Context Providers* for sharing the state in popular open-source
libraries makes it possible to drain the state through third-party components used as dependencies.

A good practice is to provide the initial state for the app at the very beginning. It is the only
way to make sure that any state keys hold valid values at the moment when they are being accessed
even for the first time. The argument can be provided to `initInterstate` for this purpose. Also, in
the case of using *TypeScript*, initializing the app state allows setting cement boundaries for its
shape to ensure the safety of use.

```js
import { initInterstate } from 'use-interstate';

const { useInterstate, readInterstate, setInterstate, resetInterstate } = initInterstate({
  // initial state
  color: 'red',
  density: 100,
  integrity: true,
});
```

## `useInterstate`

`useInterstate` implies several call interfaces to subscribe for the state changes. The simplest way
is to pass the key name as an argument. The second optional parameter repeats the parameter that the
standard `useState` accepts, i. e. the default value in the form of an explicitly defined value or a
function being called to calculate it. If the state is already initialized the default value is
skipped. If it would be a function it does not even run. Unsettled (not initialized) state keys are
expected to hold `undefined` .

```js
// If the record for "color" was not initialized before then `color === undefined`
const color = useInterstate('color');

// Providing the default state
const integrity = useInterstate('integrity', true);

/**
 * The function runs only once (if the record for "density" was initialized before in another part
 * of the code the function is never called)
 */
const density = useInterstate('density', () => Math.random() * 100);
```

To subscribe for multiple state keys,  `useInterstate` accepts an array of the key names.

```js
// state1: { color: string; density: number }
const state1 = useInterstate(['color', 'density']);
```

The way to subscribe and provide the default values for the slice of the state is to pass a raw
object containing that default values or a function returning such an object.

```js
// state2: { color: string; density: number; integrity: boolean }
const state2 = useInterstate({ color: '#9e9e9e', density: 100, integrity: true });

// state3: { density: number }
const state3 = useInterstate(() => ({ integrity: false }));
```

For the function, there is a way how to prevent it to get called every time the component re-renders
using [an array of deps](#deps).

Subscribing to a particular key or several keys makes the component react to every state change
affecting them and not to changes of other records of the state. `useInterstate` also gives an
ability to change subscriptions dynamically during the life of the component.

```jsx
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
```

The ability to dynamically re-subscribe is not limited to only a single key.

```jsx
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
```

## `readInterstate`

`readInterstate` allows reading the most actual values of the state at any moment when it is needed.
The difference between `readInterstate` and `useInterstate` is that the former just read the state
without an actual subscription. It accepts a single key name or an array of keys.

```js
const color = readInterstate('color');

// state1: { color: string; density: number }
const state1 = readInterstate(['color', 'density']);
```

## `acceptSelector` method

Both `useInterstate` and `readInterstate` have a method `acceptSelector` that allows reading or
subscribing to the state through a selector function. It takes the whole state object as an argument
and returns any calculated result based on the records of the state.

```js
const val1 = useInterstate.acceptSelector((state) => (state.integrity ? state.density : null));
```

The state object inside the selector function is immutable. It is recommended to read necessary
properties at the very beginning especially in an asynchronous function. The better way is to
destructure properties in the argument.

```js
const val2 = useInterstate.acceptSelector(
  ({ color, density }) => `color is: ${color} and density is: ${density}`
);
```

The convenient way to make a snapshot of the whole state is:

```js
// Destructuring is required. `(state) => state` returns an unstable immutable object.
const stateSnapshot = readInterstate.acceptSelector(({ ...state }) => state);
```

`useInterstate.acceptSelector` can accept [an array of deps](#deps) as a second argument for the
sake of performance optimization.

## `setInterstate`

In contrast to`useState` that returns both the current state value and the setter function providing
the way to update the local state, the *use-interstate* library has an independent method
`setInterstate` created on the stage when the state has been initialized. Any state changes being
initiated by the`setInterstate` immediately cause re-rendering the components with the subscription
to the affected keys of the state. `setInterstate` has different call interfaces for a single key as
well as multiple keys. In both cases `setInterstate` assumes to take a function that accepts the
previous value(s) of the state as an argument to calculate the next state value(s). It is also
allowed to provide the new value(s) of the state directly. The new value(s) merge to the current
state causing the state update.

```js

setInterstate('color', 'black');

setInterstate('integrity', (prevIntegrity) => !prevIntegrity);

setInterstate({ density: 3, integrity: false });

setInterstate(({ density: prevDensity, integrity: prevIntegrity }) => ({
  density: prevIntegrity ? prevDensity + 1 : 0,
}));

```

## `resetInterstate`

`resetInterstate` zeroes the whole state. If the argument is provided it re-initializes the default
values for the keys. It is important that if some components were subscribed to the state at the
moment when `resetInterstate` has been called they would not be notified. It is not considered the
update of the state. The use cases for 'resetInterstate` are very limited.

```js
resetInterstate();

resetInterstate({color: 'blue', density: 15, integrity: false});
```

## deps

When `useInterstate` itself and its method `acceptSelector` have a function as a single argument
they would re-subscribe to the state on every re-rendering of the containing component calling this
function even if it remains the same. In most cases, it would not affect performance. Anyway, to
avoid undesirable extra work they assume an optional second argument which is an array of deps
familiar from standard *React* hooks `useEffect`, `useCallback`, `useMemo`.

```jsx
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
```
