/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TestCounter } from '../assets/expectCounterToIncreaseBy';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testBatchingAlwaysWorksCorrect: TestCase = [
  'batching after setInterstate works as intended',

  ({
    useInterstateImport: { initInterstate },

    createComponentsImport: {
      createListenerComponent,
      reactImport: { StrictMode },
    },

    testingLibraryReact: { render, act },
  }: TestParameters): void => {
    type TestState = {
      foo: number;
      77: string;
    };

    const { useInterstate, setInterstate } = initInterstate<TestState>({
      foo: 100,
      77: 'aa',
    });

    const testComponentID = 'test_component';
    const TestComponent = createListenerComponent({ useInterstate });
    const effectCounter: TestCounter = { count: 0 };

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 77,
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('aa');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate({ foo: 200, 77: 'bb' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('bb');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 'foo',
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('200');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate({ foo: 300, 77: 'cc' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('300');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            keys: [77, 'foo'],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"77":"cc","foo":300}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate({ foo: 300, 77: 'dd' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"77":"dd","foo":300}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate({ foo: 400, 77: 'dd' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"77":"dd","foo":400}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
  },
];
