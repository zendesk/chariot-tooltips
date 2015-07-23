/*global
history, location
*/

/* Please refer to modules/config.example.js to see how config is structured */

import Tutorial from './tutorial';
import QueryParse from 'query-parse';

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

      let tutorialName = parameter['?tutorial'];
      if (tutorialName !== undefined) {
        this.startTutorial(tutorialName);
      }
    };

    let pushState = history.pushState;
    history.pushState = function(state) {
      let res = pushState.apply(history, arguments);
      processGetParams();
      return res;
    };

    let replaceState = history.replaceState;
    history.replaceState = function(state) {
      let res = replaceState.apply(history, arguments);
      processGetParams();
      return res;
    };

    let popState = window.onpopstate;
    window.onpopstate = () => {
      let res = null;
      if (typeof popState === 'function') {
        res = popState.apply(arguments);
      }
      if (this.currentTutorial) {
        this.currentTutorial.end();
      }
      processGetParams();
      return res;
    };

    processGetParams();
  }
}

export
default Chariot;
