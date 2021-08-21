/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { ReadInterstate } from '../../useInterstate';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testInitInterstate: TestCase = [
  'Interstate initialized correctly (initInterstate)',

  ({ useInterstateImport: { initInterstate } }: TestParameters): void => {
    const symbolKey = Symbol('symbol_key');

    interface TestState {
      foo: number;
      77: string;
      [symbolKey]: object;
    }

    let readInterstate: ReadInterstate<TestState>;

    const defState01: TestState = { foo: 100, 77: 'hi', [symbolKey]: { a: true } };
    ({ readInterstate } = initInterstate(defState01));
    expectStateToBe(defState01);

    ({ readInterstate } = initInterstate<TestState>());
    expectStateToBe({});
    expectStateToBe({ foo: undefined, 77: undefined, [symbolKey]: undefined });

    const defState02: TestState = { foo: 1, 77: 'lo', [symbolKey]: { 0: null } };
    ({ readInterstate } = initInterstate(defState02));
    expectStateToBe(defState02);

    function expectStateToBe<E extends Partial<TestState>>(expectedState: E): void {
      (
        [
          ...Object.getOwnPropertyNames(expectedState),
          ...Object.getOwnPropertySymbols(expectedState),
        ] as (keyof TestState)[]
      ).forEach((key) => {
        expect(readInterstate(key)).toStrictEqual(expectedState[key]);
      });

      expect(readInterstate.acceptSelector((state) => ({ ...state }))).toStrictEqual(expectedState);
    }
  },
];
