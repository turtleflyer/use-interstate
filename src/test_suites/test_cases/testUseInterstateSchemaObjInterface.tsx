/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, render } from '@testing-library/react';
import React, { StrictMode } from 'react';
import { createListenerComponent } from '../assets/createComponents';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseInterstateSchemaObjInterface: TestCase = [
  'useInterstate schema object interface works',

  ({
    useInterstateImport: { goInterstate },
    triggersCounterImport: { createTriggersCounter },
  }: TestParameters): void => {
    const symbolKey = Symbol('symbol_key');

    const { initInterstate, setInterstate, useInterstate } = goInterstate<{
      foo: number;
      77: string;
      [symbolKey]: object;
    }>();

    const testComponentID = 'test_component';
    const TestComponent = createListenerComponent({ useInterstate });
    const triggersCounter = createTriggersCounter();
    let effectCounter = 0;

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { foo: undefined, 77: undefined, [symbolKey]: undefined },
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

    act(() => setInterstate({ foo: 200, 77: 'lo', [symbolKey]: { b: false } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":200,"symbol(0)":{"b":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    initInterstate();
    rerender(<StrictMode />);

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: {
              foo: 1000,
              77: 'no',
              [symbolKey]: () => ({ c: null }),
            },
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no","foo":1000,"symbol(0)":{"c":null}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() =>
      setInterstate({
        foo: 1,
        77: 'yes',
        [symbolKey]: (p: Record<any, unknown>) => p.c ?? { d: 'here' },
      })
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"yes","foo":1,"symbol(0)":{"d":"here"}}'
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
