/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { StrictMode } from 'react';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseInterstateKeyInterface: TestCase = [
  'useInterstate single key interface works',

  ({
    useInterstateImport: { initInterstate },
    triggersCounterImport: { createTriggersCounter },
    createComponentsImport: { createListenerComponent },
    testingLibraryReact: { act, render },
  }: TestParameters): void => {
    const symbolKey = Symbol('symbol_key');

    type TestState = {
      foo: number;
      77: string;
      [symbolKey]: object;
    };

    const { useInterstate, setInterstate, resetInterstate } = initInterstate<TestState>();

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
          {...{ testId: testComponentID, stateKey: 'foo', effectFn: () => effectCounter++ }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 0));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('0');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 0));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('0');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    rerender(<StrictMode />);
    resetInterstate();

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 'foo',
            initParam: 100,
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('100');
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', (p: number) => p * 3));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('300');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{ testId: testComponentID, stateKey: 77, effectFn: () => effectCounter++ }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'hi'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('hi');
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'lo'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('lo');
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: symbolKey,
            initParam: { a: true },
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"a":true}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(symbolKey, { b: false }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"b":false}');
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 300));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"b":false}');
    expect(effectCounter).numberToBeConsideringFlag(0);

    rerender(<></>);

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
  },
];
