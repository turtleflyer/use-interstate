import React from 'react';
import { TestDescription } from '../testsAssets';
import { flagManager } from '../testFlags';

const testContext: TestDescription = (p) => [
  'Scope component works',
  () => {
    const {
      assets: {
        render,
        settersCounterFactory,
        Scope,
        executionCountersFactory,
        CanListen,
        CanListenAndUpdate,
      },
    } = p;

    const subscribeId1 = 1;
    const subscribeId2 = 2;
    const testId1 = 'first';
    const testId2 = 'second';
    const testId3 = 'third';
    const testId4 = 'forth';
    const testId5 = 'fifth';
    const testId6 = 'sixth';
    const countRender1 = executionCountersFactory();
    const countRender2 = executionCountersFactory();
    const countRender3 = executionCountersFactory();
    const countRender4 = executionCountersFactory();
    const countRender5 = executionCountersFactory();
    const countRender6 = executionCountersFactory();

    const IsolatedBlock: React.FunctionComponent<{
      initVS1?: string;
      initVS2?: string;
      listenerId: number;
    }> = ({ initVS1, initVS2, listenerId }) => (
      <>
        <CanListenAndUpdate
          {...{
            subscribeId: subscribeId1,
            testId: testId4,
            countRender: countRender4.count,
            initialValue: initVS1,
          }}
        />
        <CanListenAndUpdate
          {...{
            subscribeId: subscribeId2,
            testId: testId5,
            countRender: countRender5.count,
            initialValue: initVS2,
          }}
        />
        <CanListen
          {...{
            subscribeId: listenerId,
            testId: testId6,
            countRender: countRender6.count,
          }}
        />
      </>
    );

    const TestComponent: React.FunctionComponent<{
      isolate?: boolean;
      listenerId: number;
      initV1?: string;
      initV2?: string;
      initV3?: string;
      initV4?: string;
    }> = ({ isolate = false, listenerId, initV1, initV2, initV3, initV4 }) => (
      <>
        <CanListenAndUpdate
          {...{
            subscribeId: subscribeId1,
            testId: testId1,
            countRender: countRender1.count,
            initialValue: initV1,
          }}
        />
        <CanListenAndUpdate
          {...{
            subscribeId: subscribeId2,
            testId: testId2,
            countRender: countRender2.count,
            initialValue: initV2,
          }}
        />
        <CanListen
          {...{
            subscribeId: listenerId,
            testId: testId3,
            countRender: countRender3.count,
          }}
        />
        {isolate ? (
          <Scope>
            <IsolatedBlock {...{ initVS1: initV3, initVS2: initV4, listenerId }} />
          </Scope>
        ) : (
          <IsolatedBlock {...{ initVS1: initV3, initVS2: initV4, listenerId }} />
        )}
      </>
    );

    const { fireNode, getTextFromNode, rerender, unmount } = render(
      <TestComponent listenerId={subscribeId1} initV1="" initV2="" />
    );
    const countSetter1 = settersCounterFactory();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(countSetter1(subscribeId1)).toBe(4);
      expect(countSetter1(subscribeId2)).toBe(2);
    }
    fireNode(testId1, 'bus');
    expect(getTextFromNode(testId1)).toBe('bus');
    expect(getTextFromNode(testId2)).toBe('');
    expect(getTextFromNode(testId3)).toBe('bus');
    expect(getTextFromNode(testId4)).toBe('bus');
    expect(getTextFromNode(testId5)).toBe('');
    expect(getTextFromNode(testId6)).toBe('bus');
    fireNode(testId4, 'car');
    expect(getTextFromNode(testId1)).toBe('car');
    expect(getTextFromNode(testId2)).toBe('');
    expect(getTextFromNode(testId3)).toBe('car');
    expect(getTextFromNode(testId4)).toBe('car');
    expect(getTextFromNode(testId5)).toBe('');
    expect(getTextFromNode(testId6)).toBe('car');
    fireNode(testId2, 'boat');
    expect(getTextFromNode(testId1)).toBe('car');
    expect(getTextFromNode(testId2)).toBe('boat');
    expect(getTextFromNode(testId3)).toBe('car');
    expect(getTextFromNode(testId4)).toBe('car');
    expect(getTextFromNode(testId5)).toBe('boat');
    expect(getTextFromNode(testId6)).toBe('car');
    expect(countRender1.howManyTimesBeenCalled()).toBe(3);
    expect(countRender2.howManyTimesBeenCalled()).toBe(2);
    expect(countRender3.howManyTimesBeenCalled()).toBe(3);
    expect(countRender4.howManyTimesBeenCalled()).toBe(3);
    expect(countRender5.howManyTimesBeenCalled()).toBe(2);
    expect(countRender6.howManyTimesBeenCalled()).toBe(3);

    rerender(<TestComponent isolate={true} listenerId={subscribeId1} initV3="" initV4="" />);
    const countSetter2 = settersCounterFactory();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(countSetter1(subscribeId1)).toBe(2);
      expect(countSetter1(subscribeId2)).toBe(1);
      expect(countSetter2(subscribeId1)).toBe(2);
      expect(countSetter2(subscribeId2)).toBe(1);
    }
    fireNode(testId1, 'truck');
    expect(getTextFromNode(testId1)).toBe('truck');
    expect(getTextFromNode(testId2)).toBe('boat');
    expect(getTextFromNode(testId3)).toBe('truck');
    expect(getTextFromNode(testId4)).toBe('');
    expect(getTextFromNode(testId5)).toBe('');
    expect(getTextFromNode(testId6)).toBe('');
    fireNode(testId4, 'plane');
    expect(getTextFromNode(testId1)).toBe('truck');
    expect(getTextFromNode(testId2)).toBe('boat');
    expect(getTextFromNode(testId3)).toBe('truck');
    expect(getTextFromNode(testId4)).toBe('plane');
    expect(getTextFromNode(testId5)).toBe('');
    expect(getTextFromNode(testId6)).toBe('plane');
    expect(countRender1.howManyTimesBeenCalled()).toBe(5);
    expect(countRender2.howManyTimesBeenCalled()).toBe(3);
    expect(countRender3.howManyTimesBeenCalled()).toBe(5);
    expect(countRender4.howManyTimesBeenCalled()).toBe(5);
    expect(countRender5.howManyTimesBeenCalled()).toBe(3);
    expect(countRender6.howManyTimesBeenCalled()).toBe(5);

    rerender(<TestComponent listenerId={subscribeId2} />);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(countSetter1(subscribeId1)).toBe(2);
      expect(countSetter1(subscribeId2)).toBe(4);
      expect(countSetter2(subscribeId1)).toBe(0);
      expect(countSetter2(subscribeId2)).toBe(0);
    }
    expect(getTextFromNode(testId1)).toBe('truck');
    expect(getTextFromNode(testId2)).toBe('boat');
    expect(getTextFromNode(testId3)).toBe('boat');
    expect(getTextFromNode(testId4)).toBe('truck');
    expect(getTextFromNode(testId5)).toBe('boat');
    expect(getTextFromNode(testId6)).toBe('boat');
    expect(countRender1.howManyTimesBeenCalled()).toBe(6);
    expect(countRender2.howManyTimesBeenCalled()).toBe(4);
    expect(countRender3.howManyTimesBeenCalled()).toBe(6);
    expect(countRender4.howManyTimesBeenCalled()).toBe(6);
    expect(countRender5.howManyTimesBeenCalled()).toBe(4);
    expect(countRender6.howManyTimesBeenCalled()).toBe(6);

    rerender(<TestComponent isolate={true} listenerId={subscribeId1} initV3="" initV4="" />);
    const countSetter3 = settersCounterFactory();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(countSetter1(subscribeId1)).toBe(2);
      expect(countSetter1(subscribeId2)).toBe(1);
      expect(countSetter2(subscribeId1)).toBe(0);
      expect(countSetter2(subscribeId2)).toBe(0);
      expect(countSetter3(subscribeId1)).toBe(2);
      expect(countSetter3(subscribeId2)).toBe(1);
    }
    expect(getTextFromNode(testId1)).toBe('truck');
    expect(getTextFromNode(testId2)).toBe('boat');
    expect(getTextFromNode(testId3)).toBe('truck');
    expect(getTextFromNode(testId4)).toBe('');
    expect(getTextFromNode(testId5)).toBe('');
    expect(getTextFromNode(testId6)).toBe('');
    expect(countRender1.howManyTimesBeenCalled()).toBe(7);
    expect(countRender2.howManyTimesBeenCalled()).toBe(5);
    expect(countRender3.howManyTimesBeenCalled()).toBe(7);
    expect(countRender4.howManyTimesBeenCalled()).toBe(7);
    expect(countRender5.howManyTimesBeenCalled()).toBe(5);
    expect(countRender6.howManyTimesBeenCalled()).toBe(7);

    rerender(<TestComponent listenerId={subscribeId1} initV3="train" />);
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(countSetter1(subscribeId1)).toBe(4);
      expect(countSetter1(subscribeId2)).toBe(2);
      expect(countSetter2(subscribeId1)).toBe(0);
      expect(countSetter2(subscribeId2)).toBe(0);
      expect(countSetter3(subscribeId1)).toBe(0);
      expect(countSetter3(subscribeId2)).toBe(0);
    }
    expect(getTextFromNode(testId1)).toBe('train');
    expect(getTextFromNode(testId2)).toBe('boat');
    expect(getTextFromNode(testId3)).toBe('train');
    expect(getTextFromNode(testId4)).toBe('train');
    expect(getTextFromNode(testId5)).toBe('boat');
    expect(getTextFromNode(testId6)).toBe('train');
    expect(countRender1.howManyTimesBeenCalled()).toBe(9);
    expect(countRender2.howManyTimesBeenCalled()).toBe(6);
    expect(countRender3.howManyTimesBeenCalled()).toBe(9);
    expect(countRender4.howManyTimesBeenCalled()).toBe(8);
    expect(countRender5.howManyTimesBeenCalled()).toBe(6);
    expect(countRender6.howManyTimesBeenCalled()).toBe(8);

    rerender(<TestComponent isolate={true} listenerId={subscribeId2} initV3="bike" initV4="" />);
    const countSetter4 = settersCounterFactory();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(countSetter1(subscribeId1)).toBe(1);
      expect(countSetter1(subscribeId2)).toBe(2);
      expect(countSetter2(subscribeId1)).toBe(0);
      expect(countSetter2(subscribeId2)).toBe(0);
      expect(countSetter3(subscribeId1)).toBe(0);
      expect(countSetter3(subscribeId2)).toBe(0);
      expect(countSetter4(subscribeId1)).toBe(1);
      expect(countSetter4(subscribeId2)).toBe(2);
    }
    expect(getTextFromNode(testId1)).toBe('train');
    expect(getTextFromNode(testId2)).toBe('boat');
    expect(getTextFromNode(testId3)).toBe('boat');
    expect(getTextFromNode(testId4)).toBe('bike');
    expect(getTextFromNode(testId5)).toBe('');
    expect(getTextFromNode(testId6)).toBe('');
    expect(countRender1.howManyTimesBeenCalled()).toBe(10);
    expect(countRender2.howManyTimesBeenCalled()).toBe(7);
    expect(countRender3.howManyTimesBeenCalled()).toBe(10);
    expect(countRender4.howManyTimesBeenCalled()).toBe(9);
    expect(countRender5.howManyTimesBeenCalled()).toBe(7);
    expect(countRender6.howManyTimesBeenCalled()).toBe(9);

    unmount();
    if (flagManager.read('SHOULD_TEST_PERFORMANCE')) {
      expect(countSetter1(subscribeId1)).toBe(0);
      expect(countSetter1(subscribeId2)).toBe(0);
      expect(countSetter2(subscribeId1)).toBe(0);
      expect(countSetter2(subscribeId2)).toBe(0);
      expect(countSetter3(subscribeId1)).toBe(0);
      expect(countSetter3(subscribeId2)).toBe(0);
      expect(countSetter4(subscribeId1)).toBe(0);
      expect(countSetter4(subscribeId2)).toBe(0);
    }
  },
];

export default testContext;
