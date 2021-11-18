import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import { useEffect, useState } from 'react';
import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import _toConsumableArray from '@babel/runtime/helpers/esm/toConsumableArray';

var createState = function createState() {
  var entriesMap = {};
  var accessMapHandler = {};
  var keysCollector;

  var getStateValue = function getStateValue(key) {
    if (key in entriesMap) {
      return entriesMap[key];
    }

    var newEntry = {
      reactTriggersList: {},
    };
    addKeyToState(key, newEntry);
    return newEntry;
  };

  var setStateValue = function setStateValue(key, entryProperties) {
    var newEntry = _objectSpread(
      _objectSpread({}, entryProperties),
      {},
      {
        reactTriggersList: {},
      }
    );

    addKeyToState(key, newEntry);
    return newEntry;
  };

  function addKeyToState(key, entry) {
    entriesMap[key] = entry;
    Object.defineProperty(accessMapHandler, key, {
      enumerable: true,
      get: function get() {
        var _entry$stateValue;

        keysCollector(key);
        return (_entry$stateValue = entry.stateValue) === null || _entry$stateValue === void 0
          ? void 0
          : _entry$stateValue.value;
      },
      configurable: false,
    });
  }

  var getAccessMapHandler = function getAccessMapHandler() {
    var capturedKeys = [];

    keysCollector = function keysCollector(key) {
      capturedKeys.push(key);
    };

    var getKeysBeingAccessed = function getKeysBeingAccessed() {
      return capturedKeys;
    };

    return {
      accessMapHandler: accessMapHandler,
      getKeysBeingAccessed: getKeysBeingAccessed,
    };
  };

  var clearState = function clearState() {
    entriesMap = {};
    accessMapHandler = {};
  };

  return {
    getStateValue: getStateValue,
    setStateValue: setStateValue,
    getAccessMapHandler: getAccessMapHandler,
    clearState: clearState,
  };
};

var getEnumerableKeys = function getEnumerableKeys(obj) {
  return []
    .concat(
      _toConsumableArray(Object.getOwnPropertyNames(obj)),
      _toConsumableArray(Object.getOwnPropertySymbols(obj))
    )
    .filter(function (key) {
      return Object.prototype.propertyIsEnumerable.call(obj, key);
    });
};
var getEntriesOfEnumerableKeys = function getEntriesOfEnumerableKeys(obj) {
  return getEnumerableKeys(obj).map(function (key) {
    return [key, obj[key]];
  });
};

var isFunctionParameter = function isFunctionParameter(param) {
  return typeof param === 'function';
};

var traverseLinkedList = function traverseLinkedList(list, callbackfn) {
  var curEntry = list.start;

  while (curEntry) {
    callbackfn(curEntry);
    curEntry = curEntry.next;
  }
};
var addLinkedListEntry = function addLinkedListEntry(list, entryProps) {
  var createdEntry = _objectSpread({}, entryProps);

  if (isLinkedListFilled(list)) {
    var _ref = [list.start, createdEntry, createdEntry];
    createdEntry.next = _ref[0];
    list.start.prev = _ref[1];
    list.start = _ref[2];
  } else {
    list.start = createdEntry;
  }

  return createdEntry;
};

function isLinkedListFilled(list) {
  return list.start;
}

var determineOppositeDirection = {
  prev: 'next',
  next: 'prev',
};
var removeLinkedListEntry = function removeLinkedListEntry(list, entry) {
  if (entry.beenRemoved) {
    return;
  }

  list.start = closeSettersListInSingleDirection('prev', list.start);
  closeSettersListInSingleDirection('next');

  function closeSettersListInSingleDirection(direction, sideEnd) {
    var neighbor = entry[direction];
    var oppositeDirection = determineOppositeDirection[direction];

    if (!neighbor) {
      return entry[oppositeDirection];
    }

    neighbor[oppositeDirection] = entry[oppositeDirection];
    return sideEnd;
  }

  entry.beenRemoved = true;
};

var _toAccessWhileTesting_toNotifyReactSubscribeState = null;
var createStore = function createStore(initStateValues) {
  var _createState = createState(),
    getStateValue = _createState.getStateValue,
    setStateValue = _createState.setStateValue,
    getAccessMapHandler = _createState.getAccessMapHandler,
    clearState = _createState.clearState;

  initState(initStateValues);
  var reactCleaningWatchList = {};
  var reactRenderTaskDone = false,
    reactEffectTaskDone = false;
  var reactEffectTasksPool = [];
  var triggersBatchPool = [];

  var getValue = function getValue(key) {
    var _getStateValue$stateV;

    return (_getStateValue$stateV = getStateValue(key).stateValue) === null ||
      _getStateValue$stateV === void 0
      ? void 0
      : _getStateValue$stateV.value;
  };

  var getStateUsingSelector = function getStateUsingSelector(selector) {
    var _getAccessMapHandler = getAccessMapHandler(),
      accessMapHandler = _getAccessMapHandler.accessMapHandler;

    return selector(accessMapHandler);
  };

  var setValue = function setValue(setValueParam) {
    var key = setValueParam.key,
      needToCalculateValue = setValueParam.needToCalculateValue,
      lastInSeries = setValueParam.lastInSeries;
    var stateEntry = getStateValue(key);
    var prevValueRecord = stateEntry.stateValue;
    var nextValue = needToCalculateValue
      ? isFunctionParameter(setValueParam.valueToCalculate)
        ? setValueParam.valueToCalculate(
            prevValueRecord === null || prevValueRecord === void 0 ? void 0 : prevValueRecord.value
          )
        : setValueParam.valueToCalculate
      : setValueParam.value;
    stateEntry.stateValue = {
      value: nextValue,
    };

    if (
      stateEntry.reactTriggersList.start &&
      !stateEntry.reactTriggersList.triggersFired &&
      !(prevValueRecord && Object.is(prevValueRecord.value, nextValue))
    ) {
      stateEntry.reactTriggersList.triggersFired = true;
      triggersBatchPool.push(function () {
        stateEntry.reactTriggersList.triggersFired = false;
      });
      traverseLinkedList(stateEntry.reactTriggersList, function (_ref) {
        var trigger = _ref.trigger;
        trigger.addToTriggersBatchPool();
      });
    }

    if (lastInSeries) {
      triggersBatchPool.forEach(function (batchTask) {
        return batchTask();
      });
      triggersBatchPool = [];
    }
  };

  var resetValue = function resetValue(resetStateValue) {
    clearState();
    initState(resetStateValue);
    reactCleaningWatchList = {};
    reactRenderTaskDone = false;
    reactEffectTaskDone = false;
    reactEffectTasksPool = [];
  };

  var reactSubscribeState = function reactSubscribeState(
    notifyingTrigger,
    getValueFromState,
    initRecords
  ) {
    var _toAccessWhileTesting;

    var calculatedValue;
    var mustRecalculate = false;
    var addedToTriggersBatchPool = false;
    var unsubscribeFromKeys = [];

    if (initRecords) {
      var stateSlice = Object.fromEntries(
        initRecords.map(function (rec) {
          var _stateEntry$stateValu;

          var key = rec.key,
            needToCalculateValue = rec.needToCalculateValue;
          var stateEntry = getStateValue(key);

          if (!stateEntry.stateValue && (needToCalculateValue || rec.initValue !== undefined)) {
            stateEntry.stateValue = {
              value: needToCalculateValue
                ? isFunctionParameter(rec.initValueToCalculate)
                  ? rec.initValueToCalculate()
                  : rec.initValueToCalculate
                : rec.initValue,
            };
            traverseLinkedList(stateEntry.reactTriggersList, function (_ref2) {
              var trigger = _ref2.trigger;
              reactEffectTasksPool.push(function () {
                trigger.fire();
              });
            });
          }

          unsubscribeFromKeys.push(createUnsubscribingFunction(stateEntry));
          return [
            key,
            (_stateEntry$stateValu = stateEntry.stateValue) === null ||
            _stateEntry$stateValu === void 0
              ? void 0
              : _stateEntry$stateValu.value,
          ];
        })
      );
      calculatedValue = getValueFromState(stateSlice);
    } else {
      var _getAccessMapHandler2 = getAccessMapHandler(),
        accessMapHandler = _getAccessMapHandler2.accessMapHandler,
        getKeysBeingAccessed = _getAccessMapHandler2.getKeysBeingAccessed;

      calculatedValue = getValueFromState(accessMapHandler);
      getKeysBeingAccessed().forEach(function (key) {
        var stateEntry = getStateValue(key);
        unsubscribeFromKeys.push(createUnsubscribingFunction(stateEntry));
      });
    }

    var retrieveValue = function retrieveValue() {
      if (mustRecalculate) {
        mustRecalculate = false;

        var _getAccessMapHandler3 = getAccessMapHandler(),
          _accessMapHandler = _getAccessMapHandler3.accessMapHandler;

        calculatedValue = getValueFromState(_accessMapHandler);
      }

      return calculatedValue;
    };

    var unsubscribe = function unsubscribe() {
      unsubscribeFromKeys.forEach(function (unsubscribeFromKey) {
        unsubscribeFromKey();
      });
      unsubscribeFromKeys = [];
    };

    var watchListEntry;

    var addToWatchList = function addToWatchList() {
      watchListEntry = addLinkedListEntry(reactCleaningWatchList, {
        removeTriggerFromKeyList: unsubscribe,
      });
      return {
        removeFromWatchList: function removeFromWatchList() {
          removeLinkedListEntry(reactCleaningWatchList, watchListEntry);
        },
      };
    };

    (_toAccessWhileTesting = _toAccessWhileTesting_toNotifyReactSubscribeState) === null ||
    _toAccessWhileTesting === void 0
      ? void 0
      : _toAccessWhileTesting();
    return {
      retrieveValue: retrieveValue,
      unsubscribe: unsubscribe,
      addToWatchList: addToWatchList,
    };

    function createUnsubscribingFunction(stateEntry) {
      var fire = function fire() {
        if (!mustRecalculate) {
          mustRecalculate = true;
          notifyingTrigger();
        }
      };

      var addToTriggersBatchPool = function addToTriggersBatchPool() {
        if (!addedToTriggersBatchPool) {
          addedToTriggersBatchPool = true;
          triggersBatchPool.push(fire, function () {
            addedToTriggersBatchPool = false;
          });
        }
      };

      var triggerEntry = addLinkedListEntry(stateEntry.reactTriggersList, {
        trigger: {
          fire: fire,
          addToTriggersBatchPool: addToTriggersBatchPool,
        },
      });
      return function () {
        removeLinkedListEntry(stateEntry.reactTriggersList, triggerEntry);
      };
    }
  };

  var proceedWatchList = function proceedWatchList() {
    reactEffectTaskDone &&
      traverseLinkedList(reactCleaningWatchList, function (_ref3) {
        var removeTriggerFromKeyList = _ref3.removeTriggerFromKeyList;
        removeTriggerFromKeyList();
      });
    reactCleaningWatchList = {};
  };

  var reactRenderTask = function reactRenderTask() {
    if (!reactRenderTaskDone) {
      proceedWatchList();
      reactRenderTaskDone = true;
      reactEffectTaskDone = false;
    }
  };

  var reactEffectTask = function reactEffectTask() {
    if (!reactEffectTaskDone) {
      reactEffectTasksPool.forEach(function (task) {
        return task();
      });
      reactEffectTasksPool = [];
      reactEffectTaskDone = true;
      reactRenderTaskDone = false;
    }
  };

  return {
    getValue: getValue,
    getStateUsingSelector: getStateUsingSelector,
    setValue: setValue,
    resetValue: resetValue,
    reactSubscribeState: reactSubscribeState,
    proceedWatchList: proceedWatchList,
    reactRenderTask: reactRenderTask,
    reactEffectTask: reactEffectTask,
  };

  function initState(initV) {
    initV &&
      getEntriesOfEnumerableKeys(initV).forEach(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
          key = _ref5[0],
          value = _ref5[1];

        value !== undefined &&
          setStateValue(key, {
            stateValue: {
              value: value,
            },
          });
      });
  }
};

var initInterstate = function initInterstate(initStateValues) {
  var _createStore = createStore(initStateValues),
    getValue = _createStore.getValue,
    setValue = _createStore.setValue,
    resetValue = _createStore.resetValue,
    getStateUsingSelector = _createStore.getStateUsingSelector,
    reactSubscribeState = _createStore.reactSubscribeState,
    proceedWatchList = _createStore.proceedWatchList,
    reactRenderTask = _createStore.reactRenderTask,
    reactEffectTask = _createStore.reactEffectTask;

  var useInterstate = function useInterstate() {
    return useInterstateTakingUnifiedInterface(
      unifyUseInterstateInterface.apply(void 0, arguments)
    );
  };

  useInterstate.acceptSelector = function (selector, deps) {
    return useInterstateTakingUnifiedInterface({
      interfaceType: 'selector',
      selector: selector,
      deps: deps,
    });
  };

  var setInterstate = function setInterstate(keyOrSetterSchema, setterParam) {
    proceedWatchList();

    switch (typeof keyOrSetterSchema) {
      case 'object':
        getEntriesOfEnumerableKeys(keyOrSetterSchema).forEach(function (_ref, index, allKeys) {
          var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            setterV = _ref2[1];

          setValue({
            key: key,
            value: setterV,
            lastInSeries: index === allKeys.length - 1,
          });
        });
        break;

      case 'function':
        getEntriesOfEnumerableKeys(getStateUsingSelector(keyOrSetterSchema)).forEach(function (
          _ref3,
          index,
          allKeys
        ) {
          var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

          setValue({
            key: key,
            value: value,
            lastInSeries: index === allKeys.length - 1,
          });
        });
        break;

      default: {
        setValue({
          key: normalizeKey(keyOrSetterSchema),
          valueToCalculate: setterParam,
          needToCalculateValue: true,
          lastInSeries: true,
        });
        break;
      }
    }
  };

  var readInterstate = function readInterstate(keyOrKeys) {
    return isArray(keyOrKeys)
      ? Object.fromEntries(
          keyOrKeys.map(function (key) {
            return [key, getValue(normalizeKey(key))];
          })
        )
      : getValue(normalizeKey(keyOrKeys));
  };

  readInterstate.acceptSelector = function (selector) {
    return getStateUsingSelector(selector);
  };

  var resetInterstate = resetValue;
  return {
    useInterstate: useInterstate,
    setInterstate: setInterstate,
    readInterstate: readInterstate,
    resetInterstate: resetInterstate,
  };

  function useInterstateTakingUnifiedInterface(param) {
    reactRenderTask();
    useEffect(reactEffectTask);

    var _useState = useState(function () {
        var useRetrieveState = createUseRetrieveState();

        var determineNeedToResubscribe = function determineNeedToResubscribe() {
          return {
            determination: true,
          };
        };

        var useInRender = function useInRender(paramInRender) {
          var paramForUseRetrieveState = null;

          var _determineNeedToResub = determineNeedToResubscribe(paramInRender),
            determination = _determineNeedToResub.determination,
            calculatedKeys = _determineNeedToResub.calculatedKeys;

          if (determination) {
            switch (paramInRender.interfaceType) {
              case 'single key': {
                var normalizedKey = normalizeKey(paramInRender.key);
                var initParam = paramInRender.initParam;

                determineNeedToResubscribe = function determineNeedToResubscribe(paramToCheck) {
                  return {
                    determination:
                      paramToCheck.interfaceType !== 'single key' ||
                      paramToCheck.key !== paramInRender.key,
                  };
                };

                paramForUseRetrieveState = {
                  takeStateAndCalculateValue: function takeStateAndCalculateValue(state) {
                    return state[normalizedKey];
                  },
                  initRecords: [
                    initParam === undefined
                      ? {
                          key: normalizedKey,
                        }
                      : {
                          key: normalizedKey,
                          initValueToCalculate: initParam,
                          needToCalculateValue: true,
                        },
                  ],
                };
                break;
              }

              case 'keys list': {
                var keysSet = new Set(paramInRender.keys);
                var initRecords = paramInRender.keys.map(function (key) {
                  return {
                    key: normalizeKey(key),
                  };
                });

                determineNeedToResubscribe = function determineNeedToResubscribe(paramToCheck) {
                  return {
                    determination:
                      paramToCheck.interfaceType !== 'keys list' ||
                      paramToCheck.keys.length !== keysSet.size ||
                      paramToCheck.keys.some(function (key) {
                        return !keysSet.has(key);
                      }),
                  };
                };

                paramForUseRetrieveState = {
                  takeStateAndCalculateValue:
                    createTakeStateAndCalculateValueForObjectAndFuncAndList(initRecords),
                  initRecords: initRecords,
                };
                break;
              }

              case 'object interface': {
                var initState = paramInRender.initState;
                var keys =
                  calculatedKeys !== null && calculatedKeys !== void 0
                    ? calculatedKeys
                    : getEnumerableKeys(initState);

                var _keysSet = new Set(keys);

                var _initRecords = keys.map(function (key) {
                  return {
                    key: key,
                    initValue: initState[key],
                  };
                });

                determineNeedToResubscribe = function determineNeedToResubscribe(paramToCheck) {
                  if (paramToCheck.interfaceType === 'object interface') {
                    var nextKeys = getEnumerableKeys(paramToCheck.initState);
                    return {
                      determination:
                        nextKeys.length !== _keysSet.size ||
                        nextKeys.some(function (key) {
                          return !_keysSet.has(key);
                        }),
                      calculatedKeys: nextKeys,
                    };
                  }

                  return {
                    determination: true,
                  };
                };

                paramForUseRetrieveState = {
                  takeStateAndCalculateValue:
                    createTakeStateAndCalculateValueForObjectAndFuncAndList(_initRecords),
                  initRecords: _initRecords,
                };
                break;
              }

              case 'function interface': {
                var _initState = paramInRender.createInitState();

                var _initRecords2 = getEnumerableKeys(_initState).map(function (key) {
                  return {
                    key: key,
                    initValue: _initState[key],
                  };
                });

                determineNeedToResubscribe = createDetermineNeedToResubscribeWithDepsInvolved(
                  paramInRender.deps,
                  'function interface'
                );
                paramForUseRetrieveState = {
                  takeStateAndCalculateValue:
                    createTakeStateAndCalculateValueForObjectAndFuncAndList(_initRecords2),
                  initRecords: _initRecords2,
                };
                break;
              }

              case 'selector':
                determineNeedToResubscribe = createDetermineNeedToResubscribeWithDepsInvolved(
                  paramInRender.deps,
                  'selector'
                );
                paramForUseRetrieveState = {
                  takeStateAndCalculateValue: paramInRender.selector,
                };
                break;
            }
          }

          return useRetrieveState(paramForUseRetrieveState);
        };

        return {
          useInRender: useInRender,
        };
      }),
      _useState2 = _slicedToArray(_useState, 1),
      useInRender = _useState2[0].useInRender;

    return useInRender(param);

    function createUseRetrieveState() {
      var retrieveValue;
      var unsubscribe;
      var addToWatchList;
      var removeFromWatchList;
      var firstRun = true;

      var useRetrieveState = function useRetrieveState(subscribingParams) {
        var _useState3 = useState({}),
          _useState4 = _slicedToArray(_useState3, 2),
          setState = _useState4[1];

        if (subscribingParams) {
          var _unsubscribe;

          (_unsubscribe = unsubscribe) === null || _unsubscribe === void 0
            ? void 0
            : _unsubscribe();
          var takeStateAndCalculateValue = subscribingParams.takeStateAndCalculateValue,
            initRecords = subscribingParams.initRecords;

          var _reactSubscribeState = reactSubscribeState(
            function () {
              setState({});
            },
            takeStateAndCalculateValue,
            initRecords
          );

          retrieveValue = _reactSubscribeState.retrieveValue;
          unsubscribe = _reactSubscribeState.unsubscribe;
          addToWatchList = _reactSubscribeState.addToWatchList;

          if (firstRun) {
            var _addToWatchList = addToWatchList();

            removeFromWatchList = _addToWatchList.removeFromWatchList;
          }
        }

        useEffect(
          function () {
            firstRun && removeFromWatchList();
            firstRun = false;
          },
          [firstRun]
        );
        useEffect(function () {
          return function () {
            unsubscribe();
          };
        }, []);
        return retrieveValue();
      };

      return useRetrieveState;
    }

    function createTakeStateAndCalculateValueForObjectAndFuncAndList(initRecords) {
      return function (state) {
        return Object.fromEntries(
          initRecords.map(function (_ref5) {
            var key = _ref5.key;
            return [key, state[key]];
          })
        );
      };
    }

    function createDetermineNeedToResubscribeWithDepsInvolved(
      depsToCheckWith,
      allowedInterfaceTypes
    ) {
      return depsToCheckWith
        ? function (paramToCheck) {
            return {
              determination:
                paramToCheck.interfaceType !== allowedInterfaceTypes ||
                !paramToCheck.deps ||
                paramToCheck.deps.length !== depsToCheckWith.length ||
                paramToCheck.deps.some(function (dep, index) {
                  return !Object.is(dep, depsToCheckWith[index]);
                }),
            };
          }
        : function () {
            return {
              determination: true,
            };
          };
    }
  }

  function unifyUseInterstateInterface() {
    for (var _len = arguments.length, _ref6 = new Array(_len), _key = 0; _key < _len; _key++) {
      _ref6[_key] = arguments[_key];
    }

    var firstArg = _ref6[0],
      secondArg = _ref6[1];

    switch (typeof firstArg) {
      case 'object':
        return isArray(firstArg)
          ? {
              interfaceType: 'keys list',
              keys: firstArg,
            }
          : {
              interfaceType: 'object interface',
              initState: firstArg,
            };

      case 'function':
        return {
          interfaceType: 'function interface',
          createInitState: firstArg,
          deps: secondArg,
        };

      default:
        return {
          interfaceType: 'single key',
          key: firstArg,
          initParam: secondArg,
        };
    }
  }
};

function normalizeKey(key) {
  return typeof key === 'number' ? ''.concat(key) : key;
}

function isArray(keyOrKeys) {
  return Array.isArray(keyOrKeys);
}

export { initInterstate };
