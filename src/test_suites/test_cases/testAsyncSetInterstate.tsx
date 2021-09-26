/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testAsyncSetInterstate: TestCase = [
  'setInterstate works in async calls',

  async ({
    useInterstateImport: { initInterstate },

    createComponentsImport: {
      createListenerComponent,
      reactImport: { StrictMode },
    },

    testingLibraryReact: { render, waitFor },
  }: TestParameters): Promise<void> => {
    type TestState = {
      foo: number;
    };

    const { useInterstate, setInterstate } = initInterstate<TestState>();

    const testComponentID = 'test_component';
    const TestComponent = createListenerComponent({ useInterstate });
    let effectCounter = 0;

    expect('foo').triggersNumberToBeGreaterThanOrEqual(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent
          {...{ testId: testComponentID, stateKey: 'foo', effectFn: () => effectCounter++ }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('undefined');
    expect('foo').triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    Promise.resolve().then(() => {
      setInterstate('foo', 100);
    });

    await waitFor(() => expect(getByTestId(testComponentID).firstChild!.textContent).toBe('100'));
    expect('foo').triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    Promise.resolve().then(() => {
      setInterstate('foo', -1);
    });

    await waitFor(() => expect(getByTestId(testComponentID).firstChild!.textContent).toBe('-1'));
    expect('foo').triggersNumberToBe(1);
    expect(effectCounter).numberToBeConsideringFlag(1);
    effectCounter = 0;

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
  },
];
