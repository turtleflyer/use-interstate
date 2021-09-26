/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseInterstateAcceptSelector: TestCase = [
  'useInterstate.acceptSelector works',

  ({
    useInterstateImport: { initInterstate },

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

    const { useInterstate, setInterstate, resetInterstate } = initInterstate<TestState>({
      foo: 100,
      77: 'hi',
      [symbolKey]: { a: true },
    });

    const testComponentID = 'test_component';
    const TestComponent = createListenerComponent({ useInterstate });
    let effectCounter = 0;

    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);
    expect(symbolKey).triggersNumberToBeGreaterThanOrEqual(0);

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
    expect('foo').triggersNumberToBeGreaterThanOrEqual(1);
    expect(77).triggersNumberToBeGreaterThanOrEqual(1);
    expect(symbolKey).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 200));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":200,"symbol(0)":{"a":true}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 200));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":200,"symbol(0)":{"a":true}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate(77, 'lo'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":200,"symbol(0)":{"a":true}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(symbolKey, { b: false }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":200,"symbol(0)":{"b":false}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
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
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ 77: 'no' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no","foo":210,"symbol(0)":{"c":null}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate({ foo: 15, 77: 'no', [symbolKey]: { 1: true } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no","foo":15,"symbol(0)":{"1":true}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<StrictMode />);
    resetInterstate({ foo: 1000 });
    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);
    expect(symbolKey).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(
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

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1000-undefined');
    expect('foo').triggersNumberToBeGreaterThanOrEqual(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', 1));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1-undefined');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
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

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1-undefined');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'run'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1-undefined');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(0);

    rerender(
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

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1-run');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate('foo', -1));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('-1-run');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate(77, 'aa'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('-1-aa');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ foo }: TestState) => foo,
            deps: [],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('-1');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ foo: 111, 77: 'go' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('111');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ 77: 'nope' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('111');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate({ foo: 1000 }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1000');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ 77: ss }: TestState) => ss,
            deps: [],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1000');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ 77: 'run' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('1000');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(0);

    act(() => setInterstate({ foo: 200, 77: 'go' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('200');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ foo, 77: ss }: TestState) => `${foo}-${ss}`,
            deps: [1],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('200-go');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ foo }: TestState) => foo,
            deps: [1, 2],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('200');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ 77: ss }: TestState) => ss,
            deps: [1, 2],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('200');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    act(() => setInterstate({ [symbolKey]: { a: 'aa' } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('200');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).numberToBeConsideringFlag(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ [symbolKey]: sk }: TestState) => sk,
            deps: [1, 3],
            effectFn: () => effectCounter++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"a":"aa"}');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
  },
];
