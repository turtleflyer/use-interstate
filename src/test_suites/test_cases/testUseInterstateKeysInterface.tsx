/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TestCounter } from '../assets/expectCounterToIncreaseBy';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseInterstateKeysInterface: TestCase = [
  'useInterstate array of keys interface works',

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

    const { setInterstate, useInterstate } = initInterstate<TestState>();

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
      '{"77":"undefined","foo":"undefined","symbol(0)":"undefined"}'
    );
    expect('foo').triggersNumberToBeGreaterThanOrEqual(1);
    expect(77).triggersNumberToBeGreaterThanOrEqual(1);
    expect(symbolKey).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([1, 2]);

    act(() => setInterstate('foo', 100));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"undefined","foo":100,"symbol(0)":"undefined"}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    act(() => setInterstate('foo', 100));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"undefined","foo":100,"symbol(0)":"undefined"}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(0);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    act(() => setInterstate(77, 'hi'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":100,"symbol(0)":"undefined"}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    act(() => setInterstate(symbolKey, { a: true }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":100,"symbol(0)":{"a":true}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    act(() =>
      setInterstate(({ foo: prevFooV }) => ({
        foo: prevFooV * 3,
        77: 'lo',
        [symbolKey]: { b: false },
      }))
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":300,"symbol(0)":{"b":false}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    act(() => setInterstate({ 77: 'lo' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":300,"symbol(0)":{"b":false}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(0);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    act(() => setInterstate({ foo: 15, 77: 'lo', [symbolKey]: { 1: null } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":15,"symbol(0)":{"1":null}}'
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
            keys: ['foo', 77, symbolKey],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":15,"symbol(0)":{"1":null}}'
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
            keys: [77, symbolKey, 'foo'],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":15,"symbol(0)":{"1":null}}'
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
            keys: ['foo'],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":15}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(1);

    act(() => setInterstate({ foo: 111, 77: 'go' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":111}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    act(() => setInterstate({ 77: 'nope' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":111}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(0);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    act(() => setInterstate({ foo: -1 }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":-1}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);
    expect(null).numberOfTimesStateWasSubscribedToBe(0);

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
  },
];
