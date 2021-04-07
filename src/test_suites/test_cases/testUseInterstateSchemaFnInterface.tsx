/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, render } from '@testing-library/react';
import React, { StrictMode } from 'react';
import { createListenerComponent } from '../assets/createComponents';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseInterstateSchemaFnInterface: TestCase = [
  'useInterstate schema function interface works',

  ({
    useInterstateImport: { goInterstate },
    triggersCounterImport: { createTriggersCounter },
  }: TestParameters): void => {
    const symbolKey = Symbol('symbol_key');

    const { setInterstate, useInterstate } = goInterstate<{
      foo: number;
      77: string;
      [symbolKey]: object;
    }>();

    const triggersCounter = createTriggersCounter();
    const testComponentID = 'test_component';
    const TestComponent = createListenerComponent({ useInterstate });
    let effectCounter = 0;

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: () => ({ foo: 100, 77: 'hi', [symbolKey]: { a: true } }),
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":100,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 200));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":200,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 200));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":200,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate('77', 'lo'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":200,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(symbolKey, { b: false }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":200,"symbol(0)":{"b":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ foo: (p) => p + 10, 77: 'no', [symbolKey]: { c: null } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no","foo":210,"symbol(0)":{"c":null}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ 77: 'no' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no","foo":210,"symbol(0)":{"c":null}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate({ foo: 15, 77: 'no', [symbolKey]: { 1: true } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no","foo":15,"symbol(0)":{"1":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<></>);

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, '77']).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
  },
];
