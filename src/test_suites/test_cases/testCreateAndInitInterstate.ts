/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testCreateAndInitInterstate: TestCase = [
  'Interstate created correctly (initInterstate)',

  ({ useInterstateImport: { initInterstate } }: TestParameters): void => {
    expect(initInterstate).toBeDefined();

    const { readInterstate, setInterstate, useInterstate } = initInterstate();

    // @ts-ignore
    expect(readInterstate && setInterstate && useInterstate).toBeDefined();
  },
];
