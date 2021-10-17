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
   * useInterstate: UseInterstate<{
   *   color: string;
   *   density: number;
   *   integrity: boolean;
   * }>
   */
  const { useInterstate, readInterstate, setInterstate, resetInterstate } = initInterstate({
    color: 'red',
    density: 100,
    integrity: true,
  });
};

const example2 = () => {
  interface State {
    color: string;
    density: number;
    integrity: boolean;
  }

  const { useInterstate, readInterstate, setInterstate, resetInterstate } = initInterstate<State>();
};

const example3 = () => {
  interface State {
    color: string;
    density: number;
    integrity: boolean;
  }

  const { useInterstate } = initInterstate<State>();

  /** ... */

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
