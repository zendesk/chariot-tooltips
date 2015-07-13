import $ from 'jquery';
import Tooltip from './tooltip';

let MAX_ATTEMPTS = 1000;
let DOM_QUERY_DELAY = 500;

let Promise = require('es6-promise').Promise;

class Step {
  constructor(config = {}, tutorial) {
    this.selectors = config.selectors;
    this.tutorial = tutorial;
    this.text = config.text;
    this.before = typeof config.before === 'function' ?
      config.before : function() {};
    this.tooltip = new Tooltip(config.tooltip, this, tutorial);
    this.cta = config.cta || 'Next';
    this.name = config.name;
    this.clonedElements = {};
  }

  renderTooltip() {
    this.tooltip.render();
  }

  render() {
    this.before();
    this.renderOverlay();
  }

  renderOverlay() {
    this.waitForElements();
    this.overlay();
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

  // PRIVATE

  waitForElements() {
    let promises = [];
    for (let selectorName in this.selectors) {
      let promise = new Promise((resolve, reject) => {
        this.waitForElement(selectorName, 0, resolve, reject);
      });
      promises.push(promise);
    }

    Promise.all(promises).then(() => {
      this.cloneElements(this.selectors);
      this.setupRepositionHandlers();
    });
  }

  waitForElement(selectorName, numAttempts, resolve, reject) {
    let selector = this.selectors[selectorName];
    let element = $(selector);
    if(element.length == 0) {
      ++numAttempts;
      if(numAttempts == MAX_ATTEMPTS) {
        reject();
      } else {
        window.setTimeout(() => {
          this.waitForElement(selectorName, numAttempts, resolve, reject);
        }, DOM_QUERY_DELAY);
      }
    } else {
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

  cloneElement(sel) {
    let element = $(sel);
    if(element.length == 0) {
      console.log("Can't find selector to clone: " + sel);
      return null;
    }
    let clone = element.clone(),
      style = document.defaultView.getComputedStyle(element[0],"").cssText;
    clone[0].style.cssText = style;
    clone.css({
      'z-index': 20,
      position: 'absolute'
    });
    clone.offset(element.offset());

    $('body').append(clone);
    return clone;
  }

  overlay() {
    let overlay = $("<div class='overlay'></div>");
    overlay.css({
      top: 0,
      left: 0,
      background: 'black',
      'z-index': 10,
      opacity: 0.5,
      position: 'absolute',
      height: '100%',
      width: '100%'
    });
    $('body').append(overlay);
  }

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

export
default Step;
