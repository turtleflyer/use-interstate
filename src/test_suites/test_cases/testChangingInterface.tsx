/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TestCounter } from '../assets/expectCounterToIncreaseBy';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testChangingInterface: TestCase = [
  'changing interface works',

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

    const { useInterstate, setInterstate } = initInterstate<TestState>({
      foo: 100,
      77: 'hi',
      [symbolKey]: { a: true },
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
            stateKey: 'foo',
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('100');
    expect('foo').triggersNumberToBeInRange([1, 2]);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([1, 2]);

    act(() => setInterstate('foo', 200));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('200');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            keys: [77, symbolKey],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","symbol(0)":{"a":true}}'
    );
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaObj: { [symbolKey]: {} },
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"symbol(0)":{"a":true}}');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaFn: () => ({ 77: '' }),
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"77":"hi"}');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([1, 2]);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaObj: { foo: 0, 77: '' },
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"77":"hi","foo":200}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaFn: () => ({ [symbolKey]: {} }),
            deps: [],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"symbol(0)":{"a":true}}');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaObj: { foo: 0, 77: '' },
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"77":"hi","foo":200}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ foo }: TestState) => foo,
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('200');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([1, 2]);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaObj: { [symbolKey]: {} },
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"symbol(0)":{"a":true}}');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ 77: ss }: TestState) => ss,
            deps: [],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('hi');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: ({ [symbolKey]: sk }: TestState) => sk,
            deps: [],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('hi');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
  },
];
