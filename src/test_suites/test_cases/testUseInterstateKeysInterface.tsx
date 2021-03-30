/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, render } from '@testing-library/react';
import React, { StrictMode } from 'react';
import { createListenerComponent } from '../assets/createComponents';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseInterstateKeysInterface: TestCase = [
  'useInterstate array of keys interface works',

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
            keys: ['foo', '77', symbolKey],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"undefined","foo":"undefined","symbol(0)":"undefined"}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 100));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"undefined","foo":100,"symbol(0)":"undefined"}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('77', 'hi'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":100,"symbol(0)":"undefined"}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(symbolKey, { a: true }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":100,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ foo: (p) => p * 3, 77: 'lo', [symbolKey]: { b: false } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":300,"symbol(0)":{"b":false}}'
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
