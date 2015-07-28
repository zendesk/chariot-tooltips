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
    this.overlayStyle = config.overlayStyle || true;
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
    return this.overlayStyle === false;
  }

  _renderOverlay() {
    if (this.hasNoOverlay()) return;

    let $overlay = $("<div class='overlay'></div>");
    if (this.overlayStyle === true) {
      $overlay.css({
        top: 0,
        left: 0,
        background: 'white',
        'z-index': OVERLAY_Z_INDEX,
        opacity: 0.7,
        position: 'absolute',
        height: '100%',
        width: '100%'
      });
    } else {
      $overlay.css(this.overlayStyle);
    }
    $('body').append($overlay);
    this.$overlay = $overlay;
  }

  _end() {
    // Note: Order matters. complete callback should be called after UI is torn down
    this.tearDown();
    this.chariot.endTutorial();
    this.complete();
  }


}

export default Tutorial;
