/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { StrictMode } from 'react';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testAsyncSetInterstateOnlyOneUpdate: TestCase = [
  'async call of setInterstate results to only one update',

  async ({
    useInterstateImport: { initInterstate },
    triggersCounterImport: { createTriggersCounter },
    createComponentsImport: { createListenerComponent },
    testingLibraryReact: { render, waitFor },
  }: TestParameters): Promise<void> => {
    const symbolKey = Symbol('symbol_key');

    type TestState = {
      foo: number;
      77: string;
      [symbolKey]: object;
    };

    const { useInterstate, setInterstate } = initInterstate<TestState>({
      foo: 0,
      77: '',
      [symbolKey]: {},
    });

    const triggersCounter = createTriggersCounter();
    const testComponentID = 'test_component';
    const TestComponent = createListenerComponent({ useInterstate });
    let effectCounter = 0;

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            keys: ['foo', 77, symbolKey],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"","foo":0,"symbol(0)":{}}'
    );

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    Promise.resolve().then(() => {
      setInterstate(({ foo, 77: ss, [symbolKey]: sk }) => ({
        foo: foo + 1,
        77: ss + 'a',
        [symbolKey]: { ...sk, a: 1 },
      }));
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"a","foo":1,"symbol(0)":{"a":1}}'
      )
    );

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    Promise.resolve().then(() => {
      setInterstate({ foo: 0, 77: '', [symbolKey]: {} });
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"","foo":0,"symbol(0)":{}}'
      )
    );

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { foo: 0, 77: '', [symbolKey]: {} },
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"","foo":0,"symbol(0)":{}}'
    );

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    Promise.resolve().then(() => {
      setInterstate(({ foo, 77: ss, [symbolKey]: sk }) => ({
        foo: foo + 1,
        77: ss + 'a',
        [symbolKey]: { ...sk, a: 1 },
      }));
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"a","foo":1,"symbol(0)":{"a":1}}'
      )
    );

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    Promise.resolve().then(() => {
      setInterstate({ foo: 0, 77: '', [symbolKey]: {} });
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"","foo":0,"symbol(0)":{}}'
      )
    );

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: () => ({ foo: 0, 77: '', [symbolKey]: {} }),
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"","foo":0,"symbol(0)":{}}'
    );

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    Promise.resolve().then(() => {
      setInterstate(({ foo, 77: ss, [symbolKey]: sk }) => ({
        foo: foo + 1,
        77: ss + 'a',
        [symbolKey]: { ...sk, a: 1 },
      }));
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"a","foo":1,"symbol(0)":{"a":1}}'
      )
    );

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    Promise.resolve().then(() => {
      setInterstate({ foo: 0, 77: '', [symbolKey]: {} });
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"","foo":0,"symbol(0)":{}}'
      )
    );

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<></>);

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
  },
];
