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
    var newEntry = _objectSpread__default['default'](
      _objectSpread__default['default']({}, entryProperties),
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

    var getKeys = function getKeys() {
      return capturedKeys;
    };

    return {
      accessMapHandler: accessMapHandler,
      getKeys: getKeys,
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
    getStateValue = _createState.getStateValue,
    setStateValue = _createState.setStateValue,
    getAccessMapHandler = _createState.getAccessMapHandler,
    clearState = _createState.clearState;

  var reactCleaningWatchList = {};
  var reactRenderTaskDone = false,
    reactEffectTaskDone = false;
  var reactRenderTasksPool = [];
  var reactEffectTasksPool = [];
  initState(initStateValues);

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

  var setValue = function setValue(key, value) {
    var stateEntry = getStateValue(key);
    var oldValue = stateEntry.stateValue;
    stateEntry.stateValue = {
      value: value,
    };

    if (
      stateEntry.reactTriggersList.start &&
      !stateEntry.reactTriggersList.triggersFired &&
      !(oldValue && Object.is(oldValue.value, value))
    ) {
      stateEntry.reactTriggersList.triggersFired = true;
      reactRenderTasksPool.push(function () {
        stateEntry.reactTriggersList.triggersFired = false;
      });
      traverseLinkedList(stateEntry.reactTriggersList, function (_ref) {
        var trigger = _ref.trigger;
        trigger();
      });
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

          var stateEntry = getStateValue(key);

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
      var _getAccessMapHandler2 = getAccessMapHandler(),
        accessMapHandler = _getAccessMapHandler2.accessMapHandler,
        getKeys = _getAccessMapHandler2.getKeys;

      calculatedValue = getValueFromState(accessMapHandler);
      getKeys().forEach(function (key) {
        var stateEntry = getStateValue(key);
        unsubscribeFromKeys.push(createUnsubscribingFunction(stateEntry));
      });
    }

    function createUnsubscribingFunction(stateEntry) {
      var trigger = function trigger() {
        if (!mustRecalculate) {
          mustRecalculate = true;
          notifyingTrigger();
        }
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

        var _getAccessMapHandler3 = getAccessMapHandler(),
          _accessMapHandler = _getAccessMapHandler3.accessMapHandler;

        calculatedValue = getValueFromState(_accessMapHandler);
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
          setStateValue(key, {
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
    switch (typeof keyOrSetterSchema) {
      case 'object':
        getEntriesOfEnumerableKeys(keyOrSetterSchema).forEach(function (_ref) {
          var _ref2 = _slicedToArray__default['default'](_ref, 2),
            key = _ref2[0],
            setterP = _ref2[1];

          setValueNormalizingParam(key, function () {
            return setterP;
          });
        });
        break;

      case 'function':
        getEntriesOfEnumerableKeys(getStateUsingSelector(keyOrSetterSchema)).forEach(function (
          _ref3
        ) {
          var _ref4 = _slicedToArray__default['default'](_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

          setValue(key, value);
        });
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
    var _useState = react.useState(function () {
        var determineNeedToResubscribe = function determineNeedToResubscribe() {
          return true;
        };

        var useInRender = function useInRender(paramInRender) {
          var useGetState = useDriveInterstate();
          var useGetStateParam = null;

          if (determineNeedToResubscribe(paramInRender)) {
            switch (paramInRender.interfaceType) {
              case 'single key': {
                var normalizedKey = normalizeKey(paramInRender.key);
                var initParam = paramInRender.initParam;

                determineNeedToResubscribe = function determineNeedToResubscribe(paramToCheck) {
                  return (
                    paramToCheck.interfaceType !== 'single key' ||
                    paramToCheck.key !== paramInRender.key
                  );
                };

                useGetStateParam = {
                  takeStateAndCalculateValue: function takeStateAndCalculateValue(state) {
                    return state[normalizedKey];
                  },
                  initValues: [
                    [normalizedKey, isFunctionParameter(initParam) ? initParam() : initParam],
                  ],
                };
                break;
              }

              case 'keys list': {
                determineNeedToResubscribe = function determineNeedToResubscribe(paramToCheck) {
                  return (
                    paramToCheck.interfaceType !== 'keys list' ||
                    checkDepsChanged(paramToCheck.keys, paramInRender.keys)
                  );
                };

                var initValues = paramInRender.keys.map(function (key) {
                  return [normalizeKey(key)];
                });
                useGetStateParam = {
                  takeStateAndCalculateValue:
                    getTakeStateAndCalculateValueForObjectAndFuncAndList(initValues),
                  initValues: initValues,
                };
                break;
              }

              case 'object interface': {
                determineNeedToResubscribe = getDetermineNeedToResubscribeForDepsInvolved(
                  paramInRender.deps,
                  ['object interface', 'function interface']
                );

                var _initValues = getEntriesOfEnumerableKeys(paramInRender.initState);

                useGetStateParam = {
                  takeStateAndCalculateValue:
                    getTakeStateAndCalculateValueForObjectAndFuncAndList(_initValues),
                  initValues: _initValues,
                };
                break;
              }

              case 'function interface': {
                determineNeedToResubscribe = getDetermineNeedToResubscribeForDepsInvolved(
                  paramInRender.deps,
                  ['object interface', 'function interface']
                );

                var _initValues2 = getEntriesOfEnumerableKeys(paramInRender.initState());

                useGetStateParam = {
                  takeStateAndCalculateValue:
                    getTakeStateAndCalculateValueForObjectAndFuncAndList(_initValues2),
                  initValues: _initValues2,
                };
                break;
              }

              case 'selector':
                determineNeedToResubscribe = getDetermineNeedToResubscribeForDepsInvolved(
                  paramInRender.deps,
                  ['selector']
                );
                useGetStateParam = {
                  takeStateAndCalculateValue: paramInRender.selector,
                };
                break;
            }
          }

          return useGetState(useGetStateParam);
        };

        return {
          useInRender: useInRender,
        };
      }),
      _useState2 = _slicedToArray__default['default'](_useState, 1),
      useInRender = _useState2[0].useInRender;

    return useInRender(param);

    function getDetermineNeedToResubscribeForDepsInvolved(depsToCheckWith, allowedInterfaceTypes) {
      return depsToCheckWith
        ? function (paramToCheck) {
            if (
              allowedInterfaceTypes.some(function (it) {
                return it === paramToCheck.interfaceType;
              })
            ) {
              var deps = paramToCheck.deps;
              return !deps || checkDepsChanged(deps, depsToCheckWith);
            }

            return true;
          }
        : function () {
            return true;
          };
    }

    function getTakeStateAndCalculateValueForObjectAndFuncAndList(initValues) {
      return function (state) {
        return Object.fromEntries(
          initValues.map(function (_ref5) {
            var _ref6 = _slicedToArray__default['default'](_ref5, 1),
              key = _ref6[0];

            return [key, state[key]];
          })
        );
      };
    }
  }

  function useDriveInterstate() {
    reactRenderTask();
    react.useEffect(reactEffectTask);

    var _useState3 = react.useState(function () {
        var retrieveValue;
        var unsubscribe;
        var removeFromWatchList;

        var useGetState = function useGetState(subscribingParams) {
          var _useState5 = react.useState({}),
            _useState6 = _slicedToArray__default['default'](_useState5, 2),
            setState = _useState6[1];

          if (subscribingParams) {
            var _unsubscribe;

            (_unsubscribe = unsubscribe) === null || _unsubscribe === void 0
              ? void 0
              : _unsubscribe();
            var takeStateAndCalculateValue = subscribingParams.takeStateAndCalculateValue,
              initValues = subscribingParams.initValues;

            var _reactSubscribeState = reactSubscribeState(
              function () {
                setState({});
              },
              takeStateAndCalculateValue,
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
      _useState4 = _slicedToArray__default['default'](_useState3, 1),
      useGetState = _useState4[0].useGetState;

    return useGetState;
  }

  function unifyUseInterstateInterface() {
    for (var _len = arguments.length, _ref7 = new Array(_len), _key = 0; _key < _len; _key++) {
      _ref7[_key] = arguments[_key];
    }

    var firstArg = _ref7[0],
      secondArg = _ref7[1];

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
              deps: secondArg,
            };

      case 'function':
        return {
          interfaceType: 'function interface',
          initState: firstArg,
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

function checkDepsChanged(depsToCheck, depsToCheckWith) {
  if (depsToCheck.length === depsToCheckWith.length) {
    return depsToCheck.some(function (dep, index) {
      return !Object.is(dep, depsToCheckWith[index]);
    });
  }

  return true;
}

function isArray(keyOrKeys) {
  return Array.isArray(keyOrKeys);
}

function normalizeKey(key) {
  return typeof key === 'number' ? ''.concat(key) : key;
}

exports.initInterstate = initInterstate;
