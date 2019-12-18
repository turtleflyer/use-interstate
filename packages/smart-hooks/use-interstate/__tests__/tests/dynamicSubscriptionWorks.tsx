import React, { useCallback, useState } from 'react';
import { TestDescription } from '../testsAssets';

const dynamicSubscriptionWorks: TestDescription = (
  p,
  createTestComponents,
  shouldTestPerformance,
) => [
  'dynamic subscription works',
  () => {
    const {
      assets: { render, getLastMap, fireEvent, executionCountersFactory },
    } = p;
    const { CanListen, CanUpdate, CanListenAndUpdate } = createTestComponents(p);

    const subscribeId1 = '1';
    const subscribeId2 = '2';
    const testId1 = 'first';
    const testId2 = 'second';
    const testId3 = 'third';
    const testId4 = 'forth';
    const testId5 = 'fifth';
    const countRender1 = executionCountersFactory();
    const countRender2 = executionCountersFactory();
    const countRender3 = executionCountersFactory();
    const countRender4 = executionCountersFactory();

    const Dynamic = () => {
      const [subscribeId, setSubscribeId] = useState('1');
      const [initialValue, setInitialValue] = useState();

      const scenario = useCallback(({ target: { value } }) => {
        switch (value) {
          case '1':
            setSubscribeId(subscribeId1);
            setInitialValue(undefined);
            break;

          case '2':
            setSubscribeId(subscribeId2);
            break;

          case '3':
            setSubscribeId(subscribeId1);
            setInitialValue('mars');
            break;

          case '4':
            setInitialValue('neptune');
            break;

          default:
            break;
        }
      }, []);

      return (
        <>
          <CanListenAndUpdate
            {...{
              testId: testId4,
              countRender: countRender4.count,
              subscribeId,
              initialValue,
            }}
          />
          <input value="" onChange={scenario} data-testid={testId5} />
        </>
      );
    };

    const TestComponent = () => (
      <>
        <CanListen
          {...{
            subscribeId: subscribeId1,
            testId: testId1,
            countRender: countRender1.count,
          }}
        >
          <CanUpdate
            {...{
              subscribeId: subscribeId1,
              testId: testId2,
              countRender: countRender2.count,
              initialValue: 'sun',
            }}
          />
          <CanUpdate
            {...{
              subscribeId: subscribeId2,
              testId: testId3,
              countRender: countRender3.count,
              initialValue: 'moon',
            }}
          />
        </CanListen>
        <Dynamic />
      </>
    );

    const { fireNode, getTextFromNode, getByTestId, unmount } = render(<TestComponent />);
    const map = getLastMap();
    expect(getTextFromNode(testId1)).toBe('sun');
    expect(getTextFromNode(testId4)).toBe('sun');
    fireNode(testId1, 'venus');
    expect(getTextFromNode(testId1)).toBe('venus');
    expect(getTextFromNode(testId4)).toBe('venus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(3);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(1);
    expect(countRender4.howManyTimesBeenCalled()).toBe(2);
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(2);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);
    }

    fireEvent.change(getByTestId(testId5), { target: { value: '2' } });
    expect(getTextFromNode(testId1)).toBe('venus');
    expect(getTextFromNode(testId4)).toBe('moon');
    fireNode(testId2, 'saturn');
    fireNode(testId3, 'jupiter');
    expect(getTextFromNode(testId1)).toBe('saturn');
    expect(getTextFromNode(testId4)).toBe('jupiter');
    expect(countRender1.howManyTimesBeenCalled()).toBe(4);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(1);
    expect(countRender4.howManyTimesBeenCalled()).toBe(4);
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(1);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(1);
    }

    fireEvent.change(getByTestId(testId5), { target: { value: '3' } });
    expect(getTextFromNode(testId1)).toBe('mars');
    expect(getTextFromNode(testId4)).toBe('mars');
    fireNode(testId2, 'uranus');
    fireNode(testId3, 'mercury');
    expect(getTextFromNode(testId1)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('uranus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(6);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(1);
    expect(countRender4.howManyTimesBeenCalled()).toBe(6);
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(2);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);
    }

    fireEvent.change(getByTestId(testId5), { target: { value: '1' } });
    expect(getTextFromNode(testId1)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('uranus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(6);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(1);
    expect(countRender4.howManyTimesBeenCalled()).toBe(7);
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(2);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);
    }

    fireEvent.change(getByTestId(testId5), { target: { value: '2' } });
    expect(getTextFromNode(testId4)).toBe('mercury');
    expect(countRender1.howManyTimesBeenCalled()).toBe(6);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(1);
    expect(countRender4.howManyTimesBeenCalled()).toBe(8);
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(1);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(1);
    }

    fireEvent.change(getByTestId(testId5), { target: { value: '4' } });
    expect(getTextFromNode(testId4)).toBe('mercury');
    expect(countRender1.howManyTimesBeenCalled()).toBe(6);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(1);
    expect(countRender4.howManyTimesBeenCalled()).toBe(9);
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(1);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(1);
    }

    fireEvent.change(getByTestId(testId5), { target: { value: '1' } });
    expect(getTextFromNode(testId1)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('uranus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(6);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(1);
    expect(countRender4.howManyTimesBeenCalled()).toBe(10);
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(2);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);
    }

    fireEvent.change(getByTestId(testId5), { target: { value: '3' } });
    expect(getTextFromNode(testId1)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('uranus');
    expect(countRender1.howManyTimesBeenCalled()).toBe(6);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(1);
    expect(countRender4.howManyTimesBeenCalled()).toBe(11);
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(2);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);
    }

    fireEvent.change(getByTestId(testId5), { target: { value: '2' } });
    expect(getTextFromNode(testId1)).toBe('uranus');
    expect(getTextFromNode(testId4)).toBe('mars');
    expect(countRender1.howManyTimesBeenCalled()).toBe(6);
    expect(countRender2.howManyTimesBeenCalled()).toBe(1);
    expect(countRender3.howManyTimesBeenCalled()).toBe(1);
    expect(countRender4.howManyTimesBeenCalled()).toBe(12);
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(1);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(1);
    }

    unmount();
    if (shouldTestPerformance) {
      expect((map.get(subscribeId1) as { setters: any[] }).setters.length).toBe(0);
      expect((map.get(subscribeId2) as { setters: any[] }).setters.length).toBe(0);
    }
  },
];

export default dynamicSubscriptionWorks;