import Step from './step';
import Overlay from './overlay';
const Promise = require('es6-promise').Promise;
import Constant from './constants';

const DEFAULT_SCROLL_ANIMATION_DURATION = 500;

class Tutorial {
  /**
   * The tutorial configuration is where the steps of a tutorial are specified,
   * and also allows customization of the overlay style.
   * If optional configuration parameters are not required, the steps property
   * array can be passed in directly as the configuration.
   *
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
   * @property {StepConfiguration[]} steps - An array of step configurations (see below).
   *  Note that this property can be passed as the configuration if the
   *  optional params below are not used.
   * @property {integer} [zIndex=20] - Sets the base z-index value used by this tutorial
   * @property {boolean} [shouldOverlay=true] - Setting to false will disable the
   * overlay that normally appears over the page and behind the tooltips.
   * @property {string} [overlayColor='rgba(255,255,255,0.7)'] - Overlay CSS color
   * @property {Tutorial-onCompleteCallback} [onComplete] - Callback that is called
   * once the tutorial has gone through all steps.
   * @property {boolean} [useTransparentOverlayStrategy=false] - Setting to true will use an
   *  implementation that does not rely on cloning highlighted elements.
   *  Note: This value is ignored if a step contains multiple selectors.
   *  useTransparentOverlayStrategy is named as such because
   * @property {boolean} [animateTooltips=true] - Enables tooltip bouncing at the
   *  beginning and end of each step.
   * @property {boolean} [animateScrolling=true] -
   *  <p>If the next tooltip is not completely within the client bounds, this
   *  property animates the scrolling of the viewport until the next tooltip
   *  is centered.</p>
   *  <p>If false, the viewport is not scrolled.</p
   * @property {integer} [scrollAnimationDuration=500] - Specifies the duration
   *  of the scroll animation above, in milliseconds.
   *  Ignored if animateScrolling is false.
   */

  /**
   * @constructor
   * @param {TutorialConfiguration} config - The configuration for this tutorial
   * @param {string} [name] - Name of the tutorial
   * @param {ChariotDelegate} [delegate] - An optional delegate that responds to
   *  lifecycle callbacks
   */
  constructor(config, name, delegate) {
    this.name = name;
    this.delegate = delegate || {};
    this.steps = [];

    const configType = Object.prototype.toString.call(config);
    let stepConfigs, overlayConfig;
    if (configType === '[object Array]') {
      stepConfigs = config;
      overlayConfig = {};
      this.animateTooltips = true;
      this.animateScrolling = true;
      this.scrollAnimationDuration = DEFAULT_SCROLL_ANIMATION_DURATION;
    } else if (configType === '[object Object]') {
      if (!Array.isArray(config.steps)) {
        throw new Error(`steps must be an array.\n${this}`);
      }
      this.zIndex = config.zIndex;
      this.useTransparentOverlayStrategy = config.useTransparentOverlayStrategy;
      this.animateTooltips = config.animateTooltips === undefined ? true : config.animateTooltips;
      this.animateScrolling = config.animateScrolling === undefined ? true : config.animateScrolling;
      this.scrollAnimationDuration = config.scrollAnimationDuration || DEFAULT_SCROLL_ANIMATION_DURATION;
      stepConfigs = config.steps;
      overlayConfig = config;
    } else {
      throw new Error('config must be an object or array');
    }

    this.overlay = new Overlay(overlayConfig);
    stepConfigs.forEach((stepConfig, index) => {
      this.steps.push(new Step(stepConfig, index, this, this.overlay, this.delegate));
    });
    this._prepared = false;
    this._isActive = false;
  }

  /**
   * Indicates if this tutorial is currently active.
   * return {boolean}
   */
  isActive() {
    return this._isActive;
  }

  /**
   * Starts the tutorial and marks itself as active.
   * @returns {Promise}
   */
  start() {
    if (this.zIndex !== null) {
      Constant.reload({ overlayZIndex: this.zIndex });
    }
    if (this.steps.length === 0) {
      throw new Error(`steps should not be empty.\n${this}`);
      return;
    }

    this._isActive = true;
    // render overlay first to avoid willBeingTutorial delay overlay showing up
    this.overlay.render();
    return Promise.resolve().then(() => {
      if (this.delegate.willBeginTutorial) {
        return this.delegate.willBeginTutorial(this);
      }
    }).then(() => {
      this.currentStep = this.steps[0];
      this.currentStep.render();
    }).catch(() => {
      this.tearDown();
    });
  }

  /**
   * Prepares each step of the tutorial, to speedup rendering.
   * @returns {undefined}
   */
  prepare() {
    if (this._prepared) return;
    this.steps.forEach(step => {
      step.prepare();
      this._prepared = true;
    });
  }

  /**
   * Advances to the next step in the tutorial, or ends tutorial if no more
   * steps.
   *
   * @param {integer|Step} [step] - If step is an integer, advances to that
   *  step. If step is a Step instance, that step
   *  If no argument is passed in, the current step's index is incremented to
   *  determine the next step.
   * @returns {undefined}
   */
  next(step) {
    let currentStepIndex = -1;
    if (!step) {
      currentStepIndex = this.steps.indexOf(this.currentStep);
      if (currentStepIndex < 0) {
        throw new Error('step not found');
      } else if (currentStepIndex === this.steps.length - 1) {
        this.end();
        return;
      }
    }

    if (this.currentStep) {
      this.currentStep.tearDown();
    }

    let nextStep;
    if (step) {
      if (typeof step === 'number') {
        if (step < 0 || step >= this.steps.length) {
          throw new Error(`step is outside bounds of steps array (length: ${this.steps.length})`);
        }
        nextStep = this.steps[step];
      } else if (Object.prototype.toString.call(step) === '[object Object]') {
        nextStep = step;
      } else {
        throw new Error('step arg must be number or object');
      }
    } else {
      nextStep = this.steps[currentStepIndex + 1];
    }

    this.currentStep = nextStep;
    nextStep.render();
  }

  /**
   * Returns the one-indexed (human-friendly) step number.
   *
   * @param {Step} step - The step instance for which we want the index
   * @returns {integer} stepNum - The one-indexed step number
   */
  stepNum(step) {
    if (step === null) return null;
    return this.steps.indexOf(step) + 1;
  }

  /**
   * Tears down the internal overlay and tears down each individual step
   * Nulls out internal references.
   * @returns {undefined}
   */
  tearDown() {
    this._prepared = false;
    this.overlay.tearDown();
    this.steps.forEach(step => {
      step.tearDown();
    });
    this.currentStep = null;
  }

  /**
   * Retrieves the Step object at index.
   * @returns {Step} step
   */
  getStep(index) {
    return this.steps[index];
  }

  /**
   * Ends the tutorial by tearing down all the steps (and associated tooltips,
   * overlays).
   * Also marks itself as inactive.
   * @param {boolean} [forced=false] - Indicates whether tutorial was forced to
   *  end
   * @returns {undefined}
   */
  end(forced = false) {
    // Note: Order matters.
    this.tearDown();

    return Promise.resolve().then(() => {
      if (this.delegate.didFinishTutorial) {
        return this.delegate.didFinishTutorial(this, forced);
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
