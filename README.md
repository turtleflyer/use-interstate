# use-interstate

*use-interstate* is a state management library for *React*.

![use-interstate](https://github.com/turtleflyer/use-interstate/blob/master/use-interstate.png)

> *:warning: The library is now at the beta stage. Any implementations in projects are welcome.
> Please feel free to share your experience with us
> ([turtlefly@gmail.com](mailto:turtlefly@gmail.com)).*

## Highlights

* The library does not have dependencies (polyfilled code depends on *@babel/runtime* to avoid
  duplications).
* It ensures the performance to be at least on the same level as the popular state management
  libraries for *React*, e. g. *Redux*, *Recoil*.
* It has a small size.
* It is heavily tested (more than 40 tests performed on the source code as well as on bundled code).
* It is written with the use of the standard React hooks only, thus ensures better compatibility.
* It is written in *TypeScript* and typed the way the error messages are [speaking the human
  language](https://github.com/turtleflyer/use-interstate/blob/master/docs/UseWithTypeScript.md#error-messages)
  (💣💥🙈 *You will love it!*).
* The logic of the *use-interstate* library is aligned and synchronized with the natural life cycles
  of *React* components which make the use and feeling similar to the standard *React* hook
  `useState` .
* It does not require having a *Context Provider* at the root of the component tree of an
  application, thus ensures [better security for
  applications](https://github.com/turtleflyer/use-interstate/blob/master/docs/SecurityNotes.md#why-not-context-provider).
* It is agnostic to application architecture, so one can use the library adopting either redux-like
  paradigm with actions, reducers, and selectors, state machine, or use it simply as an "interstate"
  variant of the standard `useState` hook which is great for prototyping and creating proofs of
  concepts.

## Install

```bash
npm i use-interstate
```

* [Use](https://github.com/turtleflyer/use-interstate/blob/master/docs/Use.md)
  + [`initInterstate`](https://github.com/turtleflyer/use-interstate/blob/master/docs/Use.md#initinterstate)
  + [`useInterstate`](https://github.com/turtleflyer/use-interstate/blob/master/docs/Use.md#useinterstate)
  + [`readInterstate`](https://github.com/turtleflyer/use-interstate/blob/master/docs/Use.md#readinterstate)
  + [`acceptSelector`
    method](https://github.com/turtleflyer/use-interstate/blob/master/docs/Use.md#acceptselector-method)
  + [`setInterstate`](https://github.com/turtleflyer/use-interstate/blob/master/docs/Use.md#setinterstate)
  + [`resetInterstate`](https://github.com/turtleflyer/use-interstate/blob/master/docs/Use.md#resetinterstate)
  + [deps](https://github.com/turtleflyer/use-interstate/blob/master/docs/Use.md#deps)

* [*use-interstate* and
  *TypeScript*](https://github.com/turtleflyer/use-interstate/blob/master/docs/UseWithTypeScript.md#use-interstate-and-typescript)
  + [Error
    messages](https://github.com/turtleflyer/use-interstate/blob/master/docs/UseWithTypeScript.md#error-messages)
  + [Dev
    types](https://github.com/turtleflyer/use-interstate/blob/master/docs/UseWithTypeScript.md#dev-types)
* [Why not *Context
  Provider*](https://github.com/turtleflyer/use-interstate/blob/master/docs/SecurityNotes.md#why-not-context-provider)
