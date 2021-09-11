/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { StrictMode } from 'react';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testAsyncSetInterstate: TestCase = [
  'setInterstate works in async calls',

  async ({
    useInterstateImport: { initInterstate },
    triggersCounterImport: { createTriggersCounter },
    createComponentsImport: { createListenerComponent },
    testingLibraryReact: { render, waitFor },
  }: TestParameters): Promise<void> => {
    const symbolKey = Symbol('symbol_key');

    type TestState = {
      foo: number;
    };

    const { useInterstate, setInterstate } = initInterstate<TestState>();

    const triggersCounter = createTriggersCounter();
    const testComponentID = 'test_component';
    const TestComponent = createListenerComponent({ useInterstate });
    let effectCounter = 0;

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{ testId: testComponentID, stateKey: 'foo', effectFn: () => effectCounter++ }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    Promise.resolve().then(() => {
      setInterstate('foo', 100);
    });

    await waitFor(() => expect(getByTestId(testComponentID).firstChild!.textContent).toBe('100'));
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    Promise.resolve().then(() => {
      setInterstate('foo', -1);
    });

    await waitFor(() => expect(getByTestId(testComponentID).firstChild!.textContent).toBe('-1'));
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<></>);

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
  },
];
