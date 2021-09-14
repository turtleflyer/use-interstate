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

  var setValue = function setValue(key, value, lastInSeries) {
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

  var reactRenderTask = function reactRenderTask() {
    if (!reactRenderTaskDone) {
      reactRenderTaskDone = true;
      reactEffectTaskDone = false;
      traverseLinkedList(reactCleaningWatchList, function (_ref2) {
        var removeTriggerFromKeyList = _ref2.removeTriggerFromKeyList;
        removeTriggerFromKeyList();
      });
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
    initRecords
  ) {
    var calculatedValue;
    var mustRecalculate = false;
    var addedToTriggersBatchPool = false;
    var unsubscribeFromKeys = [];

    if (initRecords) {
      var stateSlice = Object.fromEntries(
        initRecords.map(function (_ref3) {
          var _stateEntry$stateValu;

          var _ref4 = _slicedToArray__default['default'](_ref3, 3),
            key = _ref4[0],
            initValue = _ref4[1],
            needToCalculateValue = _ref4[2];

          var stateEntry = getStateValue(key);

          if (initValue !== undefined && !stateEntry.stateValue) {
            stateEntry.stateValue = {
              value: needToCalculateValue
                ? isFunctionParameter(initValue)
                  ? initValue()
                  : initValue
                : initValue,
            };
            traverseLinkedList(stateEntry.reactTriggersList, function (_ref5) {
              var trigger = _ref5.trigger;
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
        getKeys = _getAccessMapHandler2.getKeys;

      calculatedValue = getValueFromState(accessMapHandler);
      getKeys().forEach(function (key) {
        var stateEntry = getStateValue(key);
        unsubscribeFromKeys.push(createUnsubscribingFunction(stateEntry));
      });
    }

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
        getEntriesOfEnumerableKeys(keyOrSetterSchema).forEach(function (_ref, index, allKeys) {
          var _ref2 = _slicedToArray__default['default'](_ref, 2),
            key = _ref2[0],
            setterV = _ref2[1];

          setValue(key, setterV, index === allKeys.length - 1);
        });
        break;

      case 'function':
        getEntriesOfEnumerableKeys(getStateUsingSelector(keyOrSetterSchema)).forEach(function (
          _ref3,
          index,
          allKeys
        ) {
          var _ref4 = _slicedToArray__default['default'](_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

          setValue(key, value, index === allKeys.length - 1);
        });
        break;

      default: {
        var normalizedKey = normalizeKey(keyOrSetterSchema);
        var setterParamMustBeDefined = setterParam;
        setValue(
          normalizedKey,
          isFunctionParameter(setterParamMustBeDefined)
            ? setterParamMustBeDefined(getValue(normalizedKey))
            : setterParamMustBeDefined,
          true
        );
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
    react.useEffect(reactEffectTask);

    var _useState = react.useState(function () {
        var useRetrieveState = createUseRetrieveState();

        var determineNeedToResubscribe = function determineNeedToResubscribe() {
          return true;
        };

        var useInRender = function useInRender(paramInRender) {
          var paramForUseRetrieveState = null;

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

                paramForUseRetrieveState = {
                  takeStateAndCalculateValue: function takeStateAndCalculateValue(state) {
                    return state[normalizedKey];
                  },
                  initRecords: [
                    initParam === undefined ? [normalizedKey] : [normalizedKey, initParam, true],
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

                var initRecords = paramInRender.keys.map(function (key) {
                  return [normalizeKey(key)];
                });
                paramForUseRetrieveState = {
                  takeStateAndCalculateValue:
                    createTakeStateAndCalculateValueForObjectAndFuncAndList(initRecords),
                  initRecords: initRecords,
                };
                break;
              }

              case 'object interface': {
                determineNeedToResubscribe = createDetermineNeedToResubscribeWithDepsInvolved(
                  paramInRender.deps,
                  ['object interface', 'function interface']
                );

                var _initRecords = getEntriesOfEnumerableKeys(paramInRender.initState);

                paramForUseRetrieveState = {
                  takeStateAndCalculateValue:
                    createTakeStateAndCalculateValueForObjectAndFuncAndList(_initRecords),
                  initRecords: _initRecords,
                };
                break;
              }

              case 'function interface': {
                determineNeedToResubscribe = createDetermineNeedToResubscribeWithDepsInvolved(
                  paramInRender.deps,
                  ['object interface', 'function interface']
                );

                var _initRecords2 = getEntriesOfEnumerableKeys(paramInRender.initState());

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
                  ['selector']
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
      _useState2 = _slicedToArray__default['default'](_useState, 1),
      useInRender = _useState2[0].useInRender;

    return useInRender(param);

    function createUseRetrieveState() {
      var retrieveValue;
      var unsubscribe;
      var removeFromWatchList;

      var useRetrieveState = function useRetrieveState(subscribingParams) {
        var _useState3 = react.useState({}),
          _useState4 = _slicedToArray__default['default'](_useState3, 2),
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

      return useRetrieveState;
    }

    function createTakeStateAndCalculateValueForObjectAndFuncAndList(initRecords) {
      return function (state) {
        return Object.fromEntries(
          initRecords.map(function (_ref5) {
            var _ref6 = _slicedToArray__default['default'](_ref5, 1),
              key = _ref6[0];

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
