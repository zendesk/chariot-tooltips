/*global
history, location
*/

/* Please refer to modules/config.example.js to see how config is structured */

import Tutorial from './tutorial';
import QueryParse from 'query-parse';
require('./libs/ie-shim');

class Chariot {
  constructor(config) {
    this.tutorials = {};
    this.readConfig(config);
    this.listenForPushState();
    this.currentTutorial = null;
  }

  readConfig(config) {
    if (!config || typeof config !== 'object') {
      throw new Error("Config must contains a tutorials hash");
    }
    for (let tutorialName in config) {
      this.tutorials[tutorialName] = new Tutorial(this, config[tutorialName]);
    }
  }

  startTutorial(name) {
    if (this.currentTutorial) {
      return;
    }
    this.currentTutorial = this.tutorials[name];
    this.currentTutorial.start();
  }

  endTutorial() {
    this.currentTutorial = null;
  }

  listenForPushState() {
    // override pushState to listen for url
    // sample url to listen for: agent/tickets/1?tutorial=ticketing
    let processGetParams = () => {
      let parameter = QueryParse.toObject(window.location.search);

      let tutorialName = parameter['?tutorial'] ||
        location.hash.match(/\?.*tutorial=([^&]*)/)[1];
      if (tutorialName !== undefined) {
        this.startTutorial(tutorialName);
      }
    };

    let pushState = history.pushState;
    history.pushState = function(state) {
      let res = null;
      if (typeof pushState === 'function') {
        res = pushState.apply(history, arguments);
      }
      processGetParams();
      return res;
    };

    let replaceState = history.replaceState;
    history.replaceState = function(state) {
      let res = null;
      if (typeof replaceState === 'function') {
        res = replaceState.apply(history, arguments);
      }
      processGetParams();
      return res;
    };

    window.addEventListener('hashchange', function(argument) {
      if (this.currentTutorial) {
        this.currentTutorial.tearDown();
        this.currentTutorial = null;
      }
      processGetParams();
    });

    let popState = window.onpopstate;
    window.onpopstate = (() => {
      let res = null;
      if (typeof popState === 'function') {
        res = popState.apply(arguments);
      }
      if (this.currentTutorial) {
        this.currentTutorial.tearDown();
        this.currentTutorial = null;
      }
      processGetParams();
      return res;
    }).bind(this);

    if (!navigator.userAgent.match(/msie|safari/i) ||
      navigator.userAgent.match(/opr/i)) {
      processGetParams();
    }
  }
}

export
default Chariot;
