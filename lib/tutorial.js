import Step from './step';
import Overlay from './overlay';
let Promise = require('es6-promise').Promise;

class Tutorial {
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
   * @param {Chariot} chariot - Reference to the parent Chariot object
   * @param {TutorialConfiguration} config - The configuration for this tutorial
   * @param {string} name - Name of the tutorial
   */
  constructor(config, name, delegate) {
    if (typeof config.steps !== 'object') {
      throw new Error(`steps must be an array.\n${this}`);
      return;
    }
    this.name = name;
    this.delegate = delegate || {};
    this.useTransparentOverlayStrategy = config.useTransparentOverlayStrategy || false;
    this.steps = [];
    this.overlay = new Overlay(config);
    config.steps.forEach((step, index) => {
      this.steps.push(new Step(step, index, this, this.overlay, this.delegate));
    });
    this._prepared = false;
    this._isActive = false;
  }

  /**
   * return {boolean} Whether this tutorial is currently active
   */
  isActive() {
    return this._isActive;
  }

  start() {
    if (this.steps.length === 0) {
      throw new Error(`steps should not be empty.\n${this}`);
      return;
    }

    this._isActive = true;

    Promise.resolve().then(() => {
      if (this.delegate.willBeginTutorial) {
        return this.delegate.willBeginTutorial(this);
      }
    }).then(() => {
      this.overlay.render();
      this.steps[0].render();
    });
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
      this.end();
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

  getStep(index) {
    return this.steps[index];
  }

  end() {
    // Note: Order matters.
    this.tearDown();

    return Promise.resolve().then(() => {
      if (this.delegate.didFinishTutorial) {
        return this.delegate.didFinishTutorial(this);
      }
    }).then(() => {
      this._isActive = false;
    });
  }

  toString() {
    return `[Tutorial - active: ${this._isActive}, ` +
      `useTransparentOverlayStrategy: ${this.useTransparentOverlayStrategy}, ` +
      `steps: ${this.steps}, overlay: ${this.overlay}]`;
  }

}

export default Tutorial;
