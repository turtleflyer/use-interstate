!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).useInterstate={},e.React)}(this,(function(e,t){"use strict";function r(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function n(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==r)return;var n,a,i=[],u=!0,c=!1;try{for(r=r.call(e);!(u=(n=r.next()).done)&&(i.push(n.value),!t||i.length!==t);u=!0);}catch(e){c=!0,a=e}finally{try{u||null==r.return||r.return()}finally{if(c)throw a}}return i}(e,t)||c(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e){return function(e){if(Array.isArray(e))return o(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||c(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(e,t){if(e){if("string"==typeof e)return o(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(e,t):void 0}}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var l=function(e){return[].concat(u(Object.getOwnPropertyNames(e)),u(Object.getOwnPropertySymbols(e))).filter((function(t){return Object.prototype.propertyIsEnumerable.call(e,t)}))},s=function(e){return l(e).map((function(t){return[t,e[t]]}))},f=function(e){return"function"==typeof e},d=function(e,t){for(var r=e.start;r;)t(r),r=r.next},v=function(e,t){var r=n({},t);if(function(e){return e.start}(e)){var a=[e.start,r,r];r.next=a[0],e.start.prev=a[1],e.start=a[2]}else e.start=r;return r};var y={prev:"next",next:"prev"},p=function(e,t){function r(e,r){var n=t[e],a=y[e];return n?(n[a]=t[a],r):t[a]}t.beenRemoved||(e.start=r("prev",e.start),r("next"),t.beenRemoved=!0)},g=function(e){var t=function(){var e,t={},r={};function a(n,a){t[n]=a,Object.defineProperty(r,n,{enumerable:!0,get:function(){var t;return e(n),null===(t=a.stateValue)||void 0===t?void 0:t.value},configurable:!1})}return{getStateValue:function(e){if(e in t)return t[e];var r={reactTriggersList:{}};return a(e,r),r},setStateValue:function(e,t){var r=n(n({},t),{},{reactTriggersList:{}});return a(e,r),r},getAccessMapHandler:function(){var t=[];return e=function(e){t.push(e)},{accessMapHandler:r,getKeysBeingAccessed:function(){return t}}},clearState:function(){t={},r={}}}}(),r=t.getStateValue,a=t.setStateValue,u=t.getAccessMapHandler,c=t.clearState;h(e);var o={},l=!1,y=!1,g=[],b=[],m=function(){d(o,(function(e){(0,e.removeTriggerFromKeyList)()})),o={}};return{getValue:function(e){var t;return null===(t=r(e).stateValue)||void 0===t?void 0:t.value},getStateUsingSelector:function(e){return e(u().accessMapHandler)},setValue:function(e){var t=e.key,n=e.needToCalculateValue,a=e.lastInSeries,i=r(t),u=i.stateValue,c=n?f(e.valueToCalculate)?e.valueToCalculate(null==u?void 0:u.value):e.valueToCalculate:e.value;i.stateValue={value:c},!i.reactTriggersList.start||i.reactTriggersList.triggersFired||u&&Object.is(u.value,c)||(i.reactTriggersList.triggersFired=!0,b.push((function(){i.reactTriggersList.triggersFired=!1})),d(i.reactTriggersList,(function(e){e.trigger.addToTriggersBatchPool()}))),a&&(b.forEach((function(e){return e()})),b=[])},resetValue:function(e){c(),h(e),o={},l=!1,y=!1,g=[]},reactSubscribeState:function(e,t,n){var a,i,c=!1,l=!1,s=[];if(n){var y=Object.fromEntries(n.map((function(e){var t,n=e.key,a=e.needToCalculateValue,i=r(n);return i.stateValue||!a&&void 0===e.initValue||(i.stateValue={value:a?f(e.initValueToCalculate)?e.initValueToCalculate():e.initValueToCalculate:e.initValue},d(i.reactTriggersList,(function(e){var t=e.trigger;g.push((function(){t.fire()}))}))),s.push(V(i)),[n,null===(t=i.stateValue)||void 0===t?void 0:t.value]})));i=t(y)}else{var m=u(),h=m.accessMapHandler,T=m.getKeysBeingAccessed;i=t(h),T().forEach((function(e){var t=r(e);s.push(V(t))}))}var S,k=function(){s.forEach((function(e){e()})),s=[]};return null===(a=null)||void 0===a||a(),{retrieveValue:function(){if(c){c=!1;var e=u().accessMapHandler;i=t(e)}return i},unsubscribe:k,addToWatchList:function(){return S=v(o,{removeTriggerFromKeyList:k}),{removeFromWatchList:function(){p(o,S)}}}};function V(t){var r=function(){c||(c=!0,e())},n=v(t.reactTriggersList,{trigger:{fire:r,addToTriggersBatchPool:function(){l||(l=!0,b.push(r,(function(){l=!1})))}}});return function(){p(t.reactTriggersList,n)}}},proceedWatchList:m,reactRenderTask:function(){l||(l=!0,y=!1,m())},reactEffectTask:function(){y||(y=!0,l=!1,g.forEach((function(e){return e()})),g=[])}};function h(e){e&&s(e).forEach((function(e){var t=i(e,2),r=t[0],n=t[1];void 0!==n&&a(r,{stateValue:{value:n}})}))}};function b(e){return"number"==typeof e?"".concat(e):e}function m(e){return Array.isArray(e)}e.initInterstate=function(e){var r=g(e),n=r.getValue,a=r.setValue,u=r.resetValue,c=r.getStateUsingSelector,o=r.reactSubscribeState,f=r.proceedWatchList,d=r.reactRenderTask,v=r.reactEffectTask,y=function(){return h(T.apply(void 0,arguments))};y.acceptSelector=function(e,t){return h({interfaceType:"selector",selector:e,deps:t})};var p=function(e){return m(e)?Object.fromEntries(e.map((function(e){return[e,n(b(e))]}))):n(b(e))};return p.acceptSelector=function(e){return c(e)},{useInterstate:y,setInterstate:function(e,t){switch(f(),typeof e){case"object":s(e).forEach((function(e,t,r){var n=i(e,2),u=n[0],c=n[1];a({key:u,value:c,lastInSeries:t===r.length-1})}));break;case"function":s(c(e)).forEach((function(e,t,r){var n=i(e,2),u=n[0],c=n[1];a({key:u,value:c,lastInSeries:t===r.length-1})}));break;default:a({key:b(e),valueToCalculate:t,needToCalculateValue:!0,lastInSeries:!0})}},readInterstate:p,resetInterstate:u};function h(e){d(),t.useEffect(v);var r=t.useState((function(){var e,r,u,c,s,f=(s=!0,function(n){var a=i(t.useState({}),2)[1];if(n){var l;null===(l=r)||void 0===l||l();var f=n.takeStateAndCalculateValue,d=n.initRecords,v=o((function(){a({})}),f,d);if(e=v.retrieveValue,r=v.unsubscribe,u=v.addToWatchList,s){var y=u();c=y.removeFromWatchList}}return t.useEffect((function(){s&&c(),s=!1}),[s]),t.useEffect((function(){return function(){r()}}),[]),e()}),d=function(){return{determination:!0}};return{useInRender:function(e){var t=null,r=d(e),i=r.determination,u=r.calculatedKeys;if(i)switch(e.interfaceType){case"single key":var c=b(e.key),o=e.initParam;d=function(t){return{determination:"single key"!==t.interfaceType||t.key!==e.key}},t={takeStateAndCalculateValue:function(e){return e[c]},initRecords:[void 0===o?{key:c}:{key:c,initValueToCalculate:o,needToCalculateValue:!0}]};break;case"keys list":var s=new Set(e.keys),v=e.keys.map((function(e){return{key:b(e)}}));d=function(e){return{determination:"keys list"!==e.interfaceType||e.keys.length!==s.size||e.keys.some((function(e){return!s.has(e)}))}},t={takeStateAndCalculateValue:n(v),initRecords:v};break;case"object interface":var y=e.initState,p=null!=u?u:l(y),g=new Set(p),m=p.map((function(e){return{key:e,initValue:y[e]}}));d=function(e){if("object interface"===e.interfaceType){var t=l(e.initState);return{determination:t.length!==g.size||t.some((function(e){return!g.has(e)})),calculatedKeys:t}}return{determination:!0}},t={takeStateAndCalculateValue:n(m),initRecords:m};break;case"function interface":var h=e.createInitState(),T=l(h).map((function(e){return{key:e,initValue:h[e]}}));d=a(e.deps,"function interface"),t={takeStateAndCalculateValue:n(T),initRecords:T};break;case"selector":d=a(e.deps,"selector"),t={takeStateAndCalculateValue:e.selector}}return f(t)}}}));return(0,i(r,1)[0].useInRender)(e);function n(e){return function(t){return Object.fromEntries(e.map((function(e){var r=e.key;return[r,t[r]]})))}}function a(e,t){return e?function(r){return{determination:r.interfaceType!==t||!r.deps||r.deps.length!==e.length||r.deps.some((function(t,r){return!Object.is(t,e[r])}))}}:function(){return{determination:!0}}}}function T(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],a=t[1];switch(typeof n){case"object":return m(n)?{interfaceType:"keys list",keys:n}:{interfaceType:"object interface",initState:n};case"function":return{interfaceType:"function interface",createInitState:n,deps:a};default:return{interfaceType:"single key",key:n,initParam:a}}}},Object.defineProperty(e,"__esModule",{value:!0})}));