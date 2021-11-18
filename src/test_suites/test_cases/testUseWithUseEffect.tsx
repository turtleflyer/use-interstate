/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { FC } from 'react';
import type { TestCounter } from '../assets/expectCounterToIncreaseBy';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseWithUseEffect: TestCase = [
  'useInterstate works with useEffect',

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

    const testComponentID1 = 'test_component-1';
    const testComponentID2 = 'test_component-2';
    const effectCounter1: TestCounter = { count: 0 };
    const effectCounter2: TestCounter = { count: 0 };
    let retrieveFoo1: number;
    let retrieveFoo2: number;
    let retrieve77: string;

    const InnerComponent: FC = () => {
      useEffect(() => {
        setInterstate('foo', 1);
        effectCounter1.count++;
      });

      return (
        <div
          {...{
            'data-testid': testComponentID1,
          }}
        >
          InnerComponent
        </div>
      );
    };

    const TestComponent: FC = () => {
      const { foo, 77: ss } = useInterstate(['foo', 77]);
      retrieveFoo1 = foo;
      retrieve77 = ss;

      useEffect(() => {
        setInterstate(77, 'no');
        effectCounter2.count++;
      });

      useEffect(() => {
        retrieveFoo2 = foo;
      }, []);

      return (
        <>
          <div
            {...{
              'data-testid': testComponentID2,
            }}
          >
            TestComponent
          </div>
          <InnerComponent />
        </>
      );
    };

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);

    const { getByTestId, rerender } = render(
      <StrictMode>
        <TestComponent />
      </StrictMode>
    );

    expect(retrieveFoo1!).toBe(1);
    expect(retrieveFoo2!).toBe(0);
    expect(retrieve77!).toBe('no');
    expect(getByTestId(testComponentID1).firstChild!.textContent).toBe('InnerComponent');
    expect(getByTestId(testComponentID2).firstChild!.textContent).toBe('TestComponent');
    expect('foo').triggersNumberToBeInRange([1, 2]);
    expect(77).triggersNumberToBeInRange([1, 2]);
    expect(null).numberOfTimesStateWasSubscribedToBeInRange([2, 4]);
    expect(effectCounter1).counterToIncreaseBy(2);
    expect(effectCounter2).counterToIncreaseBy(2);

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
  },
];
