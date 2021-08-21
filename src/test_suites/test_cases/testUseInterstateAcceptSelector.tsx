/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { FC } from 'react';
import React, { StrictMode } from 'react';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseInterstateAcceptSelector: TestCase = [
  'useInterstate.acceptSelector works',

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

    let { setInterstate, useInterstate } = initInterstate<TestState>({
      foo: 100,
      77: 'hi',
      [symbolKey]: { a: true },
    });

    const triggersCounter = createTriggersCounter();
    const testComponentID = 'test_component';
    let TestComponent = createListenerComponent({ useInterstate });
    let effectCounter = 0;

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ foo, 77: ss, [symbolKey]: sy }: TestState) => ({
              foo,
              77: ss,
              [symbolKey]: sy,
            }),
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":100,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 200));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":200,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 200));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":200,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate(77, 'lo'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":200,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(symbolKey, { b: false }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":200,"symbol(0)":{"b":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() =>
      setInterstate(({ foo: prevFooV }) => ({
        foo: prevFooV + 10,
        77: 'no',
        [symbolKey]: { c: null },
      }))
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no","foo":210,"symbol(0)":{"c":null}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ 77: 'no' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no","foo":210,"symbol(0)":{"c":null}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate({ foo: 15, 77: 'no', [symbolKey]: { 1: true } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no","foo":15,"symbol(0)":{"1":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<StrictMode />);
    ({ setInterstate, useInterstate } = initInterstate<TestState>({ foo: 1000 }));
    TestComponent = createListenerComponent({ useInterstate });

    const TestComponentWithSelector: FC = () => (
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ foo, 77: ss }: TestState) => `${foo}-${ss}`,
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(<TestComponentWithSelector />);

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1000-undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<TestComponentWithSelector />);

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1000-undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 1));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1-undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<TestComponentWithSelector />);

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1-undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'run'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1-undefined');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
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
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
  },
];
