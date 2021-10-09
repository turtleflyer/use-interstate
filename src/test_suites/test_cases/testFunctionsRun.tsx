/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { TestCase, TestParameters } from '../assets/TestTypes';

export const testFunctionsRun: TestCase = [
  'functions as arguments run only when it necessary',

  ({
    useInterstateImport: { initInterstate },

    createComponentsImport: {
      createListenerComponent,
      reactImport: { StrictMode },
    },

    testingLibraryReact: { render },
  }: TestParameters): void => {
    const symbolKey = Symbol('symbol_key');

    type TestState = {
      foo: unknown;
      77: unknown;
      [symbolKey]: unknown;
    };

    const { useInterstate } = initInterstate<TestState>();

    const testComponentID = 'test_component';
    const TestComponent = createListenerComponent({ useInterstate });
    const fnToCall0 = jest.fn();

    const { rerender } = render(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 'foo',
            initParam: () => {
              fnToCall0();
            },
          }}
        />
      </StrictMode>
    );

    expect(fnToCall0).not.toHaveBeenCalledTimes(0);

    const fnToCall1 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 'foo',
            initParam: () => {
              fnToCall1();
            },
          }}
        />
      </StrictMode>
    );

    expect(fnToCall1).toHaveBeenCalledTimes(0);

    const fnToCall2 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 77,
            initParam: () => {
              fnToCall2();

              return 100;
            },
          }}
        />
      </StrictMode>
    );

    expect(fnToCall2).not.toHaveBeenCalledTimes(0);

    rerender(<StrictMode />);

    const fnToCall3 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            stateKey: 77,
            initParam: () => {
              fnToCall3();
            },
          }}
        />
      </StrictMode>
    );

    expect(fnToCall3).toHaveBeenCalledTimes(0);

    const fnToCall4 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaFn: () => {
              fnToCall4();

              return { foo: null };
            },
          }}
        />
      </StrictMode>
    );

    expect(fnToCall4).not.toHaveBeenCalledTimes(0);

    const fnToCall5 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaFn: () => {
              fnToCall5();

              return { foo: null };
            },
          }}
        />
      </StrictMode>
    );

    expect(fnToCall5).not.toHaveBeenCalledTimes(0);

    const fnToCall6 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaFn: () => {
              fnToCall6();

              return { foo: null };
            },
            deps: [1],
          }}
        />
      </StrictMode>
    );

    expect(fnToCall6).not.toHaveBeenCalledTimes(0);

    const fnToCall7 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaFn: () => {
              fnToCall7();

              return { 77: null };
            },
            deps: [1],
          }}
        />
      </StrictMode>
    );

    expect(fnToCall7).toHaveBeenCalledTimes(0);

    const fnToCall8 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            initSchemaFn: () => {
              fnToCall8();

              return { 77: null };
            },
            deps: [2],
          }}
        />
      </StrictMode>
    );

    expect(fnToCall8).not.toHaveBeenCalledTimes(0);

    const fnToCall9 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: () => {
              fnToCall9();

              return null;
            },
          }}
        />
      </StrictMode>
    );

    expect(fnToCall9).not.toHaveBeenCalledTimes(0);

    const fnToCall10 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: () => {
              fnToCall10();

              return null;
            },
          }}
        />
      </StrictMode>
    );

    expect(fnToCall10).not.toHaveBeenCalledTimes(0);

    const fnToCall11 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: () => {
              fnToCall11();

              return null;
            },
            deps: [1],
          }}
        />
      </StrictMode>
    );

    expect(fnToCall11).not.toHaveBeenCalledTimes(0);

    const fnToCall12 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: () => {
              fnToCall12();

              return null;
            },
            deps: [1],
          }}
        />
      </StrictMode>
    );

    expect(fnToCall12).toHaveBeenCalledTimes(0);

    const fnToCall13 = jest.fn();

    rerender(
      <StrictMode>
        <TestComponent
          {...{
            testId: testComponentID,
            selector: () => {
              fnToCall13();

              return null;
            },
            deps: [2],
          }}
        />
      </StrictMode>
    );

    expect(fnToCall13).not.toHaveBeenCalledTimes(0);
  },
];
