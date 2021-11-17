/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TestCounter } from '../assets/expectCounterToIncreaseBy';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testAsyncSetInterstateOnlyOneUpdate: TestCase = [
  'async call of setInterstate results to only one update',

  async ({
    useInterstateImport: { initInterstate },

    createComponentsImport: {
      createListenerComponent,
      reactImport: { StrictMode },
    },

    testingLibraryReact: { render, waitFor },
  }: TestParameters): Promise<void> => {
    const symbolKey = Symbol('symbol_key');

    type TestState = {
      foo: number;
      77: string;
      [symbolKey]: object;
    };

    const { useInterstate, setInterstate } = initInterstate<TestState>({
      foo: 0,
      77: '',
      [symbolKey]: {},
    });

    const testComponentID = 'test_component';
    const TestComponent = createListenerComponent({ useInterstate });
    const effectCounter: TestCounter = { count: 0 };

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            keys: ['foo', 77, symbolKey],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"","foo":0,"symbol(0)":{}}'
    );

    expect('foo').triggersNumberToBeInRange([1, 2]);
    expect(77).triggersNumberToBeInRange([1, 2]);
    expect(symbolKey).triggersNumberToBeInRange([1, 2]);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([1, 2]);

    Promise.resolve().then(() => {
      setInterstate(({ foo, 77: ss, [symbolKey]: sk }) => ({
        foo: foo + 1,
        77: ss + 'a',
        [symbolKey]: { ...sk, a: 1 },
      }));
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"a","foo":1,"symbol(0)":{"a":1}}'
      )
    );

    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    Promise.resolve().then(() => {
      setInterstate({ foo: 0, 77: '', [symbolKey]: {} });
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"","foo":0,"symbol(0)":{}}'
      )
    );

    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaObj: { foo: 0, 77: '', [symbolKey]: {} },
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"","foo":0,"symbol(0)":{}}'
    );

    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);

    Promise.resolve().then(() => {
      setInterstate(({ foo, 77: ss, [symbolKey]: sk }) => ({
        foo: foo + 1,
        77: ss + 'a',
        [symbolKey]: { ...sk, a: 1 },
      }));
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"a","foo":1,"symbol(0)":{"a":1}}'
      )
    );

    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    Promise.resolve().then(() => {
      setInterstate({ foo: 0, 77: '', [symbolKey]: {} });
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"","foo":0,"symbol(0)":{}}'
      )
    );

    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaFn: () => ({ foo: 0, 77: '', [symbolKey]: {} }),
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"","foo":0,"symbol(0)":{}}'
    );

    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([1, 2]);

    Promise.resolve().then(() => {
      setInterstate(({ foo, 77: ss, [symbolKey]: sk }) => ({
        foo: foo + 1,
        77: ss + 'a',
        [symbolKey]: { ...sk, a: 1 },
      }));
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"a","foo":1,"symbol(0)":{"a":1}}'
      )
    );

    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([1, 2]);

    Promise.resolve().then(() => {
      setInterstate({ foo: 0, 77: '', [symbolKey]: {} });
    });

    await waitFor(() =>
      expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
        '{"77":"","foo":0,"symbol(0)":{}}'
      )
    );

    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([1, 2]);

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
  },
];
