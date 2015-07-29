import $ from 'jquery';
import Tooltip from './tooltip';
import { CLONE_Z_INDEX } from './constants';
import Style from './libs/style';

let MAX_ATTEMPTS = 100;
let DOM_QUERY_DELAY = 100;

let Promise = require('es6-promise').Promise;

class Step {
  constructor(config = {}, tutorial) {
    if (config.before && typeof config.before !== 'function') {
      throw "before must be a function";
    }
    this.selectors = config.selectors;
    this.tutorial = tutorial;
    this.text = config.text;
    this.before = config.before;
    this.after = config.after;
    this.tooltip = new Tooltip(config.tooltip, this, tutorial);
    this.cta = config.cta || 'Next';
    this.clonedElements = {};
  }

  render() {
    Promise.resolve().then(() => {
      let before;
      if (this.before) {
        before =  this.before();
      }
      return before;
    }).then(() => {
      return this._waitForElements();
    }).then(() => {
      this._cloneElements(this.selectors);
      this._renderTooltip();
    }).catch(error => {
      console.log(error);
      this.tutorial.tearDown();
    });
  }

  next() {
    this.tutorial.next(this);
  }

  getClonedElement(name) {
    return this.clonedElements[name];
  }

  tearDown() {
    for (let elementName in this.clonedElements) {
      this.clonedElements[elementName].remove();
    }
    this.clonedElements = {};
    this.tooltip.tearDown();
  }

  prepare() {
    for (let selectorName in this.selectors) {
      let selector = this.selectors[selectorName]
      this._computeStyles($(selector));
    }
  }

  // PRIVATE

  _renderTooltip() {
    this.tooltip.render();
    if (this.after) this.after();
  }

  _waitForElements() {
    let promises = [];
    for (let selectorName in this.selectors) {
      let promise = new Promise((resolve, reject) => {
        this._waitForElement(selectorName, 0, resolve, reject);
      });
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  _waitForElement(selectorName, numAttempts, resolve, reject) {
    let selector = this.selectors[selectorName];
    let element = $(selector);
    if (element.length == 0) {
      ++numAttempts;
      if (numAttempts == MAX_ATTEMPTS) {
        reject(`Selector not found: ${selector}`);
      } else {
        window.setTimeout(() => {
          this._waitForElement(selectorName, numAttempts, resolve, reject);
        }, DOM_QUERY_DELAY);
      }
    } else {
      resolve();
    }
  }

  _computeStyles($selector) {
    Style.getComputedStylesFor($selector);
    $selector.children().toArray().forEach(child => {
      this._computeStyles($(child));
    });
  }

  _cloneElements(selectors) {
    if (this.tutorial.hasNoOverlay()) return;

    setTimeout(() => {
      this.tutorial.prepare();
    }, 0);
    for (let selectorName in selectors) {
      let sel = selectors[selectorName];
      let clone = this._cloneElement(sel);
      this.clonedElements[selectorName] = clone;
    }
  }

  _applyComputedStyles($clone, $element) {
    if (!$element.is(":visible")) {
      return;
    }
    $clone.addClass('chariot-overlay');
    Style.cloneStyles($element, $clone);
    let clonedChildren = $clone.children().toArray();
    $element.children().toArray().forEach((child, index) => {
      this._applyComputedStyles($(clonedChildren[index]), $(child));
    });
  }

  _cloneElement(sel) {
    let $element = $(sel);
    if ($element.length == 0) {
      console.log("Can't find selector to clone: " + sel);
      return null;
    }
    let $clone = $element.clone();
    $('body').append($clone);
    this._applyComputedStyles($clone, $element);
    this._positionClone($clone, $element);

    return $clone;
  }

  _positionClone($clone, $element) {
    $clone.css({
      'z-index': CLONE_Z_INDEX,
      position: 'absolute'
    });
    $clone.offset($element.offset());
  }
}

export default Step;
