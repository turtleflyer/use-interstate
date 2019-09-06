/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env jest */
import React, { useRef, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { render } from '@testing-library/react';

describe('Test useSmartRef functionality', () => {
  let useSmartRef;
  let Counter;

  beforeEach(() => {
    jest.isolateModules(() => {
      ({ default: useSmartRef } = require('../useSmartRef'));
      ({ Counter } = require('./prerequisite'));
    });
  });

  test('cleaning after element unmount works', () => {
    const mainCounter = new Counter();
    const actionCounter = new Counter();
    let storeActionFake;
    const actionHandler = (fake) => {
      actionCounter.count();
      storeActionFake = fake;
    };
    const cleanerCounter = new Counter();
    let storeCleanerFake;
    const cleanerHandler = (fake) => {
      cleanerCounter.count();
      storeCleanerFake = fake;
    };

    const TestComponent = ({ scenario, fake }) => {
      mainCounter.count();

      const ref = useSmartRef(() => {
        actionHandler(fake);
        return () => {
          cleanerHandler(fake);
        };
      });

      return <div>{scenario === 1 && <div ref={ref}>test</div>}</div>;
    };

    TestComponent.propTypes = {
      scenario: PropTypes.oneOf([1, 2]).isRequired,
      // eslint-disable-next-line react/forbid-prop-types
      fake: PropTypes.any,
    };

    TestComponent.defaultProps = {
      fake: undefined,
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} fake="right" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(1);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(0);
    expect(storeCleanerFake).toBe(undefined);

    rerender(<TestComponent scenario={2} fake="left" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(2);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeActionFake).toBe('right');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeCleanerFake).toBe('right');

    rerender(<TestComponent scenario={1} fake="up" />);
    expect(mainCounter.toHaveBeenCalledTimes).toBe(3);
    expect(actionCounter.toHaveBeenCalledTimes).toBe(2);
    expect(storeActionFake).toBe('up');
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(1);
    expect(storeCleanerFake).toBe('right');

    unmount();
    expect(cleanerCounter.toHaveBeenCalledTimes).toBe(2);
    expect(storeCleanerFake).toBe('up');
  });

  test('dynamically changing ref works', () => {
    const recordRefs = {};
    const checkRecordRefs = rec => Object.entries(rec).reduce(
      (reflect, [key, element]) => ({ ...reflect, [key]: element.getAttribute('data-key') }),
      {},
    );

    const TestComponent = ({ scenario }) => {
      const refElement1 = useRef();
      const refElement2 = useRef();

      const usedRefElement = scenario === 1 ? refElement1 : refElement2;

      const ref = useSmartRef(() => {}, usedRefElement);

      useEffect(() => {
        Object.assign(recordRefs, { el1: refElement1.current, el2: refElement2.current });
      });

      return (
        <>
          <div data-key="1" ref={ref}>
            test
          </div>
          <div data-key="2" ref={scenario === 1 ? refElement2 : refElement1}>
            test
          </div>
        </>
      );
    };

    TestComponent.propTypes = {
      scenario: PropTypes.oneOf([1, 2]).isRequired,
    };

    const { rerender, unmount } = render(<TestComponent scenario={1} />);
    expect(checkRecordRefs(recordRefs)).toEqual({ el1: '1', el2: '2' });

    rerender(<TestComponent scenario={2} />);
    expect(checkRecordRefs(recordRefs)).toEqual({ el1: '2', el2: '1' });

    unmount();
  });
});
