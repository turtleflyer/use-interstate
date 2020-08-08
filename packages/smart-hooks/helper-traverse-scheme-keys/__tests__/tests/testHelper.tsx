import { render } from '@testing-library/react';
import React from 'react';
import type { DeriveScheme, FulfillTraversingKeys } from '../../src/useTraverseKeys';
import type { TestDescription } from '../testsAssets';

const testHelper: TestDescription = (p) => [
  'test helper works right',
  () => {
    const {
      assets: { useTraverseKeys, wrapWithStrictModeComponent },
    } = p;

    type TraverseReturn<
      S extends object,
      StateSideT extends DeriveScheme<S> = DeriveScheme<S>,
      SettersSideT extends DeriveScheme<S> = DeriveScheme<S>
    > = [StateSideT, SettersSideT, (keyof S)[]];

    interface TestComponentsProps<
      S extends object,
      StateSideT extends DeriveScheme<S>,
      SettersSideT extends DeriveScheme<S>
    > {
      scheme: S;
      eachKeyProceed: (
        key: keyof S,
        p: S,
        fulfillStateSide: FulfillTraversingKeys<StateSideT, keyof S>,
        fulfillSettersSide: FulfillTraversingKeys<SettersSideT, keyof S>
      ) => void;
      memReturn: { current: TraverseReturn<S, StateSideT, SettersSideT> };
    }

    type TestComponentType = <
      S extends object,
      StateSideT extends DeriveScheme<S>,
      SettersSideT extends DeriveScheme<S>
    >(
      p: TestComponentsProps<S, StateSideT, SettersSideT>
    ) => ReturnType<React.FunctionComponent>;

    const TestComponent: TestComponentType = wrapWithStrictModeComponent(
      ({ scheme, eachKeyProceed, memReturn }) => {
        memReturn.current = useTraverseKeys(scheme, eachKeyProceed);

        return <></>;
      }
    );

    const symbolKey = Symbol();

    const scheme1 = { a: 1, 2: 'hi', [symbolKey]: false };
    const memReturn1 = {} as {
      current: TraverseReturn<typeof scheme1>;
    };

    const { rerender, unmount } = render(
      <TestComponent
        scheme={scheme1}
        eachKeyProceed={(key, sch, f1, f2) => {
          f1('a' + sch[key].toString());
          f2('b' + sch[key].toString());
        }}
        memReturn={memReturn1}
      />
    );

    expect(memReturn1.current[0]).toEqual({ a: 'a1', 2: 'ahi', [symbolKey]: 'afalse' });
    expect(memReturn1.current[1]).toEqual({ a: 'b1', 2: 'bhi', [symbolKey]: 'bfalse' });
    expect(
      (() => memReturn1.current[2].map((e) => ['a', '2', symbolKey].includes(e as any)))()
    ).toEqual([true, true, true]);

    const scheme2 = { b: false };
    const memReturn2 = {} as {
      current: TraverseReturn<typeof scheme1>;
    };

    rerender(
      <TestComponent
        scheme={(scheme2 as unknown) as typeof scheme1}
        eachKeyProceed={(key, sch, f1, f2) => {
          f1('c' + sch[key].toString());
          f2('d' + sch[key].toString());
        }}
        memReturn={memReturn2}
      />
    );

    expect(memReturn2.current[0]).toEqual({ a: 'c1', 2: 'chi', [symbolKey]: 'cfalse' });
    expect(memReturn2.current[1]).toEqual({ a: 'd1', 2: 'dhi', [symbolKey]: 'dfalse' });
    expect(
      (() => memReturn2.current[2].map((e) => ['a', '2', symbolKey].includes(e as any)))()
    ).toEqual([true, true, true]);
    expect(memReturn2.current[1]).toBe(memReturn1.current[1]);

    unmount();
  },
];

export default testHelper;