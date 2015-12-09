/**
 * Chariot v1.0.15 - A JavaScript library for creating beautiful in product tutorials
 *
 * https://github.com/zendesk/chariot
 *
 * Copyright 2015 Zendesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global
history, location
*/

/* Please refer to /example/config.example.js to see how config is structured */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _tutorial = require('./tutorial');

var _tutorial2 = _interopRequireDefault(_tutorial);

var _queryParse = require('query-parse');

var _queryParse2 = _interopRequireDefault(_queryParse);

require('./ie-shim');
var initialState = true;

var Chariot = (function () {
  /**
   * The master Chariot configuration dictionary can consist of multiple
   *  tutorial configurations.
   * @typedef ChariotConfiguration
   * @property {Object.<string, TutorialConfig>} config - The main configuration
   *  containing all tutorials.
   *
   */

  /**
   * The delegate optionally responds to lifecycle callbacks from Chariot.
   * @typedef ChariotDelegate
   * @property {Object} delegate - The object that responds to the
   *  following lifecycle callbacks.
   *
   * willBeginTutorial -> (willBeginStep -> willRenderOverlay -> didShowOverlay
   * -> willRenderTooltip -> didRenderTooltip -> didFinishStep) (repeat # steps)
   * -> didFinishTutorial
   *
   *
   * Called once before a tutorial begins.
   * @callback willBeginTutorial
   * @param {Tutorial} tutorial - The Tutorial object
   *
   * Called once after a tutorial is finished.
   * @callback didFinishTutorial tutorial
   * @param {Tutorial} tutorial - The Tutorial object
   * @param {boolean} forced - Indicates whether tutorial was forced to end
   *
   * Called once before each step begins.
   * Return a promise here if you have async callbacks you want resolved before
   * continuing.
   * @callback willBeginStep
   * @param {Step} step - The current Step object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   * @returns {Promise} [promise] Return a promise if you have async callbacks
   * that must be resolved before continuing.
   *
   * Called once after each step is finished.
   * @callback didFinishStep
   * @param {Step} step - The current Step object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   *
   * Called once before each overlay is shown.
   * @callback willShowOverlay
   * @param {Overlay} overlay - The current Overlay object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   *
   * Called once after each overlay is shown.
   * @callback didShowOverlay
   * @param {Overlay} overlay - The current Overlay object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   *
   * Called once before each tooltip is rendered.
   * @callback willRenderTooltip
   * @param {Tooltip} tooltip - The current Tooltip object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   *
   * Called once after each tooltip is rendered.
   * @callback didRenderTooltip
   * @param {Tooltip} tooltip - The current Tooltip object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   *
   */

  /**
   * @constructor
   * @param {ChariotConfiguration} config - The main configuration for all
   *  tutorials
   * @param {ChariotDelegate} [delegate] - An optional delegate that responds to
   *  lifecycle callbacks
   */

  function Chariot(config, delegate) {
    _classCallCheck(this, Chariot);

    this.config = config;
    this.delegate = delegate;
    this.tutorials = {};
    this._readConfig(config);
    this._listenForPushState();
  }

  /**
   * Sets the chariot delegate.
   * @param {ChariotDelegate} [delegate] - An object that responds to
   *  lifecycle callbacks
   */

  _createClass(Chariot, [{
    key: 'setDelegate',
    value: function setDelegate(delegate) {
      this.delegate = delegate;
    }

    /**
     * Starts a tutorial with the given name.
     * Won't start a tutorial if one is currently running.
     * @param {string} name - Name of the tutorial to start
     * @returns {Tutorial} tutorial - The Tutorial object, or undefined if
     *  another tutorial is currently active.
     */
  }, {
    key: 'startTutorial',
    value: function startTutorial(name) {
      if (this.currentTutorial()) {
        return;
      }
      var tutorial = this.tutorials[name];
      tutorial.start();
      return tutorial;
    }

    /**
     * Ends the current tutorial.
     * @returns {undefined}
     */
  }, {
    key: 'endTutorial',
    value: function endTutorial() {
      var tutorial = this.currentTutorial();
      tutorial.end(true);
    }

    /**
     * Returns the current tutorial, if any.
     * @returns {Tutorial} tutorial - The current tutorial, or null if none active
     */
  }, {
    key: 'currentTutorial',
    value: function currentTutorial() {
      for (var tutorialName in this.tutorials) {
        var tutorial = this.tutorials[tutorialName];
        if (tutorial.isActive()) return tutorial;
      }
    }

    /**
     * Static method for creating a Tutorial object without needing to instantiate
     * chariot with a large configuration and named tutorials.
     * @param {TutorialConfiguration} config - The tutorial configuration
     * @param {ChariotDelegate} [delegate] - An optional delegate that responds to
     *  lifecycle callbacks
     */
  }, {
    key: 'toString',
    value: function toString() {
      return '[Chariot - config: ' + this.config + ', tutorials: {this.tutorials}]';
    }

    //// PRIVATE

  }, {
    key: '_readConfig',
    value: function _readConfig(config) {
      if (!config || typeof config !== 'object') {
        throw new Error('Config must contains a tutorials hash.\n' + this);
      }
      for (var tutorialName in config) {
        this.tutorials[tutorialName] = new _tutorial2['default'](config[tutorialName], tutorialName, this.delegate);
      }
    }
  }, {
    key: '_listenForPushState',
    value: function _listenForPushState() {
      var _this = this,
          _arguments = arguments;

      // override pushState to listen for url
      // sample url to listen for: agent/tickets/1?tutorial=ticketing
      var processGetParams = function processGetParams() {
        var parameter = _queryParse2['default'].toObject(window.location.search);
        var match = location.hash.match(/\?.*tutorial=([^&]*)/);
        var tutorialName = parameter['?tutorial'] || (match ? match[1] : null);
        if (tutorialName) {
          _this.startTutorial(tutorialName);
        }
      };

      var pushState = history.pushState;
      history.pushState = function (state) {
        initialState = false;
        var res = null;
        if (typeof pushState === 'function') {
          res = pushState.apply(history, arguments);
        }
        processGetParams();
        return res;
      };

      var replaceState = history.replaceState;
      history.replaceState = function (state) {
        initialState = false;
        var res = null;
        if (typeof replaceState === 'function') {
          res = replaceState.apply(history, arguments);
        }
        processGetParams();
        return res;
      };

      window.addEventListener('hashchange', function (argument) {
        var tutorial = _this.currentTutorial();
        if (tutorial) {
          tutorial.tearDown();
        }
        processGetParams();
      });

      var popState = window.onpopstate;
      window.onpopstate = function () {
        if (initialState) return;
        var res = null;
        if (typeof popState === 'function') {
          res = popState.apply(_arguments);
        }
        var tutorial = _this.currentTutorial();
        if (tutorial) {
          tutorial.tearDown();
        }
        processGetParams();
        return res;
      };

      if (!navigator.userAgent.match(/msie 9/i)) {
        processGetParams();
      }
    }
  }], [{
    key: 'createTutorial',
    value: function createTutorial(config, delegate) {
      return new _tutorial2['default'](config, '', delegate);
    }
  }]);

  return Chariot;
})();

exports['default'] = Chariot;
module.exports = exports['default'];

},{"./ie-shim":3,"./tutorial":9,"query-parse":17}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var OVERLAY_Z_INDEX = 20;
var CLONE_Z_INDEX = OVERLAY_Z_INDEX + 1;
var TOOLTIP_Z_INDEX = CLONE_Z_INDEX + 1;

exports.OVERLAY_Z_INDEX = OVERLAY_Z_INDEX;
exports.CLONE_Z_INDEX = CLONE_Z_INDEX;
exports.TOOLTIP_Z_INDEX = TOOLTIP_Z_INDEX;

},{}],3:[function(require,module,exports){
// this shim is to fix IE & Firefox's problem where
// getComputedStyle(<element>).cssText returns an empty string rather than a
// string of computed CSS styles for the element
"use strict";

if (typeof navigator !== "undefined" && navigator.userAgent.match(/msie|windows|firefox/i)) {
  Node.prototype.getComputedCSSText = function () {
    var s = [];
    var cssTranslation = { "cssFloat": "float" };
    var computedStyle = document.defaultView.getComputedStyle(this);
    for (var propertyName in computedStyle) {
      if ("string" == typeof computedStyle[propertyName] && computedStyle[propertyName] != "") {
        var translatedName = cssTranslation[propertyName] || propertyName;
        s[s.length] = translatedName.replace(/[A-Z]/g, function (x) {
          return "-" + x.toLowerCase();
        }) + ": " + computedStyle[propertyName];
      }
    }

    return s.join('; ') + ";";
  };
}

},{}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chariot = require('./chariot');

var _chariot2 = _interopRequireDefault(_chariot);

window.Chariot = _chariot2['default'];

/**
 * Export for various environments.
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = _chariot2['default'];
} else if (typeof exports !== 'undefined') {
  exports.Chariot = _chariot2['default'];
} else if (typeof define === 'function' && define.amd) {
  define([], function () {
    return _chariot2['default'];
  });
} else {
  root.Chariot = _chariot2['default'];
}

},{"./chariot":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constants = require('./constants');

var Overlay = (function () {

  /**
   * @constructor
   * @public
   * isVisible(), resize()
   *
   */

  function Overlay(config) {
    _classCallCheck(this, Overlay);

    this.shouldOverlay = config.shouldOverlay === undefined ? true : config.shouldOverlay;
    this.overlayColor = config.overlayColor || 'rgba(255,255,255,0.8)';
    this.useTransparentOverlayStrategy = config.useTransparentOverlayStrategy;
    this._resizeHandler = null;
  }

  _createClass(Overlay, [{
    key: 'isVisible',
    value: function isVisible() {
      return this.shouldOverlay === false;
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.isVisible()) return;

      this.$document = $(document);
      var $body = $('body');
      var $overlay = this._createOverlay();
      $body.append($overlay);
      this.$overlay = $overlay;

      var $transparentOverlay = this._createTransparentOverlay();
      $body.append($transparentOverlay);
      this.$transparentOverlay = $transparentOverlay;
    }
  }, {
    key: 'isTransparentOverlayStrategy',
    value: function isTransparentOverlayStrategy() {
      return this.useTransparentOverlayStrategy;
    }

    // The following 2 methods are part of the "clone element" strategy

    /**
     * Shows a background overlay to obscure the main interface, and acts as the
     * background for the cloned elements involved in the tutorial.
     * This method is involved in the "clone element" strategy.
     */
  }, {
    key: 'showBackgroundOverlay',
    value: function showBackgroundOverlay() {
      // Remove the resize handler that might exist from focusOnElement
      // (Note: take care to not call this after cloning elements, because they
      //  have their own window resize handlers)
      var $window = $(window);

      this.$overlay.css({
        background: this.overlayColor,
        border: 'none'
      });

      this._resizeOverlayToFullScreen();
      this._resizeHandler = this._resizeOverlayToFullScreen.bind(this);
    }

    /**
     * Shows a transparent overlay to prevent user from interacting with cloned
     * elements.
     */
  }, {
    key: 'showTransparentOverlay',
    value: function showTransparentOverlay() {
      this.$transparentOverlay.show();
    }

    /**
     * Focuses on an element by resizing a transparent overlay to match its
     * dimensions and changes the borders to be colored to obscure the main UI.
     * This method is involved in the "transparent overlay" strategy.
     */
  }, {
    key: 'focusOnElement',
    value: function focusOnElement($element) {
      // Hide overlay from showTransparentOverlay
      this.$transparentOverlay.hide();

      this._resizeOverlayToElement($element);
      this._resizeHandler = this._resizeOverlayToElement.bind(this, $element);
    }
  }, {
    key: 'resize',
    value: function resize() {
      this._resizeHandler();
    }
  }, {
    key: 'tearDown',
    value: function tearDown() {
      this.$overlay.remove();
      if (this.$transparentOverlay) {
        this.$transparentOverlay.remove();
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[Overlay - shouldOverlay: ' + this.shouldOverlay + ', ' + ('overlayColor: ' + this.overlayColor + ']');
    }

    //// PRIVATE

  }, {
    key: '_createOverlay',
    value: function _createOverlay() {
      var $overlay = $("<div class='chariot-overlay'></div>");
      $overlay.css({ 'z-index': _constants.OVERLAY_Z_INDEX });
      return $overlay;
    }
  }, {
    key: '_createTransparentOverlay',
    value: function _createTransparentOverlay() {
      var $transparentOverlay = $("<div class='chariot-transparent-overlay'></div>");
      $transparentOverlay.css({
        'z-index': _constants.CLONE_Z_INDEX + 1
      });
      return $transparentOverlay;
    }

    // Used for clone element strategy
  }, {
    key: '_resizeOverlayToFullScreen',
    value: function _resizeOverlayToFullScreen() {
      this.$overlay.css({
        width: '100%',
        height: '100%'
      });
    }

    // Used for transparent overlay strategy
  }, {
    key: '_resizeOverlayToElement',
    value: function _resizeOverlayToElement($element) {
      // First position the overlay
      var offset = $element.offset();

      // Then resize it
      var borderStyles = 'solid ' + this.overlayColor;
      var $document = this.$document;
      var docWidth = $document.outerWidth();
      var docHeight = $document.outerHeight();

      var width = $element.outerWidth();
      var height = $element.outerHeight();

      var leftWidth = offset.left;
      var rightWidth = docWidth - (offset.left + width);
      var topWidth = offset.top;
      var bottomWidth = docHeight - (offset.top + height);

      this.$overlay.css({
        background: 'transparent',
        width: width, height: height,
        'border-left': leftWidth + 'px ' + borderStyles,
        'border-top': topWidth + 'px ' + borderStyles,
        'border-right': rightWidth + 'px ' + borderStyles,
        'border-bottom': bottomWidth + 'px ' + borderStyles
      });
    }
  }]);

  return Overlay;
})();

exports['default'] = Overlay;
module.exports = exports['default'];

},{"./constants":2}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashDebounce = require('lodash.debounce');

var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _constants = require('./constants');

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var MAX_ATTEMPTS = 100;
var DOM_QUERY_DELAY = 100;

var Promise = require('es6-promise').Promise;

var Step = (function () {

  /** The step configuration is where you specify which elements of the page will
   * be cloned and placed over the overlay.
   *
   * @typedef StepConfiguration
   * @property {TooltipConfiguration} tooltip - Tooltip configuration.
   * @property {Object.<string, string>} [selectors] - Contains arbitrarily-named
   *  keys with CSS selector values. These keys can be referenced from
   *  TooltipConfiguration.anchorElement.
   *  Note: Specifying a selector that lives within another specified selector will
   *  result in unpredictable behavior.
   */

  /**
   * @constructor
   * @param {StepConfiguration} config - The configuration for this step
   * @param {integer} index - The index of this step within the current tutorial
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   * @param {Overlay} overlay - The Overlay object displayed along with this
   *  Step
   * @param {ChariotDelegate} [delegate] - An optional delegate that responds to
   *  lifecycle callbacks
   */

  function Step(config, index, tutorial, overlay, delegate) {
    if (config === undefined) config = {};

    _classCallCheck(this, Step);

    this.tutorial = tutorial;
    this.index = index;
    this.overlay = overlay;
    this.delegate = delegate || {};
    if (!config.selectors || !Object.keys(config.selectors).length) {
      throw new Error('selectors must be present in Step configuration\n' + this);
    }
    this.selectors = config.selectors;
    this._resizeTimeout = null;

    this._elementMap = {};
    for (var selectorName in this.selectors) {
      this._elementMap[selectorName] = {};
    }

    this.tooltip = new _tooltip2['default'](config.tooltip, this, tutorial);
  }

  _createClass(Step, [{
    key: 'render',
    value: function render() {
      var _this = this;

      Promise.resolve().then(function () {
        if (_this.delegate.willBeginStep) {
          return _this.delegate.willBeginStep(_this, _this.index, _this.tutorial);
        }
      }).then(function () {
        if (_this.delegate.willShowOverlay) {
          return _this.delegate.willShowOverlay(_this.overlay, _this.index, _this.tutorial);
        }
      }).then(function () {
        // Show a temporary background overlay while we wait for elements
        _this.overlay.showBackgroundOverlay();
        return _this._waitForElements();
      }).then(function () {
        // Render the overlay
        if (_this.overlay.isTransparentOverlayStrategy() && Object.keys(_this.selectors).length === 1) {
          _this._singleTransparentOverlayStrategy();
        } else {
          _this._clonedElementStrategy();
        }
      }).then(function () {
        if (_this.delegate.didShowOverlay) {
          return _this.delegate.didShowOverlay(_this.overlay, _this.index, _this.tutorial);
        }
      }).then(function () {
        if (_this.delegate.willRenderTooltip) {
          return _this.delegate.willRenderTooltip(_this.tooltip, _this.index, _this.tutorial);
        }
      }).then(function () {
        _this._renderTooltip();
        if (_this.delegate.didRenderTooltip) {
          return _this.delegate.didRenderTooltip(_this.tooltip, _this.index, _this.tutorial);
        }
      }).then(function () {
        // Resize the overlay in case the tooltip extended the width/height of DOM
        _this.overlay.resize();

        // Setup resize handler
        _this._resizeHandler = (0, _lodashDebounce2['default'])(function () {
          for (var selectorName in _this.selectors) {
            var elementInfo = _this._elementMap[selectorName];
            if (elementInfo.clone) {
              var $element = elementInfo.element;
              var $clone = elementInfo.clone;
              _style2['default'].clearCachedStylesForElement($element);
              _this._applyComputedStyles($clone, $element);
              _this._positionClone($clone, $element);
            }
          }
          _this.tooltip.reposition();
          _this.overlay.resize();
        }, 50);
        $(window).on('resize', _this._resizeHandler);
      })['catch'](function (error) {
        console.log(error);
        _this.tutorial.tearDown();
      });
    }
  }, {
    key: 'next',
    value: function next() {
      var _this2 = this;

      Promise.resolve().then(function () {
        if (_this2.delegate.didFinishStep) {
          return _this2.delegate.didFinishStep(_this2, _this2.index, _this2.tutorial);
        }
      }).then(function () {
        _this2.tutorial.next(_this2);
      })['catch'](function (error) {
        console.log(error);
        _this2.tutorial.next(_this2);
      });
    }
  }, {
    key: 'getClonedElement',
    value: function getClonedElement(selectorName) {
      var elementInfo = this._elementMap[selectorName];
      if (!elementInfo) return;
      return elementInfo.clone;
    }
  }, {
    key: 'tearDown',
    value: function tearDown() {
      var $window = $(window);
      for (var selectorName in this.selectors) {
        var selector = this.selectors[selectorName];
        // Remove computed styles
        _style2['default'].clearCachedStylesForElement($(selector));
        var elementInfo = this._elementMap[selectorName];
        if (elementInfo.clone) {
          // Remove cloned elements
          elementInfo.clone.remove();
        }
      }
      this.tooltip.tearDown();

      $window.off('resize', this._resizeHandler);
    }
  }, {
    key: 'prepare',
    value: function prepare() {
      // FIX: This method currently always prepares for the clone strategy,
      // regardless of the value of useTransparentOverlayStrategy.
      // Perhaps add a check or rename this method, once the coupling to
      // this.tutorial.prepare() is removed
      for (var selectorName in this.selectors) {
        var selector = this.selectors[selectorName];
        this._computeStyles($(selector));
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[Step - index: ' + this.index + ', ' + ('selectors: ' + JSON.stringify(this.selectors) + ']');
    }

    //// PRIVATE

  }, {
    key: '_singleTransparentOverlayStrategy',
    value: function _singleTransparentOverlayStrategy() {
      // Only use an overlay
      var selectorName = Object.keys(this.selectors)[0];
      var $element = this._elementMap[selectorName].element;
      this.overlay.focusOnElement($element);
    }
  }, {
    key: '_clonedElementStrategy',
    value: function _clonedElementStrategy() {
      // Clone elements if multiple selectors
      this._cloneElements(this.selectors);
      this.overlay.showTransparentOverlay();
    }
  }, {
    key: '_renderTooltip',
    value: function _renderTooltip() {
      this.tooltip.render();
    }
  }, {
    key: '_waitForElements',
    value: function _waitForElements() {
      var _this3 = this;

      var promises = [];

      var _loop = function (selectorName) {
        var promise = new Promise(function (resolve, reject) {
          _this3._waitForElement(selectorName, 0, resolve, reject);
        });
        promises.push(promise);
      };

      for (var selectorName in this.selectors) {
        _loop(selectorName);
      }

      return Promise.all(promises);
    }
  }, {
    key: '_waitForElement',
    value: function _waitForElement(selectorName, numAttempts, resolve, reject) {
      var _this4 = this;

      var selector = this.selectors[selectorName];
      var element = $(selector);
      if (element.length == 0) {
        ++numAttempts;
        if (numAttempts == MAX_ATTEMPTS) {
          reject('Selector not found: ' + selector);
        } else {
          window.setTimeout(function () {
            _this4._waitForElement(selectorName, numAttempts, resolve, reject);
          }, DOM_QUERY_DELAY);
        }
      } else {
        this._elementMap[selectorName].element = element;
        resolve();

        // TODO: fire event when element is ready. Tutorial will listen and call
        // prepare() on all steps
      }
    }
  }, {
    key: '_computeStyles',
    value: function _computeStyles($element) {
      var _this5 = this;

      _style2['default'].getComputedStylesFor($element[0]);
      $element.children().toArray().forEach(function (child) {
        _this5._computeStyles($(child));
      });
    }
  }, {
    key: '_cloneElements',
    value: function _cloneElements(selectors) {
      var _this6 = this;

      if (this.overlay.isVisible()) return;

      setTimeout(function () {
        _this6.tutorial.prepare();
      }, 0);
      for (var selectorName in selectors) {
        var clone = this._cloneElement(selectorName);
        this._elementMap[selectorName].clone = clone;
      }
    }
  }, {
    key: '_cloneElement',
    value: function _cloneElement(selectorName) {
      var $element = this._elementMap[selectorName].element;
      if ($element.length == 0) {
        return null;
      }

      var $clone = $element.clone();
      $('body').append($clone);
      this._applyComputedStyles($clone, $element);
      this._positionClone($clone, $element);

      return $clone;
    }
  }, {
    key: '_applyComputedStyles',
    value: function _applyComputedStyles($clone, $element) {
      var _this7 = this;

      if (!$element.is(":visible")) {
        return;
      }
      $clone.addClass('chariot-clone');
      _style2['default'].cloneStyles($element, $clone);
      var clonedChildren = $clone.children().toArray();
      $element.children().toArray().forEach(function (child, index) {
        _this7._applyComputedStyles($(clonedChildren[index]), $(child));
      });
    }
  }, {
    key: '_positionClone',
    value: function _positionClone($clone, $element) {
      $clone.css({
        'z-index': _constants.CLONE_Z_INDEX,
        position: 'absolute'
      });
      $clone.offset($element.offset());
    }
  }]);

  return Step;
})();

exports['default'] = Step;
module.exports = exports['default'];

},{"./constants":2,"./style":7,"./tooltip":8,"es6-promise":14,"lodash.debounce":15}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CHARIOT_COMPUTED_STYLE_CLASS_PREFIX = 'chariot_computed_styles';

var Style = (function () {
  function Style() {
    _classCallCheck(this, Style);
  }

  _createClass(Style, null, [{
    key: 'calculateLeft',
    value: function calculateLeft($tooltip, $anchor, xOffsetTooltip, position, arrowOffset) {
      var offset = 0;
      switch (position) {
        case 'left':
          offset = $anchor.offset().left - $tooltip.outerWidth() + xOffsetTooltip - arrowOffset;
          break;
        case 'right':
          offset = $anchor.offset().left + $anchor.outerWidth() + xOffsetTooltip + arrowOffset;
          break;
        case 'top':
        case 'bottom':
          offset = $anchor.offset().left + $anchor.outerWidth() / 2 - $tooltip.outerWidth() / 2 + xOffsetTooltip;
          break;
        default:
          break;
      }
      return offset;
    }
  }, {
    key: 'calculateTop',
    value: function calculateTop($tooltip, $anchor, yOffsetTooltip, position, arrowOffset) {
      var offset = 0;
      switch (position) {
        case 'top':
          offset = $anchor.offset().top - $tooltip.outerHeight() + yOffsetTooltip - arrowOffset;
          break;
        case 'bottom':
          offset = $anchor.offset().top + $anchor.outerHeight() + yOffsetTooltip + arrowOffset;
          break;
        case 'left':
        case 'right':
          offset = $anchor.offset().top + $anchor.outerHeight() / 2 - $tooltip.outerHeight() / 2 + yOffsetTooltip;
          break;
        default:
          break;
      }
      return offset;
    }
  }, {
    key: 'getComputedStylesFor',
    value: function getComputedStylesFor(element) {
      if (element._chariotComputedStyles) {
        return element._chariotComputedStyles;
      } else {
        return this._cacheStyleFor(element);
      }
    }
  }, {
    key: 'cloneStyles',
    value: function cloneStyles($element, $clone) {
      var start = new Date().getTime();
      var cssText = this.getComputedStylesFor($element[0]);
      $clone[0].style.cssText = cssText;

      // Fixes IE border box boxing model
      if (navigator.userAgent.match(/msie|windows/i)) {
        this._ieBoxModelStyleFix('width', $clone, cssText);
        this._ieBoxModelStyleFix('height', $clone, cssText);
      }
      $clone.css('pointer-events', 'none');
      //this._clonePseudoStyle($element, $clone, 'before');
      //this._clonePseudoStyle($element, $clone, 'after');
    }
  }, {
    key: 'clearCachedStylesForElement',
    value: function clearCachedStylesForElement($element) {
      var _this = this;

      if (!$element || !$element.length) return;
      $element[0]._chariotComputedStyles = null;
      $element.children().each(function (index, child) {
        _this.clearCachedStylesForElement($(child));
      });
    }
  }, {
    key: '_ieBoxModelStyleFix',
    value: function _ieBoxModelStyleFix(style, $ele, cssText) {
      var match = cssText.match(new RegExp('; ' + style + ': ([^;]*)'));
      var value = match && match.length > 1 ? parseInt(match[1]) : 0;
      if (value !== 0 && !isNaN(value)) {
        $ele[style](value);
      }
    }
  }, {
    key: '_generateUniqueClassName',
    value: function _generateUniqueClassName() {
      var prefix = arguments.length <= 0 || arguments[0] === undefined ? 'class' : arguments[0];

      return prefix + '_' + Math.floor(Math.random() * 1000000);
    }

    // NOTE: unused currently
  }, {
    key: '_clonePseudoStyle',
    value: function _clonePseudoStyle($element, $clone, pseudoClass) {
      var pseudoStyle = window.getComputedStyle($element[0], ':' + pseudoClass);
      if (pseudoStyle.content && pseudoStyle.content !== '') {
        var className = this._generateUniqueClassName();
        $clone.addClass(className);
        document.styleSheets[0].insertRule('.' + className + '::' + pseudoClass + ' {\n        ' + pseudoStyle.cssText + '; content: ' + pseudoStyle.content + '; }', 0);
      }
    }

    /*
      Known issues:
    - FF bug does not correctly copy CSS margin values
      (https://bugzilla.mozilla.org/show_bug.cgi?id=381328)
    - IE9 does not implement getComputedCSSText()
    */
  }, {
    key: '_cacheStyleFor',
    value: function _cacheStyleFor(element) {
      // check for IE getComputedCSSText()
      var computedStyles = undefined;
      if (navigator.userAgent.match(/msie|windows|firefox/i)) {
        computedStyles = element.getComputedCSSText();
      } else {
        computedStyles = document.defaultView.getComputedStyle(element).cssText;
      }

      Object.defineProperty(element, '_chariotComputedStyles', {
        value: computedStyles,
        enumerable: false,
        writable: true,
        configurable: false
      });

      return computedStyles;
    }
  }]);

  return Style;
})();

exports['default'] = Style;
module.exports = exports['default'];

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constants = require('./constants');

var _style = require('./style');

// distance between arrow tip and edge of tooltip, not including border

var _style2 = _interopRequireDefault(_style);

var DEFAULT_ARROW_LENGTH = 11;

/** The tooltip configuration allows you to specify which anchor element will
 * be pointed to by the tooltip, along with its position. A default template is
 * provided, which can be configured
 *
 * @typedef TooltipConfiguration
 * @property {string} position - Relatively positions the tooltip to the anchor
 *   element. Possible values: 'top' | 'left' | 'bottom' | 'right'
 * @property {string} [anchorElement] - Optional if the corresponding Step
 *  contains only one selector. anchorElement can be either
 *  (1) a key from StepConfiguration.selectors above, or
 *  (2) a CSS selector
 * @property {number} [xOffsetTooltip] - Value in pixels to offset the x-coordinate of
 *  the tooltip.
 * @property {number} [yOffsetTooltip] - Value in pixels to offset the y-coordinate of
 *  the tooltip.
 * @property {number} [offsetArrow] - Value in pixels to offset the arrow.
 * If the position is top or bootom, this still offset the x coord. If
 * left or right it will offset the y coord. If undefined or 0, arrow is centered.
 * @property {Tooltip-renderCallback} [render] - (TODO) Renders a custom template,
 *  thereby ignoring all other properties below.
 * @property {string} [iconUrl] - Path to an image displayed above the title.
 * @property {string} [title] - The title text of a toolip.
 * @property {string|function} [body] - The body text of a tooltip, or a callback
 *  that returns custom HTML.
 * @property {string} [cta] - The text contained within the button.
 * @property {Object} [attr] - HTML attributes to set on the tooltip.
 * @property {Number} [arrowLength] - Distance between arrow tip and edge of
 *  tooltip, not including border.  A value of 0 removes the arrow.
 * @property {Tooltip-subtextCallback} [subtext] - Callback that returns subtext
 *  content.
 *
 */

/**
 * A function that provides step information and returns subtext content.
 * @callback Tooltip-renderCallback
 * @param {number} currentStep - The current step number
 * @param {number} totalSteps - The total # of steps
 * @returns {string} markup - The HTML markup that represents the subtext
 */

/**
 * A function that provides step information and returns subtext content.
 * @callback Tooltip-subtextCallback
 * @param {number} currentStep - The current step number
 * @param {number} totalSteps - The total # of steps
 * @returns {string} markup - The HTML markup that represents the subtext
 */

var Tooltip = (function () {

  /**
   * @constructor
   * @param {TooltipConfiguration} config - The configuration for this tooltip
   * @param {Step} step - The Step object displayed along with this tooltip
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this
   *  Tooltip
   */

  function Tooltip(config, step, tutorial) {
    _classCallCheck(this, Tooltip);

    this.config = config;
    this.step = step;
    this.tutorial = tutorial;
    this.position = config.position;
    var arrowClass = 'chariot-tooltip';

    switch (this.position) {
      case 'left':
        arrowClass += '-arrow-right';
        break;
      case 'right':
        arrowClass += '-arrow-left';
        break;
      case 'top':
        arrowClass += '-arrow-bottom';
        break;
      case 'bottom':
        arrowClass += '-arrow-top';
        break;
    }

    this.xOffsetTooltip = config.xOffsetTooltip ? parseInt(config.xOffsetTooltip) : 0;
    this.yOffsetTooltip = config.yOffsetTooltip ? parseInt(config.yOffsetTooltip) : 0;

    this.offsetArrow = config.offsetArrow ? parseInt(config.offsetArrow) : 0;

    this.arrowClass = arrowClass;
    this.z_index = _constants.TOOLTIP_Z_INDEX;

    this.width = parseInt(config.width);
    this.height = parseInt(config.height);
    var selectorKeys = Object.keys(this.step.selectors);
    if (selectorKeys.length > 1 && !config.anchorElement) {
      throw new Error('anchorElement is not optional when more than one ' + 'selector exists:\n' + this);
    }
    this.anchorElement = config.anchorElement || selectorKeys[0];
    this.text = config.text;
    this.iconUrl = config.iconUrl;
    this.title = config.title;
    this.attr = config.attr || {};
    this.arrowLength = config.arrowLength || DEFAULT_ARROW_LENGTH;
  }

  _createClass(Tooltip, [{
    key: 'currentStep',
    value: function currentStep() {
      return this.tutorial.currentStep(this.step);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var $tooltip = this.$tooltip = this._createTooltipTemplate();
      $('body').append($tooltip);

      var $tooltipArrow = this.$tooltipArrow = $('.chariot-tooltip-arrow');

      this._position($tooltip, $tooltipArrow);

      // Add event handlers
      $('.chariot-btn-row button').click(function () {
        _this.next();
      });
    }
  }, {
    key: 'tearDown',
    value: function tearDown() {
      if (!this.$tooltip) return;
      this.$tooltip.remove();
      this.$tooltip = null;
      this.$tooltipArrow.remove();
      this.$tooltipArrow = null;
    }
  }, {
    key: 'reposition',
    value: function reposition() {
      this._position(this.$tooltip, this.$tooltipArrow);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[Tooltip - currentStep: ' + this.currentStep() + ', Step: ' + this.step + ',' + (' text: ' + this.text + ']');
    }

    //// PRIVATE

  }, {
    key: '_createTooltipTemplate',
    value: function _createTooltipTemplate() {
      var currentStep = this.tutorial.currentStep(this.step);
      var totalSteps = this.tutorial.steps.length;
      this.cta = this.config.cta || (currentStep != totalSteps ? 'Next' : 'Done');
      this.subtext = this.config.subtext || function () {
        return currentStep + ' of ' + totalSteps;
      };
      var subtextMarkup = this._subtextMarkup();
      var buttonFloat = subtextMarkup === '' ? 'center' : 'right';
      var template = '\n      <div class="chariot-tooltip chariot-step-' + currentStep + '">\n        ' + this._arrowMarkup() + '\n        <div class="chariot-tooltip-content">' + this._iconMarkup() + '</div>\n        <h1 class="chariot-tooltip-header">' + this.title + '</h1>\n        <div class="chariot-tooltip-content"><p>' + this.text + '</p></div>\n        <div class="chariot-btn-row">\n          ' + subtextMarkup + '\n          <button class="btn btn-inverse ' + buttonFloat + '">' + this.cta + '</button>\n        </div>\n      </div>';
      var $template = $(template);

      // Add default data attributes
      this.attr['data-step-order'] = currentStep;
      $template.attr(this.attr);
      return $template;
    }
  }, {
    key: '_iconMarkup',
    value: function _iconMarkup() {
      if (!this.iconUrl) return '';
      return '<div class=\'chariot-tooltip-icon\'>\n       <img class=\'chariot-tooltip-icon-img\' src="' + this.iconUrl + '"/>\n     </div>';
    }
  }, {
    key: '_subtextMarkup',
    value: function _subtextMarkup() {
      if (!this.subtext) return '';
      return '<span class=\'chariot-tooltip-subtext\'>\n      ' + this.subtext(this.currentStep(), this.tutorial.steps.length) + '\n    </span>';
    }
  }, {
    key: '_arrowMarkup',
    value: function _arrowMarkup() {
      if (this.arrowLength === 0) return '';
      return '<div class="chariot-tooltip-arrow ' + this.arrowClass + '"></div>';
    }
  }, {
    key: '_position',
    value: function _position($tooltip, $tooltipArrow) {
      this._positionTooltip($tooltip);
      this._positionArrow($tooltip, $tooltipArrow);
    }
  }, {
    key: '_positionTooltip',
    value: function _positionTooltip($tooltip) {
      var $anchorElement = this._getAnchorElement();
      if (!$anchorElement) return;

      this.borderLeftWidth = parseInt($tooltip.css('border-left-width')) || 0;
      this.borderRightWidth = parseInt($tooltip.css('border-right-width')) || 0;
      this.borderBottomWidth = parseInt($tooltip.css('border-bottom-width')) || 0;
      this.borderTopWidth = parseInt($tooltip.css('border-top-width')) || 0;
      var top = _style2['default'].calculateTop($tooltip, $anchorElement, this.yOffsetTooltip, this.position, this.arrowLength + this.borderTopWidth + this.borderBottomWidth);
      var left = _style2['default'].calculateLeft($tooltip, $anchorElement, this.xOffsetTooltip, this.position, this.arrowLength + this.borderLeftWidth + this.borderRightWidth);
      var tooltipStyles = {
        top: top,
        left: left,
        'z-index': this.z_index,
        position: 'absolute'
      };
      $tooltip.css(tooltipStyles);
    }

    /*
      Positions the arrow to point at the center of the anchor element.
      If a tooltip is offset via xOffsetTooltip / yOffsetTooltip, the arrow will continue to
      point to center. You can change this via the offsetArrow property.
    */
  }, {
    key: '_positionArrow',
    value: function _positionArrow($tooltip, $tooltipArrow) {
      if (this.arrowLength === 0) return;
      var arrowDiagonal = this.arrowLength * 2;

      // Calculate length of arrow sides
      // a^2 + b^2 = c^2, but a=b since arrow is a square, so a = sqrt(c^2 / 2)
      var arrowEdge = Math.sqrt(Math.pow(arrowDiagonal, 2) / 2);

      var arrowEdgeStyle = arrowEdge + 'px';
      var arrowStyles = {
        'z-index': this.z_index + 1,
        width: arrowEdgeStyle,
        height: arrowEdgeStyle
      };
      var top = undefined,
          left = undefined,
          min = undefined,
          max = undefined,
          borderWidth = undefined;

      var borderRadius = parseInt($tooltip.css('border-radius')) || 0;

      switch (this.arrowClass) {
        case 'chariot-tooltip-arrow-left':
          top = ($tooltip.outerHeight() - arrowDiagonal) / 2 - this.yOffsetTooltip + this.offsetArrow;
          min = borderRadius;
          max = $tooltip.outerHeight() - arrowDiagonal - borderRadius;
          arrowStyles.top = Math.max(Math.min(top, max), min);
          arrowStyles.left = -(arrowEdge / 2 + this.borderLeftWidth);
          break;
        case 'chariot-tooltip-arrow-right':
          top = ($tooltip.outerHeight() - arrowDiagonal) / 2 - this.yOffsetTooltip + this.offsetArrow;
          min = borderRadius;
          max = $tooltip.outerHeight() - arrowDiagonal - borderRadius;
          arrowStyles.top = Math.max(Math.min(top, max), min);
          arrowStyles.right = -(arrowEdge / 2 + this.borderRightWidth);
          break;
        case 'chariot-tooltip-arrow-bottom':
          left = ($tooltip.outerWidth() - arrowDiagonal) / 2 - this.xOffsetTooltip + this.offsetArrow;
          min = borderRadius;
          max = $tooltip.outerWidth() - arrowDiagonal - borderRadius;
          arrowStyles.left = Math.max(Math.min(left, max), min);
          arrowStyles.bottom = -(arrowEdge / 2 + this.borderBottomWidth);
          break;
        case 'chariot-tooltip-arrow-top':
          left = ($tooltip.outerWidth() - arrowDiagonal) / 2 - this.xOffsetTooltip + this.offsetArrow;
          min = borderRadius;
          max = $tooltip.outerWidth() - arrowDiagonal - borderRadius;
          arrowStyles.left = Math.max(Math.min(left, max), min);
          arrowStyles.top = -(arrowEdge / 2 + this.borderTopWidth);
          break;
      }

      $tooltipArrow.css(arrowStyles);
    }
  }, {
    key: '_getAnchorElement',
    value: function _getAnchorElement() {
      // Look for already cloned elements first
      var clonedSelectedElement = this.step.getClonedElement(this.anchorElement);
      if (clonedSelectedElement) return clonedSelectedElement;
      // Try fetching from DOM
      var $element = $(this.anchorElement);
      if ($element.length === 0) {
        // Try fetching from selectors
        $element = $(this.step.selectors[this.anchorElement]);
      }
      if ($element.length === 0) {
        console.log("Anchor element not found: " + this.anchorElement);
      }
      return $element;
    }
  }, {
    key: 'next',
    value: function next() {
      this.step.next();
    }
  }]);

  return Tooltip;
})();

exports['default'] = Tooltip;
module.exports = exports['default'];

},{"./constants":2,"./style":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _step = require('./step');

var _step2 = _interopRequireDefault(_step);

var _overlay = require('./overlay');

var _overlay2 = _interopRequireDefault(_overlay);

var Promise = require('es6-promise').Promise;

var Tutorial = (function () {
  /**
   * The tutorial configuration is where the steps of a tutorial are specified,
   * and also allows customization of the overlay style.
   * Notes on implementation:
   * The elements defined in each step of a tutorial via
   * StepConfiguration.selectors are highlighted using transparent overlays.
   * These elements areare overlaid using one of two strategies:
   * 1. Semi-transparent overlay with a transparent section cut out over the
   *    element
   * 2. Selected elements are cloned and placed above a transparent overlay
   *
   * #1 is more performant, but issues arise when an element is not rectangularly-
   * shaped, or when it has `:before` or `:after`
   * pseudo-selectors that insert new DOM elements that protrude out of the
   * main element.
   * #2 is slower because of deep CSS style cloning, but it will correctly render
   * the entire element in question, regardless of shape or size.
   * However, there are edge cases where Firefox
   * will not clone CSS `margin` attribute of children elements.
   * In those cases, the delegate callbacks should be utilized to fix.
   * Note however, that #2 is always chosen if multiple selectors are specified in
   * StepConfiguration.selectors.
   *
   * @typedef TutorialConfiguration
   * @property {boolean} [shouldOverlay=true] - Setting to false will disable the
   * overlay that normally appears over the page and behind the tooltips.
   * @property {string} [overlayColor='rgba(255,255,255,0.7)'] - Overlay CSS color
   * @property {StepConfiguration[]} steps - An array of step configurations (see below).
   * @property {Tutorial-onCompleteCallback} [onComplete] - Callback that is called
   * once the tutorial has gone through all steps.
   * @property {boolean} [useTransparentOverlayStrategy=false] - Setting to true will use an
   *  implementation that does not rely on cloning highlighted elements.
   *  Note: This value is ignored if a step contains multiple selectors.
   *  useTransparentOverlayStrategy is named as such because
   * @property {boolean} [animated=false] - (TODO) Enables spotlight-like
   *  transitions between steps.
   */

  /**
   * @constructor
   * @param {TutorialConfiguration} config - The configuration for this tutorial
   * @param {string} [name] - Name of the tutorial
   * @param {ChariotDelegate} [delegate] - An optional delegate that responds to
   *  lifecycle callbacks
   */

  function Tutorial(config, name, delegate) {
    var _this = this;

    _classCallCheck(this, Tutorial);

    if (typeof config.steps !== 'object') {
      throw new Error('steps must be an array.\n' + this);
      return;
    }
    this.name = name;
    this.delegate = delegate || {};
    this.useTransparentOverlayStrategy = config.useTransparentOverlayStrategy || false;
    this.steps = [];
    this.overlay = new _overlay2['default'](config);
    config.steps.forEach(function (step, index) {
      _this.steps.push(new _step2['default'](step, index, _this, _this.overlay, _this.delegate));
    });
    this._prepared = false;
    this._isActive = false;
  }

  /**
   * Indicates if this tutorial is currently active.
   * return {boolean}
   */

  _createClass(Tutorial, [{
    key: 'isActive',
    value: function isActive() {
      return this._isActive;
    }

    /**
     * Starts the tutorial and marks itself as inactive.
     * @returns {undefined}
     */
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      if (this.steps.length === 0) {
        throw new Error('steps should not be empty.\n' + this);
        return;
      }

      this._isActive = true;

      Promise.resolve().then(function () {
        if (_this2.delegate.willBeginTutorial) {
          return _this2.delegate.willBeginTutorial(_this2);
        }
      }).then(function () {
        _this2.overlay.render();
        _this2.steps[0].render();
      });
    }
  }, {
    key: 'prepare',
    value: function prepare() {
      var _this3 = this;

      if (this._prepared) return;
      this.steps.forEach(function (step) {
        step.prepare();
        _this3._prepared = true;
      });
    }
  }, {
    key: 'next',
    value: function next(currentStep) {
      var index = this.steps.indexOf(currentStep);
      if (index < 0) {
        throw new Error('currentStep not found');
        return;
      }

      currentStep.tearDown();
      if (index === this.steps.length - 1) {
        this.end();
        this.tearDown();
      } else {
        this.steps[index + 1].render();
      }
    }
  }, {
    key: 'currentStep',
    value: function currentStep(step) {
      if (step === null) return null;
      return this.steps.indexOf(step) + 1;
    }
  }, {
    key: 'tearDown',
    value: function tearDown() {
      this._prepared = false;
      this.overlay.tearDown();
      this.steps.forEach(function (step) {
        step.tearDown();
      });
    }

    /**
     * Retrieves the Step object at index.
     * @returns {Step} step
     */
  }, {
    key: 'getStep',
    value: function getStep(index) {
      return this.steps[index];
    }

    /**
     * Ends the tutorial by tearing down all the steps (and associated tooltips,
     * overlays).
     * Also marks itself as inactive.
     * @param {boolean} [forced=false] - Indicates whether tutorial was forced to
     *  end
     * @returns {undefined}
     */
  }, {
    key: 'end',
    value: function end() {
      var _this4 = this;

      var forced = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      // Note: Order matters.
      this.tearDown();

      return Promise.resolve().then(function () {
        if (_this4.delegate.didFinishTutorial) {
          return _this4.delegate.didFinishTutorial(_this4, forced);
        }
      }).then(function () {
        _this4._isActive = false;
      });
    }
  }, {
    key: 'toString',
    value: function toString() {
      return '[Tutorial - active: ' + this._isActive + ', ' + ('useTransparentOverlayStrategy: ' + this.useTransparentOverlayStrategy + ', ') + ('steps: ' + this.steps + ', overlay: ' + this.overlay + ']');
    }
  }]);

  return Tutorial;
})();

exports['default'] = Tutorial;
module.exports = exports['default'];

},{"./overlay":5,"./step":6,"es6-promise":14}],10:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":11,"./encode":12}],14:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.3.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$asap(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":10}],15:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = require('lodash._getnative');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeNow = getNative(Date, 'now');

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Date
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => logs the number of milliseconds it took for the deferred function to be invoked
 */
var now = nativeNow || function() {
  return new Date().getTime();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed invocations. Provide an options object to indicate that `func`
 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
 * Subsequent calls to the debounced function return the result of the last
 * `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify invoking on the leading
 *  edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
 *  delayed before it is invoked.
 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
 *  edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // ensure `batchLog` is invoked once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }));
 *
 * // cancel a debounced call
 * var todoChanges = _.debounce(batchLog, 1000);
 * Object.observe(models.todo, todoChanges);
 *
 * Object.observe(models, function(changes) {
 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
 *     todoChanges.cancel();
 *   }
 * }, ['delete']);
 *
 * // ...at some point `models.todo` is changed
 * models.todo.completed = true;
 *
 * // ...before 1 second has passed `models.todo` is deleted
 * // which cancels the debounced `todoChanges` call
 * delete models.todo;
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = wait < 0 ? 0 : (+wait || 0);
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = !!options.leading;
    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
    }
    lastCalled = 0;
    maxTimeoutId = timeoutId = trailingCall = undefined;
  }

  function complete(isCalled, id) {
    if (id) {
      clearTimeout(id);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (isCalled) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = undefined;
      }
    }
  }

  function delayed() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0 || remaining > wait) {
      complete(trailingCall, maxTimeoutId);
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  }

  function maxDelayed() {
    complete(trailing, timeoutId);
  }

  function debounced() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0 || remaining > maxWait;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = undefined;
    }
    return result;
  }
  debounced.cancel = cancel;
  return debounced;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = debounce;

},{"lodash._getnative":16}],16:[function(require,module,exports){
/**
 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = getNative;

},{}],17:[function(require,module,exports){
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
},{"querystring":13}]},{},[4]);
