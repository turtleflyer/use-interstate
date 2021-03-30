/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, render } from '@testing-library/react';
import type { FC } from 'react';
import React, { StrictMode } from 'react';
import { createListenerComponent } from '../assets/createComponents';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseInterstateAcceptSelector: TestCase = [
  'useInterstate.acceptSelector works',

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

    const triggersCounter = createTriggersCounter();
    const testComponentID = 'test_component';
    const TestComponent = createListenerComponent({ useInterstate });
    let effectCounter = 0;

    initInterstate({ foo: 100, 77: 'hi', [symbolKey]: { a: true } });

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ foo, 77: ss, [symbolKey]: sy }) => ({ foo, 77: ss, [symbolKey]: sy }),
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

    const TestComponentWithSelector: FC = () => (
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ foo, 77: ss }) => `${foo}-${ss}`,
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    rerender(<StrictMode />);
    initInterstate({ foo: 1000 });

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, '77']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(<TestComponentWithSelector />);

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1000-undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, '77']).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<TestComponentWithSelector />);

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1000-undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 1));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1-undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<TestComponentWithSelector />);

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1-undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('77', 'run'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1-undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, '77']).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(0);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => rerender(<TestComponentWithSelector />)).toThrow(
      'Rendered more hooks than during the previous render'
    );
    // eslint-disable-next-line no-console
    (console.error as any).mockRestore();

    rerender(<></>);

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, '77']).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
  },
];
