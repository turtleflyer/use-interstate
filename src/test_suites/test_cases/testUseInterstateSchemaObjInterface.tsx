/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseInterstateSchemaObjInterface: TestCase = [
  'useInterstate schema object interface works',

  ({
    useInterstateImport: { initInterstate },
    triggersCounterImport: { createTriggersCounter },

    createComponentsImport: {
      createListenerComponent,
      reactImport: { StrictMode },
    },

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
          {...{
            testId: testComponentID,
            initSchema: { foo: 0, 77: 'start', [symbolKey]: {} },
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"start","foo":0,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 100));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"start","foo":100,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 100));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"start","foo":100,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate(77, 'hi'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":100,"symbol(0)":{}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(symbolKey, { a: true }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":100,"symbol(0)":{"a":true}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ foo: 200, 77: 'lo', [symbolKey]: { b: false } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":200,"symbol(0)":{"b":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ 77: 'lo' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":200,"symbol(0)":{"b":false}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate({ foo: 15, 77: 'lo', [symbolKey]: { 1: null } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":15,"symbol(0)":{"1":null}}'
    );
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

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
            initSchema: {
              foo: 1000,
              77: 'no',
              [symbolKey]: { c: null },
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
    expect([triggersCounter, 77]).triggersNumberToBeGreaterThanOrEqual(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() =>
      setInterstate(({ [symbolKey]: prevSymbV }) => ({
        foo: 1,
        77: 'yes',
        [symbolKey]:
          'c' in prevSymbV &&
          typeof (prevSymbV as { c: unknown }).c === 'object' &&
          (prevSymbV as { c: object }).c
            ? (prevSymbV as { c: object }).c
            : { d: 'here' },
      }))
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"yes","foo":1,"symbol(0)":{"d":"here"}}'
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
            initSchema: { foo: 0 },
            deps: [],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":1}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ foo: 111, 77: 'go' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":111}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ 77: 'nope' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":111}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate({ foo: -1 }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":-1}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { 77: '' },
            deps: [],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":-1}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ 77: 'run' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":-1}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate({ foo: 200, 77: 'go' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":200}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { foo: 0, 77: '' },
            deps: [1],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"77":"go","foo":200}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(1);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { foo: 0 },
            deps: [1, 2],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":200}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { 77: '' },
            deps: [1, 2],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":200}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(1);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { [symbolKey]: {} },
            deps: [1, 3],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"symbol(0)":{"d":"here"}}');
    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<></>);

    expect([triggersCounter, 'foo']).triggersNumberToBe(0);
    expect([triggersCounter, 77]).triggersNumberToBe(0);
    expect([triggersCounter, symbolKey]).triggersNumberToBe(0);
  },
];
