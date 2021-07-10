# use-interstate

![use-interstate](use-interstate.png)

:warning: The library is now at the pre-release stage.

*use-interstate* is a state management library for *React*.

## Features

* The library does not have dependencies (polyfilled code depends on *@babel/runtime* to avoid
  duplications).
* It ensures the performance at least on the same level as the popular state management solutions
  for *React*, e. g. *Redux*, *Recoil*.
* It has a small size.
* It is written with the use of the standard React hooks only, thus ensures better compatibility.
* It is written in *TypeScript* and nicely typed, providing safety and maintainability for codebases
  employing *TypeScript*.
* Its logic is aligned and synchronized with the natural life cycles of *React* components, allowing
  the use similar to the use of the standard *React* hook `useState`.
* It does not require having a specific context provider at the root of the component tree of an
  application.
* It is agnostic to application architecture, so one can use the library adopting either redux-like
  style with reducers and selectors, come up with other approaches, e. g. state machine, or use it
  simply as an "interstate" variant of the standard `useState` hook which is great for prototyping
  and creating proofs of concept.

## Use

### `goInterstate`

It is important that *use-interstate* does not require a context provider at the root of the
components tree. Instead, creating a unique copy of tools is needed. It provides better security for
the whole app. Also, in the case of using *TypeScript*, it allows setting the shape of the app's
state to provide safety of use.

```ts
import { goInterstate } from 'use-interstate';

type State = { color: string; density: number; integrity: boolean };

const { useInterstate, readInterstate, setInterstate, initInterstate } = goInterstate<State>();
```

### `useInterstate`

`useInterstate` implies several call interfaces to subscribe for the state changes. The simplest way
to subscribe is to pass the key name. The second optional argument imitates the argument that the
standard `useState` accepts, i. e. the default value in the form of an explicitly defined value or a
function being called to calculate it. Unsettled state keys are assuming to hold `undefined` .

```ts
// Not providing default init state. `undefined` if the state not initialized before.
const color = useInterstate('color');

// Providing default state. If the state already initialized the default value is skipping (the
// function will not even run to calculate it).
const density = useInterstate('density', () => 10 + 3);

const integrity = useInterstate('integrity', true);
```

To subscribe for multiple state keys, `useInterstate` accepts an array of the key names.

```ts
// typeof state1 = { color: string; density: number }
const state1 = useInterstate(['color', 'density']);
```

The way to subscribe and provide the default values for the piece of the state is by passing a raw
object or a function resulting in such an object.

```ts
// typeof state2 = { color: string; density: number; integrity: boolean }
const state2 = useInterstate({ color: '#9e9e9e', density: undefined, integrity: () => true });

// typeof state3 = { density: number }
const state3 = useInterstate(() => ({ integrity: false }));
```

Each change of the state leads to rerendering components that have the `useIntestate` hook
subscribed to the affected keys of the state. It is possible to change subscriptions dynamically but
only in the case of using a single key name as an argument. It is restricted to change arguments by
switching call interface dynamically.

```ts
// At the first run `props.subscribe === 'color'` that gives the value of `color` of the state. If
// it changes to 'density', `val` holds the value of `density`
const val = useInterstate(props.subscribe);
```

The hook is also remembering the initial parameter for any of the multikey subscriptions.

```ts
// At the first run `props.subscribe === ['color', 'density']`. If it changes to 
// `() => ({ integrity: boolean })`, `val` is still to be
// `{ color: string; density: number }`
const val = useInterstate(props.subscribe);
```

### `readInterstate`

Mostly `readInterstate` repeats `useInterstate` . The difference is that `readInterstate` is not
subscribing to the state. Its task to read the state safely virtually in any place of the code. It
accepts a single key name or an array of keys.

```ts
// `undefined` if state not initialized before.
const color = readInterstate('color');

// typeof state = { color: string; density: number }
const state = readInterstate(['color', 'density']);
```

### `acceptSelector`

Both `useInterstate` and `readInterstate` have a property `acceptSelector` that allows reading or
subscribing to the state through a selector function.

```ts
const v1 = useInterstate.acceptSelector((state) => (state.integrity ? state.density : 0));

const v2 = readInterstate.acceptSelector(({ color }) => 'color is: ' + color);

// Creating the snapshot of the state. If to return `state` without destructuring,
// i.e. (state) => state, the returning object will not be stable.
const stateSnapshot = readInterstate.acceptSelector(({ ...state }) => state);
```

### `setInterstate`

Although `useState` returns both the current state value and the setter function providing the way
to change the local state, it does not have much sense to emit a setter function through the hook
inside the component function's body to have a chance to change the global state. `setInterstate` is
accessible on its own to provide that ability. `setInterstate` allows accepting different call
interfaces, just like `useInterstate` .

```ts
setInterstate('color', 'white');

setInterstate('integrity', (prevIntegrity) => !prevIntegrity);

setInterstate({ density: 3, integrity: false });

setInterstate({ density: (prevDensity) => prevDensity + 1 });

setInterstate(({ density: prevDensity, integrity: prevIntegrity }) => ({
  density: prevIntegrity ? prevDensity + 1 : 0,
}));
```

### `initInterstate`

The good practice is to provide the initial state for the app at the very beginning. It is the only
way to make sure that any state key holds valid value at the moment when they are being accessed
even for the first time. `initInterstate` comes for this purpose.

```ts
const { useInterstate, readInterstate, setInterstate } = initInterstate({
  color: 'black',
  density: 1000,
  integrity: true,
});
```

Important to remember that every call of `initInterstate` vanishes the entire state. It also returns
the copies of `useInterstate` , `readInterstate` , `setInterstate` with the same identity.
