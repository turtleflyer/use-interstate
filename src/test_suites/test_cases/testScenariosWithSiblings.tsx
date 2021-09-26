/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testScenariosWithSiblings: TestCase = [
  'scenarios with sibling components working correct',

  ({
    useInterstateImport: { initInterstate },

    createComponentsImport: {
      createListenerComponent,
      reactImport: { StrictMode },
    },

    testingLibraryReact: { act, render },
  }: TestParameters): void => {
    type TestState = {
      foo: number;
      77: string;
    };

    const { useInterstate, setInterstate, resetInterstate } = initInterstate<TestState>();

    const testComponentID0 = 'test_component-0';
    const testComponentID1 = 'test_component-1';
    const testComponentID2 = 'test_component-2';
    const TestComponent = createListenerComponent({ useInterstate });
    let effectCounter0 = 0;
    let effectCounter1 = 0;
    let effectCounter2 = 0;

    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            effectFn: () => effectCounter0++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            effectFn: () => effectCounter1++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('undefined');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('undefined');
    expect('foo').triggersNumberToBeGreaterThanOrEqual(2);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);
    expect(effectCounter0).numberToBeConsideringFlag(1);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    act(() => setInterstate('foo', 200));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('200');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('200');
    expect('foo').triggersNumberToBe(2);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).numberToBeConsideringFlag(1);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    rerender(<StrictMode />);
    resetInterstate();

    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            initParam: 111,
            effectFn: () => effectCounter0++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            effectFn: () => effectCounter1++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('111');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('111');
    expect('foo').triggersNumberToBeGreaterThanOrEqual(2);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);
    expect(effectCounter0).numberToBeConsideringFlag(1);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    act(() => setInterstate('foo', 18));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('18');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('18');
    expect('foo').triggersNumberToBe(2);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).numberToBeConsideringFlag(1);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    rerender(<StrictMode />);
    resetInterstate();

    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            effectFn: () => effectCounter0++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            initParam: 6,
            effectFn: () => effectCounter1++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('6');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('6');
    expect('foo').triggersNumberToBeGreaterThanOrEqual(2);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);
    expect(effectCounter0).numberToBeConsideringFlag(2);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    act(() => setInterstate('foo', 1000));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('1000');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('1000');
    expect('foo').triggersNumberToBe(2);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).numberToBeConsideringFlag(1);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    rerender(<StrictMode />);
    resetInterstate();

    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            initParam: 22,
            effectFn: () => effectCounter0++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            initParam: 33,
            effectFn: () => effectCounter1++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('22');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('22');
    expect('foo').triggersNumberToBeGreaterThanOrEqual(2);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);
    expect(effectCounter0).numberToBeConsideringFlag(1);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    act(() => setInterstate('foo', 555));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('555');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('555');
    expect('foo').triggersNumberToBe(2);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).numberToBeConsideringFlag(1);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    rerender(<StrictMode />);
    resetInterstate();

    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            effectFn: () => effectCounter0++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            initParam: 800,
            effectFn: () => effectCounter1++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID2,
            stateKey: 'foo',
            effectFn: () => effectCounter2++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('800');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('800');
    expect(getByTestId(testComponentID2).firstChild!.textContent).toBe('800');
    expect('foo').triggersNumberToBeGreaterThanOrEqual(3);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);
    expect(effectCounter0).numberToBeConsideringFlag(2);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;
    expect(effectCounter2).numberToBeConsideringFlag(1);
    effectCounter2 = 0;

    act(() => setInterstate('foo', 5));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('5');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('5');
    expect(getByTestId(testComponentID2).firstChild!.textContent).toBe('5');
    expect('foo').triggersNumberToBe(3);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).numberToBeConsideringFlag(1);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;
    expect(effectCounter2).numberToBeConsideringFlag(1);
    effectCounter2 = 0;

    rerender(<StrictMode />);
    resetInterstate({ 77: 'hi' });

    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            initParam: 99,
            effectFn: () => effectCounter0++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            selector: ({ foo, 77: ss }: TestState) => `${foo}-${ss}`,
            effectFn: () => effectCounter1++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('99');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('99-hi');
    expect('foo').triggersNumberToBeGreaterThanOrEqual(2);
    expect(77).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter0).numberToBeConsideringFlag(1);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    act(() => setInterstate('foo', 777));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('777');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('777-hi');
    expect('foo').triggersNumberToBe(2);
    expect(77).triggersNumberToBe(1);
    expect(effectCounter0).numberToBeConsideringFlag(1);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    rerender(<StrictMode />);
    resetInterstate({ 77: 'lo' });

    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            selector: ({ foo, 77: ss }: TestState) => `${foo}-${ss}`,
            effectFn: () => effectCounter0++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            initParam: 15,
            effectFn: () => effectCounter1++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('undefined-lo');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('15');
    expect('foo').triggersNumberToBeGreaterThanOrEqual(1);
    expect(77).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter0).numberToBeConsideringFlag(1);
    effectCounter0 = 0;
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    act(() => setInterstate('foo', 13));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('undefined-lo');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('13');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(effectCounter0).numberToBeConsideringFlag(0);
    expect(effectCounter1).numberToBeConsideringFlag(1);
    effectCounter1 = 0;

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
  },
];
