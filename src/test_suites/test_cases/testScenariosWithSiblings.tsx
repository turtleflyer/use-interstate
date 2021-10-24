/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TestCounter } from '../assets/expectCounterToIncreaseBy';
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
    const effectCounter0: TestCounter = { count: 0 };
    const effectCounter1: TestCounter = { count: 0 };
    const effectCounter2: TestCounter = { count: 0 };

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            effectFn: () => effectCounter0.count++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            effectFn: () => effectCounter1.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('undefined');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('undefined');
    expect('foo').triggersNumberToBeInRange([2, 4]);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).counterToIncreaseBy(1);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([2, 4]);

    act(() => setInterstate('foo', 200));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('200');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('200');
    expect('foo').triggersNumberToBe(2);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).counterToIncreaseBy(1);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    rerender(<StrictMode />);
    resetInterstate();

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            initParam: 111,
            effectFn: () => effectCounter0.count++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            effectFn: () => effectCounter1.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('111');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('111');
    expect('foo').triggersNumberToBeInRange([2, 4]);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).counterToIncreaseBy(1);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([2, 4]);

    act(() => setInterstate('foo', 18));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('18');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('18');
    expect('foo').triggersNumberToBe(2);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).counterToIncreaseBy(1);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    rerender(<StrictMode />);
    resetInterstate();

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            effectFn: () => effectCounter0.count++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            initParam: 6,
            effectFn: () => effectCounter1.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('6');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('6');
    expect('foo').triggersNumberToBeInRange([2, 4]);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).counterToIncreaseBy(2);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([2, 4]);

    act(() => setInterstate('foo', 1000));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('1000');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('1000');
    expect('foo').triggersNumberToBe(2);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).counterToIncreaseBy(1);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    rerender(<StrictMode />);
    resetInterstate();

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            initParam: 22,
            effectFn: () => effectCounter0.count++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            initParam: 33,
            effectFn: () => effectCounter1.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('22');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('22');
    expect('foo').triggersNumberToBeInRange([2, 4]);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).counterToIncreaseBy(1);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([2, 4]);

    act(() => setInterstate('foo', 555));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('555');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('555');
    expect('foo').triggersNumberToBe(2);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).counterToIncreaseBy(1);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    rerender(<StrictMode />);
    resetInterstate();

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            effectFn: () => effectCounter0.count++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            initParam: 800,
            effectFn: () => effectCounter1.count++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID2,
            stateKey: 'foo',
            effectFn: () => effectCounter2.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('800');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('800');
    expect(getByTestId(testComponentID2).firstChild!.textContent).toBe('800');
    expect('foo').triggersNumberToBeInRange([3, 6]);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).counterToIncreaseBy(2);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(effectCounter2).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([3, 6]);

    act(() => setInterstate('foo', 5));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('5');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('5');
    expect(getByTestId(testComponentID2).firstChild!.textContent).toBe('5');
    expect('foo').triggersNumberToBe(3);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter0).counterToIncreaseBy(1);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(effectCounter2).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    rerender(<StrictMode />);
    resetInterstate({ 77: 'hi' });

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            stateKey: 'foo',
            initParam: 99,
            effectFn: () => effectCounter0.count++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            selector: ({ foo, 77: ss }: TestState) => `${foo}-${ss}`,
            effectFn: () => effectCounter1.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('99');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('99-hi');
    expect('foo').triggersNumberToBeInRange([2, 4]);
    expect(77).triggersNumberToBeInRange([1, 2]);
    expect(effectCounter0).counterToIncreaseBy(1);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([2, 4]);

    act(() => setInterstate('foo', 777));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('777');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('777-hi');
    expect('foo').triggersNumberToBe(2);
    expect(77).triggersNumberToBe(1);
    expect(effectCounter0).counterToIncreaseBy(1);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);

    rerender(<StrictMode />);
    resetInterstate({ 77: 'lo' });

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID0,
            selector: ({ foo, 77: ss }: TestState) => `${foo}-${ss}`,
            effectFn: () => effectCounter0.count++,
          }}
        />
        <TestComponent
          {...{
            testId: testComponentID1,
            stateKey: 'foo',
            initParam: 15,
            effectFn: () => effectCounter1.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('undefined-lo');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('15');
    expect('foo').triggersNumberToBeInRange([1, 2]);
    expect(77).triggersNumberToBeInRange([1, 2]);
    expect(effectCounter0).counterToIncreaseBy(1);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([2, 4]);

    act(() => setInterstate('foo', 13));

    expect(getByTestId(testComponentID0).firstChild!.textContent).toBe('undefined-lo');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('13');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(effectCounter0).counterToIncreaseBy(0);
    expect(effectCounter1).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
  },
];
