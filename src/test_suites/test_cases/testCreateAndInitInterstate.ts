/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { TestCase, UseInterstateImport } from '../assets/TestTypes';

export const testCreateAndInitInterstate: TestCase = [
  'Interstate created and initialized correctly (goInterstate, initInterstate)',

  ({
    useInterstateImport: { goInterstate },
  }: {
    useInterstateImport: UseInterstateImport;
  }): void => {
    expect(goInterstate).toBeDefined();

    const { initInterstate, readInterstate, setInterstate, useInterstate } = goInterstate();

    // @ts-ignore
    expect(initInterstate && readInterstate && setInterstate && useInterstate).toBeDefined();

    const {
      readInterstate: readInterstateAfterInit,
      setInterstate: setInterstateAfterInit,
      useInterstate: useInterstateAfterInit,
    } = initInterstate();

    expect(
      // @ts-ignore
      readInterstateAfterInit && setInterstateAfterInit && useInterstateAfterInit
    ).toBeDefined();

    expect(readInterstate).toBe(readInterstateAfterInit);
    expect(setInterstate).toBe(setInterstateAfterInit);
    expect(useInterstate).toBe(useInterstateAfterInit);
  },
];
