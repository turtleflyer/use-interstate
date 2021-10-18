# Why not *Context Provider*

*Context Providers* are the convenient way to provide an access to common assets in the *React*
components tree hierarchy. This is how the *Redux* library, for example, provides the `store`
defined in the root `Provider` throw the hook `useStore`:

```js
const store = useStore();
```

The problem with such a popular open-source library is a potential security risk to expose the state
to a third-party component that depends on the same library and is located in some branch of the
components tree. It still could have access to the root `Provider`. The trust must be granted not
only to the library itself but every other component that uses it.

*use-interstate* generates the set of all necessary tools to manage the particular state via the
method `initInterstate`. Every component that has access to these tools is authorized to subscribe,
read, and update the state. It is a much more transparent approach to control permissions. For
bigger applications whose components are spread through multiple files, the recommended way to
provide access to the state is initializing the state and returning the methods in a separate file
to re-export all these tools using a modular approach:

```ts
import { initInterstate } from 'use-interstate';

export type NoteTitleID = `note-title-${number}`;

export type NotesTitles = { [P in NoteTitleID]: string };

export type NoteBodyID = `note-body-${number}`;

export type NotesBodies = { [P in NoteBodyID]: string };

export interface UIState {
  scrollPosition: number;
  columns: number;
}

export type AppState = UIState & NotesTitles & NotesBodies;

export const { useInterstate, setInterstate, readInterstate } = initInterstate<AppState>({
  scrollPosition: 0,
  columns: 1,
});
```
