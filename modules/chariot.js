import Tutorial from './tutorial';
import QueryParse from 'query-parse';

class Chariot {
    constructor(config) {
    	self.tutorials = {};
        readConfig(config);
        listenForPushState();
    }

    readConfig(config) {
    	if (!config.tutorials || typeof config.tutorials !== Object) {
			throw new Error("Config must contains a tutorials Array");
    	}
    	for (let tutorialName of config.tutorials) {
    		self.tutorials[tutorialName] = new Tutorial(tutorialName, config.tutorials[tutorialName]);
    	}
    }

    startTutorial(name) {
    	self.tutorials[tutorialName].start();
    }

    listenForPushState() {
	    // override pushState to listen for url
	    // sample url to listen for: agent/tickets/1?tutorial=ticketing
		var pushState = history.pushState;
		history.pushState = function(state) {
		    parameter = QueryParse.toObject(window.location.search);
		    if (parameter['tutorial'] && config) {
		    	self.startTutorial(name);
		    }
		    return pushState.apply(history, arguments);
		}
    }
}

export default Chariot;
