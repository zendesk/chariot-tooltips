import $ from 'jquery';
import Tooltip from './tooltip';
import { CLONE_Z_INDEX } from './constants';

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
    if (this.before) this.before();
    this.waitForElements().then(() => {
      this.cloneElements(this.selectors);
      this.setupRepositionHandlers();
      this.renderTooltip();
    }, error => {
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
          console.log(numAttempts);
          this.waitForElement(selectorName, numAttempts, resolve, reject);
        }, DOM_QUERY_DELAY);
      }
    } else {
      console.log(resolve);
      resolve();
    }
  }

  cloneElements(selectors) {
    for (let selectorName in selectors) {
      let sel = selectors[selectorName];
      let clone = this.cloneElement(sel);
      this.clonedElements[selectorName] = clone;
    }
  }

  generateRandomClassName() {
    return `class_${Math.floor(Math.random()*1000000)}`;
  }

  applyComputedStyles($clone, $element){
    let style = document.defaultView.getComputedStyle($element[0], "").cssText;
    let beforeStyle = window.getComputedStyle($element[0], '::before');
    $clone[0].style.cssText = style;
    if (beforeStyle.content && beforeStyle.content !== '') {
      console.log(`Adding before content '${beforeStyle.content}'`);
      console.log($element[0]);
      let className = this.generateRandomClassName();
      $clone.addClass(className);
      document.styleSheets[0].insertRule(`.${className}::before { ${beforeStyle.cssText}; content: ${beforeStyle.content};  }`, 0);
    }
    let afterStyle = window.getComputedStyle($element[0], '::after');
    if (afterStyle.content && afterStyle.content !== '') {
      console.log(`Adding after content '${afterStyle.content}'`);
      console.log($element[0]);
      let className = this.generateRandomClassName();
      $clone.addClass(className);
      document.styleSheets[0].insertRule(`.${className}::after { ${afterStyle.cssText}; content: ${afterStyle.content}; }`, 0);
    }
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
    this.applyComputedStyles($clone, $element);
    $clone.css({
      'z-index': CLONE_Z_INDEX,
      position: 'absolute'
    });
    $clone.offset($element.offset());

    $('body').append($clone);
    return $clone;
  }

  // TODO: Evaluate whether this method is actually necessary or not
  setupRepositionHandlers() {
    $(window).resize(() => {
      this.repositionElements();
    });
    // TODO: Also reposition if any of the individual elements change position
  }

  repositionElements() {
    for (let selectorName in this.selectors) {
      let element = $(selectorName);
      let clone = this.clonedElements[selectorName];
      clone.offset(element.offset());
    }
  }
}

export default Step;
