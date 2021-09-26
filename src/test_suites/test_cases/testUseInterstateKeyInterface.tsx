/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TestCounter } from '../assets/expectCounterToIncreaseBy';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseInterstateKeyInterface: TestCase = [
  'useInterstate single key interface works',

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

    const { useInterstate, setInterstate, resetInterstate } = initInterstate<TestState>();

    const testComponentID = 'test_component';
    const TestComponent = createListenerComponent({ useInterstate });
    const effectCounter: TestCounter = { count: 0 };

    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);
    expect(symbolKey).triggersNumberToBeGreaterThanOrEqual(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{ testId: testComponentID, stateKey: 'foo', effectFn: () => effectCounter.count++ }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('undefined');
    expect('foo').triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate('foo', 0));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('0');
    expect('foo').triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate('foo', 0));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('0');
    expect('foo').triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(0);

    rerender(<StrictMode />);
    resetInterstate();

    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);
    expect(symbolKey).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 'foo',
            initParam: 100,
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('100');
    expect('foo').triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate('foo', (p: number) => p * 3));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('300');
    expect('foo').triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{ testId: testComponentID, stateKey: 77, effectFn: () => effectCounter.count++ }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('undefined');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate(77, 'hi'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('hi');
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate(77, 'lo'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('lo');
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: symbolKey,
            initParam: { a: true },
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"a":true}');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate(symbolKey, { b: false }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"b":false}');
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate('foo', 300));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"b":false}');
    expect(effectCounter).counterToIncreaseBy(0);

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
  },
];
