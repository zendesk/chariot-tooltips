import $ from 'jquery';
import Step from './step';
import Overlay from './overlay';
let Promise = require('es6-promise').Promise;

class Tutorial {
  constructor(chariot, config) {
    this.chariot = chariot;
    if (typeof config.steps !== 'object') {
      throw new Error(`steps must be an array.\n${this}`);
      return;
    }

    this.complete = typeof config.complete === 'function' ? config.complete : ()=> {};
    this.compatibilityMode = config.compatibilityMode || false;

    this.steps = [];
    this.overlay = new Overlay(config);
    config.steps.forEach(step => {
      this.steps.push(new Step(step, this, this.overlay));
    });
    this._prepared = false;
  }

  start() {
    if (this.steps.length === 0) {
      throw new Error(`steps should not be empty.\n${this}`);
      return;
    }
    this.overlay.render();
    this.steps[0].render();
  }

  prepare() {
    if (this._prepared) return;
    this.steps.forEach(step => {
      step.prepare();
      this._prepared = true;
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
    this._prepared = false;
    this.overlay.tearDown();
    this.steps.forEach(step => {
      step.tearDown();
    });
  }

  toString() {
    return `[Tutorial - compatibilityMode: {this.compatibilityMode}, ` +
      `complete: {this.complete}, steps: ${this.steps}, overlay: ` +
      `${this.overlay}]`;
  }

  //// PRIVATE

  _end() {
    // Note: Order matters. complete callback should be called after UI is torn down
    this.tearDown();
    this.chariot.endTutorial();
    this.complete();
  }
}

export default Tutorial;
