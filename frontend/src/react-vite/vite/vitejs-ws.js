!function(e,t){process.$vite_WS=t()}(this,(function(){return(()=>{var e={284:e=>{var t=function(){if("object"==typeof self&&self)return self;if("object"==typeof window&&window)return window;throw new Error("Unable to resolve global `this`")};e.exports=function(){if(this)return this;if("object"==typeof globalThis&&globalThis)return globalThis;try{Object.defineProperty(Object.prototype,"__global__",{get:function(){return this},configurable:!0})}catch(e){return t()}try{return __global__||t()}finally{delete Object.prototype.__global__}}()},3995:(e,t,n)=>{"use strict";n.r(t),n.d(t,{ErrorObject:()=>a,JsonRpc:()=>i,JsonRpcError:()=>f,JsonRpcParsed:()=>l,NotificationObject:()=>c,RequestObject:()=>s,SuccessObject:()=>u,default:()=>j,error:()=>y,jsonrpc:()=>S,notification:()=>d,parse:()=>b,parseJsonRpcObject:()=>v,parseJsonRpcString:()=>m,parseObject:()=>_,request:()=>p,success:()=>h});const r=Object.prototype.hasOwnProperty,o="function"==typeof Number.isSafeInteger?Number.isSafeInteger:function(e){return"number"==typeof e&&isFinite(e)&&e===Math.floor(e)&&Math.abs(e)<=9007199254740991};class i{constructor(){this.jsonrpc="2.0"}serialize(){return JSON.stringify(this)}}i.VERSION="2.0";class s extends i{constructor(e,t,n){super(),this.id=e,this.method=t,void 0!==n&&(this.params=n)}}class c extends i{constructor(e,t){super(),this.method=e,void 0!==t&&(this.params=t)}}class u extends i{constructor(e,t){super(),this.id=e,this.result=t}}class a extends i{constructor(e,t){super(),this.id=e,this.error=t,this.id=e,this.error=t}}class l{constructor(e,t){this.payload=e,this.type=t,this.payload=e,this.type=t}}class f{constructor(e,t,n){this.message=e,this.code=o(t)?t:0,null!=n&&(this.data=n)}}function p(e,t,n){const r=new s(e,t,n);return O(r,!0),r}function d(e,t){const n=new c(e,t);return O(n,!0),n}function h(e,t){const n=new u(e,t);return O(n,!0),n}function y(e,t){const n=new a(e,t);return O(n,!0),n}function b(e){if(!E(e))return new l(f.invalidRequest(e),"invalid");let t;try{t=JSON.parse(e)}catch(t){return new l(f.parseError(e),"invalid")}return v(t)}function v(e){if(!Array.isArray(e))return _(e);if(0===e.length)return new l(f.invalidRequest(e),"invalid");const t=[];for(let n=0,r=e.length;n<r;n++)t[n]=_(e[n]);return t}f.invalidRequest=function(e){return new f("Invalid request",-32600,e)},f.methodNotFound=function(e){return new f("Method not found",-32601,e)},f.invalidParams=function(e){return new f("Invalid params",-32602,e)},f.internalError=function(e){return new f("Internal error",-32603,e)},f.parseError=function(e){return new f("Parse error",-32700,e)};const m=b;function _(e){let t=null,n=null,o="invalid";if(null==e||e.jsonrpc!==i.VERSION)t=f.invalidRequest(e),o="invalid";else if(r.call(e,"id")){if(r.call(e,"method")){const r=e;n=new s(r.id,r.method,r.params),t=O(n),o="request"}else if(r.call(e,"result")){const r=e;n=new u(r.id,r.result),t=O(n),o="success"}else if(r.call(e,"error")){const r=e;if(o="error",null==r.error)t=f.internalError(r);else{const e=new f(r.error.message,r.error.code,r.error.data);e.message!==r.error.message||e.code!==r.error.code?t=f.internalError(r):(n=new a(r.id,e),t=O(n))}}}else{const r=e;n=new c(r.method,r.params),t=O(n),o="notification"}return null==t&&null!=n?new l(n,o):new l(null!=t?t:f.invalidRequest(e),"invalid")}function O(e,t){let n=null;if(e instanceof s?(n=g(e.id),null==n&&(n=w(e.method)),null==n&&(n=R(e.params))):e instanceof c?(n=w(e.method),null==n&&(n=R(e.params))):e instanceof u?(n=g(e.id),null==n&&(n=void 0===e.result?f.internalError("Result must exist for success Response objects"):null)):e instanceof a&&(n=g(e.id,!0),null==n&&(n=function(e){return e instanceof f?o(e.code)?E(e.message)?null:f.internalError("Message must exist or must be a string."):f.internalError("Invalid error code. It must be an integer."):f.internalError("Error must be an instance of JsonRpcError")}(e.error))),t&&null!=n)throw n;return n}function g(e,t){return t&&null===e||E(e)||o(e)?null:f.internalError('"id" must be provided, a string or an integer.')}function w(e){return E(e)?null:f.invalidRequest(e)}function R(e){if(void 0===e)return null;if(Array.isArray(e)||null!=(t=e)&&"object"==typeof t&&!Array.isArray(t))try{return JSON.stringify(e),null}catch(t){return f.parseError(e)}var t;return f.invalidParams(e)}function E(e){return""!==e&&"string"==typeof e}const S={JsonRpc:i,JsonRpcError:f,request:p,notification:d,success:h,error:y,parse:b,parseObject:_,parseJsonRpcObject:v,parseJsonRpcString:b},j=S},45840:(e,t,n)=>{var r;if("object"==typeof globalThis)r=globalThis;else try{r=n(284)}catch(e){}finally{if(r||"undefined"==typeof window||(r=window),!r)throw new Error("Could not determine global this")}var o=r.WebSocket||r.MozWebSocket,i=n(79387);function s(e,t){return t?new o(e,t):new o(e)}o&&["CONNECTING","OPEN","CLOSING","CLOSED"].forEach((function(e){Object.defineProperty(s,e,{get:function(){return o[e]}})})),e.exports={w3cwebsocket:o?s:null,version:i}},79387:(e,t,n)=>{e.exports=n(19794).version},19794:e=>{"use strict";e.exports={version:"1.0.34"}}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};return(()=>{"use strict";n.r(r),n.d(r,{WS_RPC:()=>g,default:()=>w});const e={CONNECT:function(e){return new Error("CONNECTION ERROR: Couldn't connect to node ".concat(e,"."))},ABORT:function(){return new Error("ABORT ERROR: Request already aborted.")},PARAMS:function(){return new Error("PARAMS ERROR.")},TIMEOUT:function(e){return new Error("CONNECTION TIMEOUT: timeout of ".concat(e," ms achived"))},INVAILID_RESPONSE:function(e){return new Error("Invalid JSON RPC response: ".concat(JSON.stringify(e)))},IPC_ON:function(e){return new Error("Invalid IPC event on: ".concat(JSON.stringify(e)))},IPC_ON_CB:function(e){return new Error("The IPC on event ".concat(JSON.stringify(e),", cb is necessary"))}};function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var o=n(3995),i=function(){function n(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n),this.ERRORS=e,this.jsonrpc=o,this._requestManager={},this._requestId=0}var r,i;return r=n,i=[{key:"abort",value:function(){var e=this;Object.values(this._requestManager).forEach((function(t){var n=t.request,r=t.rej;n.abort(),r(e.ERRORS.ABORT())})),this._requestManager={}}},{key:"_addReq",value:function(e){var t=e.request,n={request:t,rej:e.rej};return this._requestManager[t.id]=n,n}},{key:"_removeReq",value:function(e){delete this._requestManager[e.request.id]}},{key:"_getRequestPayload",value:function(t,n){return t?(this._requestId++,this.jsonrpc.request(this._requestId,t,n)):e.PARAMS()}},{key:"_getNotificationPayload",value:function(t,n){return t?this.jsonrpc.notification(t,n):e.PARAMS()}},{key:"_getBatchPayload",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];if(!t||!t.length)return e.PARAMS();for(var n=[],r=0;r<t.length;r++){var o=t[r];if(!o||!o.type||"request"!==o.type&&"notification"!==o.type)return e.PARAMS();var i="notification"===o.type?this._getNotificationPayload(o.methodName,o.params):this._getRequestPayload(o.methodName,o.params);if(i instanceof Error)return i;n.push(i)}return n}}],i&&t(r.prototype,i),Object.defineProperty(r,"prototype",{writable:!1}),n}();function s(e){return s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s(e)}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,t){return u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},u(e,t)}function a(e,t){if(t&&("object"===s(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function l(e){return l=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},l(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&u(e,t)}(s,e);var t,n,r,o,i=(r=s,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=l(r);if(o){var n=l(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return a(this,e)});function s(e){var t,n=e.onEventTypes,r=e.sendFuncName,o=e.path;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s),(t=i.call(this)).path=o,t._onEventTypes=n||[],t._sendFuncName=r,t.connectStatus=!1,t.responseCbs={},t._connectEnd=null,t._connectError=null,t._connectTimeout=null,t._connectConnect=null,t._connectClose=null,t.subscribeMethod=null,t}return t=s,n=[{key:"_connected",value:function(){this.connectStatus=!0,this._connectConnect&&this._connectConnect()}},{key:"_closed",value:function(){this.connectStatus=!1,this._connectClose&&this._connectClose()}},{key:"_errored",value:function(e){this._connectError&&this._connectError(e)}},{key:"_parse",value:function(e){var t=this,n=[];e.forEach((function(e){if(e)try{var t=JSON.parse(e);if(!(t instanceof Array)&&t.result)try{t.result=JSON.parse(t.result)}catch(e){}n.push(t)}catch(e){}})),n.forEach((function(e){if(e instanceof Array||e.id)if(e.id)t.responseCbs[e.id]&&t.responseCbs[e.id](e);else for(var n=0;n<e.length;n++)if(e[n].id){var r=e[n].id;t.responseCbs[r]&&t.responseCbs[r](e)}else t.subscribeMethod&&t.subscribeMethod(e[n]);else t.subscribeMethod&&t.subscribeMethod(e)}))}},{key:"_checkOnType",value:function(e){if(this._onEventTypes.indexOf(e)<0)return!1;var t=e.substring(0,1).toUpperCase()+e.substring(1);return"_connect".concat(t)}},{key:"_onSend",value:function(e){var t=this,n=function(e){var t;if(e instanceof Array){for(var n=0;n<e.length;n++)if(e[n].id){t=e[n].id;break}}else t=e.id||null;return t}(e);if(n)return new Promise((function(e,r){var o=!1,i={id:n,abort:function(){o=!0}};t.responseCbs[n]=function(t){if(c(),t&&t.error)return r(t);e(t)};var s=t._addReq({request:i,rej:function(e){c(),r(e)}}),c=function(){for(var e in u&&clearTimeout(u),u=null,t._removeReq(s),t.responseCbs)if(e===String(n)){delete t.responseCbs[e];break}},u=t.timeout?setTimeout((function(){if(!o)return c(),r(t.ERRORS.TIMEOUT(t.timeout))}),t.timeout):null}))}},{key:"_send",value:function(e){return this.connectStatus?(this.socket[this._sendFuncName](JSON.stringify(e)),this._onSend(e)):Promise.reject(this.ERRORS.CONNECT(this.path))}},{key:"on",value:function(e,t){var n=this._checkOnType(e);return n?t?void(this[n]=t):this.ERRORS.IPC_ON_CB(e):this.ERRORS.IPC_ON(e)}},{key:"remove",value:function(e){var t=this._checkOnType(e);t&&(this[t]=null)}},{key:"request",value:function(e,t){var n=this._getRequestPayload(e,t);return n instanceof Error?Promise.reject(n):this._send(n)}},{key:"sendNotification",value:function(e,t){var n=this._getNotificationPayload(e,t);if(n instanceof Error)return n;this._send(n)}},{key:"batch",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=this._getBatchPayload(e);return t instanceof Error?Promise.reject(t):this._send(t)}},{key:"subscribe",value:function(e){if("function"!=typeof e)throw new Error("[Error] callback should be a function.");this.subscribeMethod=e}},{key:"unsubscribe",value:function(){this.subscribeMethod=null}}],n&&c(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),s}(i);const p=f;function d(e){return d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},d(e)}function h(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function y(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function b(e,t){return b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},b(e,t)}function v(e,t){if(t&&("object"===d(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function m(e){return m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},m(e)}var _=n(45840).w3cwebsocket,O=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&b(e,t)}(s,e);var t,n,r,o,i=(r=s,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=m(r);if(o){var n=m(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return v(this,e)});function s(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"ws://localhost:31420",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:6e4,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{protocol:"",headers:"",clientConfig:"",retryTimes:10,retryInterval:1e4};if(h(this,s),e=i.call(this,{onEventTypes:["error","close","connect"],sendFuncName:"send",path:t}),!t)throw e.ERRORS.CONNECT(t);e.timeout=n,e.protocol=r.protocol,e.headers=r.headers,e.clientConfig=r.clientConfig,e._timeout=null,e._destroyed=!1,e.reconnect();var o=0;return e.on("connect",(function(){o=0})),e.on("close",(function(){o>r.retryTimes||(e._timeout=setTimeout((function(){o++,e.reconnect()}),r.retryInterval))})),e}return t=s,(n=[{key:"reconnect",value:function(){var e=this;this._destroyed||(this.disconnect(),this.socket=new _(this.path,this.protocol,null,this.headers,null,this.clientConfig),this.socket.onopen=function(){e.socket.readyState===e.socket.OPEN&&e._connected()},this.socket.onclose=function(){e._closed()},this.socket.onerror=function(t){e._errored(t)},this.socket.onmessage=function(t){var n="string"==typeof t.data?t.data:"";e._parse([n])})}},{key:"disconnect",value:function(){this.socket&&this.socket.close&&this.socket.close(),clearTimeout(this._timeout),this.socket=null}},{key:"destroy",value:function(){this.disconnect(),this.remove("error"),this.remove("close"),this.remove("connect"),this._destroyed=!0}}])&&y(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),s}(p),g=O;const w=O})(),r})()}));