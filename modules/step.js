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
      return this.waitForElements();
    }).then(() => {
      this.cloneElements(this.selectors);
      this.renderTooltip();
    }).catch(error => {
      console.log(error);
      console.log("Skipping this step...");
      this.next();
    });
  }

  renderTooltip() {
    this.tooltip.render();
    if (this.after) this.after();
  }

  next() {
    this.tutorial.next(this);
  }

  getSelectorByName(name) {
    return this.selectors[name] || null;
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

  // PRIVATE

  waitForElements() {
    let promises = [];
    for (let selectorName in this.selectors) {
      let promise = new Promise((resolve, reject) => {
        this.waitForElement(selectorName, 0, resolve, reject);
      });
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  waitForElement(selectorName, numAttempts, resolve, reject) {
    let selector = this.selectors[selectorName];
    let element = $(selector);
    if (element.length == 0) {
      ++numAttempts;
      if (numAttempts == MAX_ATTEMPTS) {
        reject(`Selector not found: ${selector}`);
      } else {
        window.setTimeout(() => {
          this.waitForElement(selectorName, numAttempts, resolve, reject);
        }, DOM_QUERY_DELAY);
      }
    } else {
      resolve();
    }
  }

  prepare() {
    for (let selectorName in this.selectors) {
      let selector = this.selectors[selectorName]
      this.computeStyles($(selector));
    }
  }

  computeStyles($selector) {
    Style.getComputedStylesFor($selector);
    $selector.children().toArray().forEach(child => {
      this.computeStyles($(child));
    });
  }

  cloneElements(selectors) {
    setTimeout(() => {
      this.tutorial.prepare();
    }, 0);
    for (let selectorName in selectors) {
      let sel = selectors[selectorName];
      let clone = this.cloneElement(sel);
      this.clonedElements[selectorName] = clone;
    }
  }

  applyComputedStyles($clone, $element) {
    if (!$element.is(":visible")) {
      return;
    }
    $clone.addClass('chariot-overlay');
    Style.cloneStyles($element, $clone);
    let clonedChildren = $clone.children().toArray();
    $element.children().toArray().forEach((child, index) => {
      this.applyComputedStyles($(clonedChildren[index]), $(child));
    });
  }

  cloneElement(sel) {
    let $element = $(sel);
    if ($element.length == 0) {
      console.log("Can't find selector to clone: " + sel);
      return null;
    }
    let $clone = $element.clone();
    $('body').append($clone);
    this.applyComputedStyles($clone, $element);
    // alert('hi');
    $clone.css({
      'z-index': CLONE_Z_INDEX,
      position: 'absolute'
    });
    // alert('hi');
    $clone.offset($element.offset());
    // alert('hi');
    return $clone;
  }
}

export default Step;
