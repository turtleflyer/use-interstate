/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { FC } from 'react';
import type { TestCounter } from '../assets/expectCounterToIncreaseBy';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseWithRef: TestCase = [
  'useInterstate works with ref',

  ({
    useInterstateImport: { initInterstate },

    createComponentsImport: {
      reactImport: { StrictMode, useEffect },
    },

    testingLibraryReact: { render },
  }: TestParameters): void => {
    type TestState = {
      foo: number;
      77: string;
    };

    const { useInterstate, setInterstate } = initInterstate<TestState>({
      foo: 0,
      77: 'yes',
    });

    const testComponentID = 'test_component';
    const effectCounter: TestCounter = { count: 0 };
    let retrieveFoo: number;
    let retrieve77: string;

    const TestComponent: FC = () => {
      const { foo, 77: ss } = useInterstate(['foo', 77]);
      retrieve77 = ss;

      useEffect(() => {
        retrieveFoo = foo;
      }, []);

      useEffect(() => {
        effectCounter.count++;
      });

      return (
        <div
          {...{
            'data-testid': testComponentID,
            ref: () => {
              setInterstate({ foo: 1, 77: 'no' });
            },
          }}
        >
          rendered
        </div>
      );
    };

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent />
      </StrictMode>
    );

    expect(retrieveFoo!).toBe(0);
    expect(retrieve77!).toBe('no');
    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('rendered');
    expect('foo').triggersNumberToBeInRange([1, 2]);
    expect(77).triggersNumberToBeInRange([1, 2]);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([2, 4]);
    expect(effectCounter).counterToIncreaseBy(2);

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
  },
];
