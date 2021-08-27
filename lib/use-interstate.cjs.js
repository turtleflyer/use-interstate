'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var react = require('react');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e };
}

var _slicedToArray__default = /*#__PURE__*/ _interopDefaultLegacy(_slicedToArray);
var _objectSpread__default = /*#__PURE__*/ _interopDefaultLegacy(_objectSpread);
var _toConsumableArray__default = /*#__PURE__*/ _interopDefaultLegacy(_toConsumableArray);

var createState = function createState() {
  var entriesMap = new Map();
  var fnToAccessValue;
  var accessHandler = {};
  var stateMap = {
    get: function get(key) {
      if (entriesMap.has(key)) {
        return entriesMap.get(key);
      }

      var newEntry = {
        reactTriggersList: {},
      };
      addKeyToState(key, newEntry);
      return newEntry;
    },
    set: function set(key, entryProperties) {
      var newEntry = _objectSpread__default['default'](
        _objectSpread__default['default']({}, entryProperties),
        {},
        {
          reactTriggersList: {},
        }
      );

      addKeyToState(key, newEntry);
      return newEntry;
    },
  };

  function addKeyToState(key, entry) {
    entriesMap.set(key, entry);
    Object.defineProperty(accessHandler, key, {
      enumerable: true,
      get: function get() {
        return fnToAccessValue(key);
      },
      configurable: false,
    });
  }

  var getAccessHandler = function getAccessHandler(wayToAccessValue) {
    fnToAccessValue = wayToAccessValue;
    return accessHandler;
  };

  var clearState = function clearState() {
    entriesMap.clear();
    accessHandler = {};
  };

  return {
    stateMap: stateMap,
    getAccessHandler: getAccessHandler,
    clearState: clearState,
  };
};

var getEntriesOfEnumerableKeys = function getEntriesOfEnumerableKeys(obj) {
  return []
    .concat(
      _toConsumableArray__default['default'](Object.getOwnPropertyNames(obj)),
      _toConsumableArray__default['default'](Object.getOwnPropertySymbols(obj))
    )
    .filter(function (key) {
      return Object.prototype.propertyIsEnumerable.call(obj, key);
    })
    .map(function (key) {
      return [key, obj[key]];
    });
};

var traverseLinkedList = function traverseLinkedList(list, callbackfn) {
  var curEntry = list.start;

  while (curEntry) {
    callbackfn(curEntry);
    curEntry = curEntry.next;
  }
};
var addLinkedListEntry = function addLinkedListEntry(list, entryProps) {
  var createdEntry = _objectSpread__default['default']({}, entryProps);

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

function createStore(initStateValues) {
  var _createState = createState(),
    stateMap = _createState.stateMap,
    getAccessHandler = _createState.getAccessHandler,
    clearState = _createState.clearState;

  var reactCleaningWatchList = {};
  var reactRenderTaskDone = false,
    reactEffectTaskDone = false;
  var reactRenderTasksPool = [];
  var reactEffectTasksPool = [];
  initState(initStateValues);

  var getValue = function getValue(key) {
    var _stateMap$get$stateVa;

    return (_stateMap$get$stateVa = stateMap.get(key).stateValue) === null ||
      _stateMap$get$stateVa === void 0
      ? void 0
      : _stateMap$get$stateVa.value;
  };

  var getStateUsingSelector = function getStateUsingSelector(selector, wayToAccessValue) {
    var handler = getAccessHandler(wayToAccessValue);
    return selector(handler);
  };

  var setValue = function setValue(key, value) {
    var stateEntry = stateMap.get(key);
    var oldValue = stateEntry.stateValue;
    stateEntry.stateValue = {
      value: value,
    };

    if (
      !stateEntry.reactTriggersList.triggersFired &&
      !(oldValue && Object.is(oldValue.value, value))
    ) {
      traverseLinkedList(stateEntry.reactTriggersList, function (_ref) {
        var trigger = _ref.trigger;
        trigger();
      });

      if (stateEntry.reactTriggersList.start) {
        stateEntry.reactTriggersList.triggersFired = true;
        reactRenderTasksPool.push(function () {
          return (stateEntry.reactTriggersList.triggersFired = false);
        });
      }
    }
  };

  var resetValue = function resetValue(resetStateValue) {
    clearState();
    initState(resetStateValue);
    reactCleaningWatchList = {};
    reactRenderTaskDone = false;
    reactEffectTaskDone = false;
    reactRenderTasksPool = [];
    reactEffectTasksPool = [];
  };

  var reactRenderTask = function reactRenderTask() {
    if (!reactRenderTaskDone) {
      reactRenderTaskDone = true;
      reactEffectTaskDone = false;
      traverseLinkedList(reactCleaningWatchList, function (_ref2) {
        var removeTriggerFromKeyList = _ref2.removeTriggerFromKeyList;
        removeTriggerFromKeyList();
      });
      reactRenderTasksPool.forEach(function (task) {
        return task();
      });
      reactRenderTasksPool = [];
      reactCleaningWatchList = {};
    }
  };

  var reactEffectTask = function reactEffectTask() {
    if (!reactEffectTaskDone) {
      reactEffectTaskDone = true;
      reactRenderTaskDone = false;
      reactEffectTasksPool.forEach(function (task) {
        return task();
      });
      reactEffectTasksPool = [];
    }
  };

  var reactSubscribeState = function reactSubscribeState(
    notifyingTrigger,
    getValueFromState,
    initValues
  ) {
    var calculatedValue;
    var mustRecalculate = false;
    var unsubscribeFromKeys = [];

    if (initValues) {
      var stateSlice = Object.fromEntries(
        initValues.map(function (_ref3) {
          var _stateEntry$stateValu;

          var _ref4 = _slicedToArray__default['default'](_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

          var stateEntry = stateMap.get(key);

          if (value !== undefined && !stateEntry.stateValue) {
            stateEntry.stateValue = {
              value: value,
            };
            traverseLinkedList(stateEntry.reactTriggersList, function (_ref5) {
              var trigger = _ref5.trigger;
              reactEffectTasksPool.push(function () {
                trigger();
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
      calculatedValue = getStateUsingSelector(getValueFromState, function (key) {
        var _stateEntry$stateValu2;

        var stateEntry = stateMap.get(key);
        unsubscribeFromKeys.push(createUnsubscribingFunction(stateEntry));
        return (_stateEntry$stateValu2 = stateEntry.stateValue) === null ||
          _stateEntry$stateValu2 === void 0
          ? void 0
          : _stateEntry$stateValu2.value;
      });
    }

    function createUnsubscribingFunction(stateEntry) {
      var trigger = function trigger() {
        mustRecalculate = true;
        notifyingTrigger();
      };

      var triggerEntry = addLinkedListEntry(stateEntry.reactTriggersList, {
        trigger: trigger,
      });
      return function () {
        removeLinkedListEntry(stateEntry.reactTriggersList, triggerEntry);
      };
    }

    var unsubscribe = function unsubscribe() {
      unsubscribeFromKeys.forEach(function (unsubscribeFromKey) {
        unsubscribeFromKey();
      });
      unsubscribeFromKeys = [];
    };

    var removeTriggerFromKeyList = function removeTriggerFromKeyList() {
      unsubscribe();
    };

    var watchListEntry = addLinkedListEntry(reactCleaningWatchList, {
      removeTriggerFromKeyList: removeTriggerFromKeyList,
    });

    var removeFromWatchList = function removeFromWatchList() {
      removeLinkedListEntry(reactCleaningWatchList, watchListEntry);
    };

    var retrieveValue = function retrieveValue() {
      if (mustRecalculate) {
        mustRecalculate = false;
        calculatedValue = getStateUsingSelector(getValueFromState, getValue);
      }

      return calculatedValue;
    };

    return {
      retrieveValue: retrieveValue,
      unsubscribe: unsubscribe,
      removeFromWatchList: removeFromWatchList,
    };
  };

  return {
    getValue: getValue,
    getStateUsingSelector: getStateUsingSelector,
    setValue: setValue,
    resetValue: resetValue,
    reactSubscribeState: reactSubscribeState,
    reactRenderTask: reactRenderTask,
    reactEffectTask: reactEffectTask,
  };

  function initState(initV) {
    initV &&
      getEntriesOfEnumerableKeys(initV).forEach(function (_ref6) {
        var _ref7 = _slicedToArray__default['default'](_ref6, 2),
          key = _ref7[0],
          value = _ref7[1];

        value !== undefined &&
          stateMap.set(key, {
            stateValue: {
              value: value,
            },
          });
      });
  }
}

var isFunctionParameter = function isFunctionParameter(param) {
  return typeof param === 'function';
};

var initInterstate = function initInterstate(initStateValues) {
  var _createStore = createStore(initStateValues),
    getValue = _createStore.getValue,
    setValue = _createStore.setValue,
    resetValue = _createStore.resetValue,
    getStateUsingSelector = _createStore.getStateUsingSelector,
    reactSubscribeState = _createStore.reactSubscribeState,
    reactRenderTask = _createStore.reactRenderTask,
    reactEffectTask = _createStore.reactEffectTask;

  var useDriveInterstate = function useDriveInterstate() {
    reactRenderTask();
    react.useEffect(reactEffectTask);

    var _useState = react.useState(function () {
        var retrieveValue;
        var unsubscribe;
        var removeFromWatchList;

        var useGetState = function useGetState(subscribingParams) {
          var _useState3 = react.useState({}),
            _useState4 = _slicedToArray__default['default'](_useState3, 2),
            setState = _useState4[1];

          if (subscribingParams) {
            var _unsubscribe;

            (_unsubscribe = unsubscribe) === null || _unsubscribe === void 0
              ? void 0
              : _unsubscribe();
            var getValueFromState = subscribingParams.getValueFromState,
              initValues = subscribingParams.initValues;

            var _reactSubscribeState = reactSubscribeState(
              function () {
                setState({});
              },
              getValueFromState,
              initValues
            );

            retrieveValue = _reactSubscribeState.retrieveValue;
            unsubscribe = _reactSubscribeState.unsubscribe;
            removeFromWatchList = _reactSubscribeState.removeFromWatchList;
          }

          react.useEffect(removeFromWatchList, [removeFromWatchList]);
          react.useEffect(function () {
            return function () {
              unsubscribe();
            };
          }, []);
          return retrieveValue();
        };

        return {
          useGetState: useGetState,
        };
      }),
      _useState2 = _slicedToArray__default['default'](_useState, 1),
      useGetState = _useState2[0].useGetState;

    return useGetState;
  };

  var useInterstate = function useInterstate(keyOrKeysOrInitParam, initParam) {
    var _useState5 = react.useState(function () {
        var memKey = null;
        var firstTimeRunSealed = false;
        var subscribingParams = null;

        var useBody = function useBody(keyOrKeysOrInitParamCurr, initParamCurr) {
          switch (typeof keyOrKeysOrInitParamCurr) {
            case 'object':
              if (!firstTimeRunSealed) {
                var initValues = isArray(keyOrKeysOrInitParamCurr)
                  ? keyOrKeysOrInitParamCurr.map(function (key) {
                      return [normalizeKey(key)];
                    })
                  : getEntriesOfEnumerableKeys(keyOrKeysOrInitParamCurr);
                subscribingParams = {
                  getValueFromState: function getValueFromState(state) {
                    return Object.fromEntries(
                      initValues.map(function (_ref) {
                        var _ref2 = _slicedToArray__default['default'](_ref, 1),
                          key = _ref2[0];

                        return [key, state[key]];
                      })
                    );
                  },
                  initValues: initValues,
                };
                break;
              }

              subscribingParams = null;
              break;

            case 'function':
              if (!firstTimeRunSealed) {
                var _initValues = getEntriesOfEnumerableKeys(keyOrKeysOrInitParamCurr());

                subscribingParams = {
                  getValueFromState: function getValueFromState(state) {
                    return Object.fromEntries(
                      _initValues.map(function (_ref3) {
                        var _ref4 = _slicedToArray__default['default'](_ref3, 1),
                          key = _ref4[0];

                        return [key, state[key]];
                      })
                    );
                  },
                  initValues: _initValues,
                };
                break;
              }

              subscribingParams = null;
              break;

            default: {
              var normalizedKey = normalizeKey(keyOrKeysOrInitParamCurr);

              if (!firstTimeRunSealed || (memKey !== null && normalizedKey !== memKey)) {
                subscribingParams = {
                  getValueFromState: function getValueFromState(state) {
                    return state[normalizedKey];
                  },
                  initValues: [
                    [
                      normalizedKey,
                      isFunctionParameter(initParamCurr) ? initParamCurr() : initParamCurr,
                    ],
                  ],
                };
                memKey = normalizedKey;
                break;
              }

              subscribingParams = null;
            }
          }

          firstTimeRunSealed = true;
          var useGetState = useDriveInterstate();
          return useGetState(subscribingParams);
        };

        return {
          useBody: useBody,
        };
      }),
      _useState6 = _slicedToArray__default['default'](_useState5, 1),
      useBody = _useState6[0].useBody;

    return useBody(keyOrKeysOrInitParam, initParam);
  };

  useInterstate.acceptSelector = function (selector) {
    var _useState7 = react.useState(function () {
        var firstTimeRunSealed = false;

        var useBody = function useBody(selectorCurr) {
          var subscribingParams = firstTimeRunSealed
            ? null
            : {
                getValueFromState: selectorCurr,
              };
          firstTimeRunSealed = true;
          var useGetState = useDriveInterstate();
          return useGetState(subscribingParams);
        };

        return {
          useBody: useBody,
        };
      }),
      _useState8 = _slicedToArray__default['default'](_useState7, 1),
      useBody = _useState8[0].useBody;

    return useBody(selector);
  };

  var setInterstate = function setInterstate(keyOrSetterSchema, setterParam) {
    switch (typeof keyOrSetterSchema) {
      case 'object':
        getEntriesOfEnumerableKeys(keyOrSetterSchema).forEach(function (_ref5) {
          var _ref6 = _slicedToArray__default['default'](_ref5, 2),
            key = _ref6[0],
            setterP = _ref6[1];

          setValueNormalizingParam(key, function () {
            return setterP;
          });
        });
        break;

      case 'function':
        getEntriesOfEnumerableKeys(getStateUsingSelector(keyOrSetterSchema, getValue)).forEach(
          function (_ref7) {
            var _ref8 = _slicedToArray__default['default'](_ref7, 2),
              key = _ref8[0],
              value = _ref8[1];

            setValue(key, value);
          }
        );
        break;

      default:
        setValueNormalizingParam(normalizeKey(keyOrSetterSchema), setterParam);
        break;
    }

    function setValueNormalizingParam(key, setterP) {
      setValue(key, isFunctionParameter(setterP) ? setterP(getValue(key)) : setterP);
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
    return getStateUsingSelector(selector, getValue);
  };

  var resetInterstate = resetValue;
  return {
    useInterstate: useInterstate,
    setInterstate: setInterstate,
    readInterstate: readInterstate,
    resetInterstate: resetInterstate,
  };
};

function isArray(keyOrKeys) {
  return Array.isArray(keyOrKeys);
}

function normalizeKey(key) {
  return typeof key === 'number' ? ''.concat(key) : key;
}

exports.initInterstate = initInterstate;
