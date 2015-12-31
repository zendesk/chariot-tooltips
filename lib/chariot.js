/*global
history, location
*/

/* Please refer to /example/config.example.js to see how config is structured */

import Tutorial from './tutorial';
import QueryParse from 'query-parse';
require('./ie-shim');
let initialState = true;

class Chariot {
  /**
   * The master Chariot configuration dictionary can consist of multiple
   *  tutorial configurations.
   * @typedef ChariotConfiguration
   * @property {Object.<string, TutorialConfig>} config - The main configuration
   *  containing all tutorials.
   *
   */

  /**
   * The delegate optionally responds to lifecycle callbacks from Chariot.
   * @typedef ChariotDelegate
   * @property {Object} delegate - The object that responds to the
   *  following lifecycle callbacks.
   *
   * willBeginTutorial -> (willBeginStep -> willRenderOverlay -> didShowOverlay
   * -> willRenderTooltip -> didRenderTooltip -> didFinishStep) (repeat # steps)
   * -> didFinishTutorial
   *
   *
   * Called once before a tutorial begins.
   * @callback willBeginTutorial
   * @param {Tutorial} tutorial - The Tutorial object
   *
   * Called once after a tutorial is finished.
   * @callback didFinishTutorial tutorial
   * @param {Tutorial} tutorial - The Tutorial object
   * @param {boolean} forced - Indicates whether tutorial was forced to end
   *
   * Called once before each step begins.
   * Return a promise here if you have async callbacks you want resolved before
   * continuing.
   * @callback willBeginStep
   * @param {Step} step - The current Step object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   * @returns {Promise} [promise] Return a promise if you have async callbacks
   * that must be resolved before continuing.
   *
   * Called once after each step is finished.
   * @callback didFinishStep
   * @param {Step} step - The current Step object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   *
   * Called once before each overlay is shown.
   * @callback willShowOverlay
   * @param {Overlay} overlay - The current Overlay object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   *
   * Called once after each overlay is shown.
   * @callback didShowOverlay
   * @param {Overlay} overlay - The current Overlay object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   *
   * Called once before each tooltip is rendered.
   * @callback willRenderTooltip
   * @param {Tooltip} tooltip - The current Tooltip object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   *
   * Called once after each tooltip is rendered.
   * @callback didRenderTooltip
   * @param {Tooltip} tooltip - The current Tooltip object
   * @param {int} stepIndex - Index of current Step
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this Step
   *
   * Called when handling browser popState events.
   * @callback handlePopState
   *
   * * Called when handling browser pushState events.
   * @callback handlePushState
   *
   * * Called when handling browser replaceState events.
   * @callback handleReplaceState
   *
   * * Called when handling browser hashChange events.
   * @callback handleHashChange
   */

  /**
   * @constructor
   * @param {ChariotConfiguration} config - The main configuration for all
   *  tutorials
   * @param {ChariotDelegate} [delegate] - An optional delegate that responds to
   *  lifecycle callbacks
   */
  constructor(config, delegate) {
    this.config = config;
    this.delegate = delegate;
    this.tutorials = {};
    this._readConfig(config);
    this._listenForPushState();
  }

  /**
   * Sets the chariot delegate.
   * @param {ChariotDelegate} [delegate] - An object that responds to
   *  lifecycle callbacks
   */
  setDelegate(delegate) {
    this.delegate = delegate;
  }

  /**
   * Starts a tutorial with the given name.
   * Won't start a tutorial if one is currently running.
   * @param {string} name - Name of the tutorial to start
   * @returns {Tutorial} tutorial - The Tutorial object, or undefined if
   *  another tutorial is currently active.
   */
  startTutorial(name) {
    if (this.currentTutorial()) {
      return;
    }
    let tutorial = this.tutorials[name];
    tutorial.start();
    return tutorial;
  }

  /**
   * Ends the current tutorial.
   * @returns {undefined}
   */
  endTutorial() {
    let tutorial = this.currentTutorial();
    tutorial.end(true);
  }

  /**
   * Returns the current tutorial, if any.
   * @returns {Tutorial} tutorial - The current tutorial, or null if none active
   */
  currentTutorial() {
    for (let tutorialName in this.tutorials) {
      let tutorial = this.tutorials[tutorialName];
      if (tutorial.isActive()) return tutorial;
    }
  }

  /**
   * Static method for creating a Tutorial object without needing to instantiate
   * chariot with a large configuration and named tutorials.
   * @param {TutorialConfiguration} config - The tutorial configuration
   * @param {ChariotDelegate} [delegate] - An optional delegate that responds to
   *  lifecycle callbacks
   */
  static createTutorial(config, delegate) {
    return new Tutorial(config, '', delegate);
  }

  toString() {
    return `[Chariot - config: ${this.config}, tutorials: {this.tutorials}]`;
  }

  //// PRIVATE

  _readConfig(config) {
    if (!config || typeof config !== 'object') {
      throw new Error(`Config must contains a tutorials hash.\n${this}`);
    }
    for (let tutorialName in config) {
      this.tutorials[tutorialName] = new Tutorial(
        config[tutorialName], tutorialName, this.delegate);
    }
  }

  _listenForPushState() {
    // override pushState to listen for url
    // sample url to listen for: agent/tickets/1?tutorial=ticketing
    let processGetParams = () => {
      let parameter = QueryParse.toObject(window.location.search);
      let match = location.hash.match(/\?.*tutorial=([^&]*)/)
      let tutorialName = parameter['?tutorial'] || (match ? match[1] : null);
      if (tutorialName) {
        this.startTutorial(tutorialName);
      }
    };

    let pushState = history.pushState;
    history.pushState = function(state) {
      initialState = false;
      let res = null;
      if (typeof pushState === 'function') {
        res = pushState.apply(history, arguments);
      }
      processGetParams();
      return res;
    };

    let replaceState = history.replaceState;
    history.replaceState = function(state) {
      initialState = false;
      let res = null;
      if (typeof replaceState === 'function') {
        res = replaceState.apply(history, arguments);
      }
      processGetParams();
      return res;
    };

    window.addEventListener('hashchange', argument => {
      let tutorial = this.currentTutorial();
      if (tutorial) {
        tutorial.tearDown();
      }
      processGetParams();
    });

    let popState = window.onpopstate;
    window.onpopstate = () => {
      if (initialState) return;
      let res = null;
      if (typeof popState === 'function') {
        res = popState.apply(arguments);
      }
      let tutorial = this.currentTutorial();
      if (tutorial) {
        tutorial.tearDown();
      }
      processGetParams();
      return res;
    };

    if (!navigator.userAgent.match(/msie 9/i)) {
      processGetParams();
    }
  }
}

export
default Chariot;
