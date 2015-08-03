import $ from 'jquery';
import Step from './step';
import { OVERLAY_Z_INDEX } from './constants';
let Promise = require('es6-promise').Promise;

class Tutorial {
  constructor(chariot, config) {
    this.prepared = false;
    this.chariot = chariot;
    this.steps = [];
    if (typeof config.steps !== 'object') {
      throw new Error('steps must be an array');
      return;
    }
    config.steps.forEach(step => {
      this.steps.push(new Step(step, this));
    });
    this.complete = typeof config.complete === 'function' ? config.complete : ()=> {};
    this.shouldOverlay = config.shouldOverlay === undefined ? true : config.shouldOverlay;
    this.overlayColor = config.overlayColor || 'rgba(255,255,255,0.7)';
    this.highlightTransparentRegion = config.highlightTransparentRegion || false;
  }

  start() {
    if (this.steps.length === 0) {
      throw new Error('steps should not be empty');
      return;
    }
    this._renderOverlay();
    this.steps[0].render();
  }

  prepare() {
    if (this.prepared) return;
    this.steps.forEach(step => {
      step.prepare();
      this.prepared = true;
    });
  }

  next(currentStep) {
    let index = this.steps.indexOf(currentStep);
    if (index < 0) {
      throw new Error('currentStep not found');
      return;
    }

    currentStep.tearDown();
    if (index === this.steps.length - 1) {
      this._end();
      this.tearDown();
    } else {
      this.steps[index + 1].render();
    }
  }

  currentStep(step) {
    if (step === null) return null;
    return this.steps.indexOf(step) + 1;
  }

  tearDown() {
    this.prepared = false;
    this.$overlay.remove();
    // Ensure all steps are torn down
    this.steps.forEach(step => {
      step.tearDown();
    });
  }

  hasNoOverlay() {
    return this.shouldOverlay === false;
  }

  _renderOverlay() {
    if (this.hasNoOverlay()) return;

    let $overlay = $("<div class='chariot-overlay'></div>");
    $overlay.css({ 'z-index': OVERLAY_Z_INDEX });
    $('body').append($overlay);
    this.$overlay = $overlay;
  }

  useOverlayWithClones() {
    $(window).unbind('resize');

    this.$overlay.css({
      background: this.overlayColor,
      width: '100%',
      height: '100%',
      border: 'none'
    });
  }

  useOverlayWithoutClones($element) {
    this.resizeOverlayToElement($element);

    $(window).resize(() => {
      this.resizeOverlayToElement($element);
    });
  }

  resizeOverlayToElement($element) {
    // First position the overlay
    let offset = $element.offset();

    // Then resize it
    let borderStyles = `solid ${this.overlayColor}`;
    let docWidth = $(window).outerWidth();
    let docHeight = $(window).outerHeight();

    let width = $element.outerWidth();
    let height = $element.outerHeight();
    let leftWidth = offset.left;
    let rightWidth = docWidth - (offset.left + width);
    let topWidth = offset.top;
    let bottomWidth = docHeight - (offset.top + height);

    this.$overlay.css({
      background: 'transparent',
      width, height,
      'border-left': `${leftWidth}px ${borderStyles}`,
      'border-top': `${topWidth}px ${borderStyles}`,
      'border-right': `${rightWidth}px ${borderStyles}`,
      'border-bottom': `${bottomWidth}px ${borderStyles}`
    });
  }

  _end() {
    // Note: Order matters. complete callback should be called after UI is torn down
    this.tearDown();
    this.chariot.endTutorial();
    this.complete();
  }


}

export default Tutorial;
