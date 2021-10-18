/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactElement } from 'react';
import type {
  UseInterstate,
  UseInterstateDev,
  InitInterstateDev,
  InitInterstate,
} from '../src/useInterstate';
import { initInterstate } from '../src/useInterstate';

const example1 = () => {
  /**
   * The shape of the state inferred from the type of the value passed to `initInterstate`
   */
  const { useInterstate, readInterstate, setInterstate, resetInterstate } = initInterstate({
    color: 'red',
    density: 100,
    integrity: true,
  });

  const density = readInterstate('density');

  /**
   * `density` is inferred to be a number
   */
  const densityRatio = density / 100;
};

const example2 = () => {
  interface State {
    color: string;
    density: number;
    integrity: boolean;
  }

  /**
   * Explicitly specify the shape of the state
   */
  const { useInterstate, readInterstate, setInterstate, resetInterstate } = initInterstate<State>();

  const density = readInterstate('density');

  /**
   * `density` is inferred to be a number
   */
  const densityRatio = density / 100;

  /**
   * `prevValue` is inferred to be a string, so it is an error to divide by 100
   */
  setInterstate('color', (prevValue) => prevValue / 100);
};

const example3 = () => {
  interface State {
    color: string;
    density: number;
    integrity: boolean;
  }

  const { useInterstate } = initInterstate<State>();

  /* ... */

  useInterstate('colour');
};

const example4 = () => {
  interface State {
    color: string;
    density: number;
    integrity: boolean;
  }

  const { useInterstate } = initInterstate<State>();

  const useInterstateDev: UseInterstateDev<State> = useInterstate as UseInterstate<State>;
};
