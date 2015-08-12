import $ from 'jquery';
import Tooltip from './tooltip';
import { CLONE_Z_INDEX } from './constants';
import Style from './libs/style';

let MAX_ATTEMPTS = 100;
let DOM_QUERY_DELAY = 100;

let Promise = require('es6-promise').Promise;

class Step {
  constructor(config = {}, tutorial, overlay) {
    if (config.before && typeof config.before !== 'function') {
      throw new Error(`before must be a function. config: ${config}`);
    }
    this.tutorial = tutorial;
    this.overlay = overlay;
    this.selectors = config.selectors;
    this.before = config.before;
    this.after = config.after;
    this._resizeTimeout = null;
    this._selectedElements = {};
    this._clonedElements = {};
    this.tooltip = new Tooltip(config.tooltip, this, tutorial);
    this._cloneClasses = [];
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
      if (this.tutorial.compatibilityMode && Object.keys(this.selectors).length === 1) {
        this._transparentOverlayStrategy();
      } else {
        this._clonedElementStrategy();
      }

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
    return this._clonedElements[name];
  }

  tearDown() {
    for (let elementName in this._clonedElements) {
      this._clonedElements[elementName].remove();
    }
    // Remove computed styles
    for (let selectorName in this.selectors) {
      let selector = this.selectors[selectorName]
      Style.clearCachedStylesForElement($(selector));
    }
    this._clonedElements = {};
    this._selectedElements = {};
    this.tooltip.tearDown();
  }

  prepare() {
    for (let selectorName in this.selectors) {
      let selector = this.selectors[selectorName]
      this._computeStyles($(selector));
    }
  }

  toString() {
    return `[Step - currentStep: ${this.tutorial.currentStep(this.step)}, ` +
      `selectors: ${JSON.stringify(this.selectors)}]`;
  }

  //// PRIVATE

  _transparentOverlayStrategy() {
    // Only use an overlay
    let selectors = Object.keys(this.selectors).map(key => this.selectors[key]);
    let $element =  this._selectedElements[selectors[0]];
    this.overlay.focusOnElement($element);
  }

  _clonedElementStrategy() {
    // Clone elements if multiple selectors
    this.overlay.showBackgroundOverlay();
    this._cloneElements(this.selectors);
    this.overlay.showTransparentOverlay();
  }

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
      this._selectedElements[selector] = element;
      resolve();

      // TODO: fire event when element is ready. Tutorial will listen and call
      // prepare() on all steps
    }
  }

  _computeStyles($element) {
    Style.getComputedStylesFor($element[0]);
    $element.children().toArray().forEach(child => {
      this._computeStyles($(child));
    });
  }

  _cloneElements(selectors) {
    if (this.overlay.isVisible()) return;

    setTimeout(() => {
      this.tutorial.prepare();
    }, 0);
    for (let selectorName in selectors) {
      let sel = selectors[selectorName];
      let clone = this._cloneElement(sel);
      this._clonedElements[selectorName] = clone;
    }
  }

  _cloneElement(sel) {
    let $element = this._selectedElements[sel];
    if ($element.length == 0) { return null; }

    let $clone = $element.clone();
    $('body').append($clone);
    this._applyComputedStyles($clone, $element);
    this._positionClone($clone, $element);

    $(window).resize(() => {
      if (this._resizeTimeout) {
        clearTimeout(this._resizeTimeout);
      }
      this._resizeTimeout = setTimeout(() => {
        Style.clearCachedStylesForElement($element);
        this._applyComputedStyles($clone, $element);
        this._positionClone($clone, $element);
        this._resizeTimeout = null;
      }, 50)
    });

    return $clone;
  }

  _applyComputedStyles($clone, $element) {
    if (!$element.is(":visible")) {
      return;
    }
    $clone.addClass('chariot-clone');
    Style.cloneStyles($element, $clone);
    let clonedChildren = $clone.children().toArray();
    $element.children().toArray().forEach((child, index) => {
      this._applyComputedStyles($(clonedChildren[index]), $(child));
    });
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
