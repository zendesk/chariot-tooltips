(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _tutorial = require('./tutorial');

var _tutorial2 = _interopRequireDefault(_tutorial);

var Chariot = (function () {
  function Chariot(config) {
    _classCallCheck(this, Chariot);

    self.tutorials = {};
    readConfig(config);
  }

  Chariot.prototype.readConfig = function readConfig(config) {
    if (!config.tutorials || typeof config.tutorials !== Object) {
      throw new Error('Config must contains a tutorials Array');
    }
    for (var _iterator = config.tutorials, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _tutorialName = _ref;

      self.tutorials[_tutorialName] = new _tutorial2['default'](_tutorialName, config.tutorials[_tutorialName]);
    }
  };

  Chariot.prototype.startTutorial = function startTutorial(name) {
    self.tutorials[tutorialName].start();
  };

  Chariot.prototype.listenForPushState = function listenForPushState() {
    // override pushState to listen for url
    // sample url to listen for: agent/tickets/1?tutorial=ticketing
    var pushState = history.pushState;
    history.pushState = function (state) {
      parameter = QueryParse.toObject(window.location.search);
      if (parameter['tutorial'] && config) {
        this.startTutorial(name);
      }
      return pushState.apply(history, arguments);
    };
  };

  return Chariot;
})();

exports.Tut = Tut;

},{"./tutorial":4}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chariot = require('./chariot');

var _chariot2 = _interopRequireDefault(_chariot);

var _queryParse = require('query-parse');

var _queryParse2 = _interopRequireDefault(_queryParse);

},{"./chariot":1,"query-parse":8}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Step = (function () {
	function Step() {
		var config = arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Step);

		self.elem = config.elem;
		self.text = config.text;
		self.before = typeof before == Function ? before : function () {};
		self.tooltip = config.tooltip;
		self.cta = config.cta || "Next";
	}

	Step.prototype.render = function render() {};

	Step.prototype.next = function next() {};

	Step.prototype.overlay = function overlay(elem) {
		var clone = $(ele).clone(),
		    style = document.defaultView.getComputedStyle($(ele)[0], "").cssText,
		    overlay = $("<div class='overlay'></div>"),
		    left = $(ele).offset().left,
		    top = $(ele).offset().top;

		clone[0].style.cssText = style;
		//clone.css({'z-index': 20, position:'absolute', top: top, left, left});
		clone.css({ "z-index": 20, position: "absolute" });
		clone.offset($(ele).offset());
		overlay.css({ top: 0, left: 0, background: "black", "z-index": 10, opacity: 0.5, position: "absolute", height: "1000px", width: "100%" });
		$("body").append(clone);
		$("body").append(overlay);
	};

	return Step;
})();

exports.Step = Step;

},{}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _step = require('./step');

var _step2 = _interopRequireDefault(_step);

var Tutorial = (function () {
	function Tutorial(name, config) {
		_classCallCheck(this, Tutorial);

		this.name = name;
		this.steps = [];
		if (typeof config.steps == Array) {
			for (var _iterator = config.steps, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var step = _ref;

				this.steps.push(new _step2['default'](config.step));
			}
		}
	}

	Tutorial.prototype.start = function start() {};

	return Tutorial;
})();

exports.Tutorial = Tutorial;

},{"./step":3}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],6:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],7:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":5,"./encode":6}],8:[function(require,module,exports){
var querystring = require('querystring');

var qp = {
  toString: function (params) {
    var str = '';
    Object.keys(params).forEach(function (key) {
      if (params[key] !== undefined) {
        if (str !== '') {
          str += '&';
        }
        
        str += key + '=' + encodeURIComponent(params[key]);
      }
    });
    
    return str;
  },
  
  toObject: function (str) {
    return querystring.parse(str);
  }
};

//
module.exports = qp;
},{"querystring":7}]},{},[2]);
