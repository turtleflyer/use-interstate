/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { act, render } from '@testing-library/react';
import React, { StrictMode } from 'react';
import { createTriggersCounter } from '../../__mocks__/createState';
import { createListenerComponent } from '../assets/createComponents';
import type { TestCase, UseInterstateImport } from '../assets/TestTypes';

export const testSetInterstateCheckedByUseInterstate: TestCase = [
  'setInterstate works (checking by useInterstate)',

  ({
    useInterstateImport: { goInterstate },
  }: {
    useInterstateImport: UseInterstateImport;
  }): void => {
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

    const { getByTestId } = render(
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
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', (p: number) => p + 1));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"undefined","foo":101,"symbol(0)":"undefined"}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ foo: 200, 77: 'hi', [symbolKey]: { a: true } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":200,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() =>
      setInterstate({
        foo: (p: number) => p + 99,
        77: () => 'lo',
        [symbolKey]: (p: { a: boolean }) => ({ a: !p.a, b: p.a }),
      })
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":299,"symbol(0)":{"a":false,"b":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ foo: 2, 77: 'no' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no","foo":2,"symbol(0)":{"a":false,"b":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() =>
      setInterstate((state: { foo: number; 77: string }) => ({
        foo: state.foo + 8,
        77: state[77] + ' or yes / ' + state.foo,
        [symbolKey]: { all: false },
      }))
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no or yes / 2","foo":10,"symbol(0)":{"all":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 10));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no or yes / 2","foo":10,"symbol(0)":{"all":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate({ foo: 10, [symbolKey]: { all: false } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no or yes / 2","foo":10,"symbol(0)":{"all":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ foo: 10, 77: 'no or yes / 2' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no or yes / 2","foo":10,"symbol(0)":{"all":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate({ foo: (n) => n + 0, [symbolKey]: (p: object) => p }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no or yes / 2","foo":10,"symbol(0)":{"all":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate((state) => ({ ...state })));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no or yes / 2","foo":10,"symbol(0)":{"all":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(0);
  },
];
