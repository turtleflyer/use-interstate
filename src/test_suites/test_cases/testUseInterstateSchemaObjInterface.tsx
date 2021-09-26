/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TestCounter } from '../assets/expectCounterToIncreaseBy';
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testUseInterstateSchemaObjInterface: TestCase = [
  'useInterstate schema object interface works',

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
          {...{
            testId: testComponentID,
            initSchema: { foo: 0, 77: 'start', [symbolKey]: {} },
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"start","foo":0,"symbol(0)":{}}'
    );
    expect('foo').triggersNumberToBeGreaterThanOrEqual(1);
    expect(77).triggersNumberToBeGreaterThanOrEqual(1);
    expect(symbolKey).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate('foo', 100));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"start","foo":100,"symbol(0)":{}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate('foo', 100));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"start","foo":100,"symbol(0)":{}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(0);

    act(() => setInterstate(77, 'hi'));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":100,"symbol(0)":{}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate(symbolKey, { a: true }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"hi","foo":100,"symbol(0)":{"a":true}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate({ foo: 200, 77: 'lo', [symbolKey]: { b: false } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":200,"symbol(0)":{"b":false}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate({ 77: 'lo' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":200,"symbol(0)":{"b":false}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(0);

    act(() => setInterstate({ foo: 15, 77: 'lo', [symbolKey]: { 1: null } }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"lo","foo":15,"symbol(0)":{"1":null}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

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
            initSchema: {
              foo: 1000,
              77: 'no',
              [symbolKey]: { c: null },
            },
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"no","foo":1000,"symbol(0)":{"c":null}}'
    );
    expect('foo').triggersNumberToBeGreaterThanOrEqual(1);
    expect(77).triggersNumberToBeGreaterThanOrEqual(1);
    expect(symbolKey).triggersNumberToBeGreaterThanOrEqual(1);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() =>
      setInterstate(({ [symbolKey]: prevSymbV }) => ({
        foo: 1,
        77: 'yes',
        [symbolKey]:
          'c' in prevSymbV &&
          typeof (prevSymbV as { c: unknown }).c === 'object' &&
          (prevSymbV as { c: object }).c
            ? (prevSymbV as { c: object }).c
            : { d: 'here' },
      }))
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe(
      '{"77":"yes","foo":1,"symbol(0)":{"d":"here"}}'
    );
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { foo: 0 },
            deps: [],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":1}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate({ foo: 111, 77: 'go' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":111}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate({ 77: 'nope' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":111}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(0);

    act(() => setInterstate({ foo: -1 }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":-1}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { 77: '' },
            deps: [],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":-1}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);

    act(() => setInterstate({ 77: 'run' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":-1}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(0);

    act(() => setInterstate({ foo: 200, 77: 'go' }));

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":200}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { foo: 0, 77: '' },
            deps: [1],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"77":"go","foo":200}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(1);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { foo: 0 },
            deps: [1, 2],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":200}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { 77: '' },
            deps: [1, 2],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"foo":200}');
    expect('foo').triggersNumberToBe(1);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchema: { [symbolKey]: {} },
            deps: [1, 3],
            effectFn: () => effectCounter.count++,
          }}
        />
      </StrictMode>
    );

    expect(getByTestId(testComponentID).firstChild!.textContent).toBe('{"symbol(0)":{"d":"here"}}');
    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(1);
    expect(effectCounter).counterToIncreaseBy(1);

    rerender(<></>);

    expect('foo').triggersNumberToBe(0);
    expect(77).triggersNumberToBe(0);
    expect(symbolKey).triggersNumberToBe(0);
  },
];
