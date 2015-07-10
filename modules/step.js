import $ from 'jquery';
import Tooltip from './tooltip';

let MAX_ATTEMPTS = 1000;
let DOM_QUERY_DELAY = 500;

class Step {
  constructor(config = {}, tutorial) {
    this.selectors = config.selectors;
    this.tutorial = tutorial;
    this.text = config.text;
    this.before = typeof before == 'function' ? before : function(){};
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
    this.intervalId = window.setInterval(this.waitForElements.bind(this), DOM_QUERY_DELAY);
    this.numAttempts = 0;
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

  /// PRIVATE

  waitForElements() {
    if(this.numAttempts < MAX_ATTEMPTS) {
      for (let elementName in this.selectors) {
        let elem = this.selectors[elementName];
        let element = $(elem);
        if(element.length == 0) {
          this.numAttempts++;
          return;
        }
      }
    }
    clearInterval(this.intervalId);
    this.cloneElements(this.selectors);
    this.renderTooltip();
  }

  cloneElements(elements) {
    for (let elementName in elements) {
      let elem = elements[elementName];
      let clone = this.cloneElement(elem);
      this.clonedElements[elementName] = clone;
    }
  }

  cloneElement(elem) {
    let element = $(elem);
    let clone = element.clone(),
      style = document.defaultView.getComputedStyle(element[0],"").cssText;
    clone[0].style.cssText = style;
    clone.css({'z-index': 20, position:'absolute'});
    clone.offset(element.offset());

    $("body").append(clone);
    return clone;
  }

  overlay() {
    let overlay = $("<div class='overlay'></div>");
    overlay.css({top: 0, left: 0, background: 'black', 'z-index':10, opacity: 0.5, position:'absolute', height: '100%', width: '100%'});
    $("body").append(overlay);
  }
}

export default Step;
