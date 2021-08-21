/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { StrictMode } from 'react';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUnsuccessfulChangingInterface: TestCase = [
  'changing interface is not changing sometimes causing error',

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

    const testComponentID = 'test_component';
    let TestComponent = createListenerComponent({ useInterstate });
    const triggersCounter = createTriggersCounter();
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

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            keys: [77, symbolKey],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":200,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 300));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":300,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { [symbolKey]: { b: false } },
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":300,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 400));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":400,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: () => ({ 77: 'lo', [symbolKey]: { c: null } }),
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":400,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 500));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":500,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 77,
            initParam: 'go',
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":500,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 600));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":600,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<StrictMode />);
    ({ setInterstate, useInterstate } = initInterstate<TestState>());
    TestComponent = createListenerComponent({ useInterstate });

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { foo: 33, 77: 'two', [symbolKey]: {} },
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"two","foo":33,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'moon'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"moon","foo":33,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { foo: 10000, [symbolKey]: { a: 'new' } },
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"moon","foo":33,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'sun'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"sun","foo":33,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            keys: [symbolKey],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"sun","foo":33,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'go'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"go","foo":33,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: () => ({ foo: 1, [symbolKey]: { c: null } }),
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"go","foo":33,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'boo'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"boo","foo":33,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: symbolKey,
            initParam: { e: 'ee' },
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"boo","foo":33,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'dog'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"dog","foo":33,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<StrictMode />);
    ({ setInterstate, useInterstate } = initInterstate<TestState>());
    TestComponent = createListenerComponent({ useInterstate });

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: () => ({ foo: 999, 77: 'cat', [symbolKey]: { d: 33 } }),
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"cat","foo":999,"symbol(0)":{"d":33}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(symbolKey, { l: 1 }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"cat","foo":999,"symbol(0)":{"l":1}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: () => ({ foo: 999, 77: 'cat' }),
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"cat","foo":999,"symbol(0)":{"l":1}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(symbolKey, { t: 't' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"cat","foo":999,"symbol(0)":{"t":"t"}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            keys: [77],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"cat","foo":999,"symbol(0)":{"t":"t"}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(symbolKey, { g: false }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"cat","foo":999,"symbol(0)":{"g":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { foo: 10000, 77: 'zz' },
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"cat","foo":999,"symbol(0)":{"g":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(symbolKey, { r: 500 }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"cat","foo":999,"symbol(0)":{"r":500}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 'foo',
            initParam: 811,
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"cat","foo":999,"symbol(0)":{"r":500}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(symbolKey, { u: 'jump' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"cat","foo":999,"symbol(0)":{"u":"jump"}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<StrictMode />);
    ({ setInterstate, useInterstate } = initInterstate<TestState>());
    TestComponent = createListenerComponent({ useInterstate });

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 77,
            initParam: 'rrr',
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('rrr');
    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'top'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('top');
    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 'foo',
            initParam: 14,
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('14');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'run'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('14');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(0);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      rerender(
        <StrictMode>
          <TestComponent
            {...{
              testId: testComponentID,
              keys: ['foo'],
              effectFn: () => effectCounter++,
            }}
          />
        </StrictMode>
      )
    ).toThrow();
    // eslint-disable-next-line no-console
    (console.error as any).mockRestore();

    rerender(<StrictMode />);
    ({ setInterstate, useInterstate } = initInterstate<TestState>());
    TestComponent = createListenerComponent({ useInterstate });

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);

    rerender(
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
      '{"77":"undefined","foo":"undefined","symbol(0)":"undefined"}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      rerender(
        <StrictMode>
          <TestComponent
            {...{
              testId: testComponentID,
              selector: ({ foo, 77: ss, [symbolKey]: sy }: TestState) => [foo, ss, sy],
              effectFn: () => effectCounter++,
            }}
          />
        </StrictMode>
      )
    ).toThrow();
    // eslint-disable-next-line no-console
    (console.error as any).mockRestore();

    rerender(<StrictMode />);

    ({ setInterstate, useInterstate } = initInterstate<TestState>({
      foo: 1,
      77: 'x',
      [symbolKey]: { a: null },
    }));

    TestComponent = createListenerComponent({ useInterstate });

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);

    rerender(
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
      '{"77":"x","foo":1,"symbol(0)":{"a":null}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      rerender(
        <StrictMode>
          <TestComponent
            {...{
              testId: testComponentID,
              selector: ({ foo, 77: ss }: TestState) => [foo, ss],
              effectFn: () => effectCounter++,
            }}
          />
        </StrictMode>
      )
    ).toThrow();
    // eslint-disable-next-line no-console
    (console.error as any).mockRestore();

    rerender(<></>);

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
  },
];
