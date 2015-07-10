import Tutorial from './tutorial';
import QueryParse from 'query-parse';

class Chariot {
    constructor(config) {
        this.tutorials = {};
        this.readConfig(config);
        this.listenForPushState();
        this.listenToHashChange();
    }

    readConfig(config) {
        if (!config.tutorials || typeof config.tutorials !== "object") {
            throw new Error("Config must contains a tutorials hash");
        }
        for (let tutorialName in config.tutorials) {
            this.tutorials[tutorialName] = new Tutorial(tutorialName, config.tutorials[tutorialName]);
        }
    }

    startTutorial(name) {
        this.tutorials[name].start();
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
        }

        var pushState = history.pushState;
        history.pushState = function(state) {
            // let parameter = QueryParse.toObject(window.location.search);
            // if (parameter['tutorial'] && config) {
            //     this.startTutorial(name);
            // }
            processGetParams();
            return pushState.apply(history, arguments);
        }

        processGetParams();
    }

    listenToHashChange() {
        let processLocationHash = e => {
            let parameter = QueryParse.toObject(location.hash);
            // if (location.hash === "#tutorial=ticketing") {
            let tutorialName = parameter['#tutorial'];
            if (tutorialName !== undefined) {
                this.startTutorial(tutorialName);
            }
        }

        window.onhashchange = processLocationHash;

        processLocationHash();
    }
}

export default Chariot;
