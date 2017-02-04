var assert = require("assert");
require('./test_helper');
import Step from '../lib/step';
import Tutorial from '../lib/tutorial';
import Style from '../lib/style';
import chai from 'chai';
import sinon from 'sinon';
const expect = chai.expect;


describe('Step', function() {
  let stepConfiguration = {
    name: 'Internal or Public?',
    selectors: {
      assignee: "#input",
      assignLabel: "#label"
    },
    tooltip: {
      position: 'right', // 'top' | 'left' | 'bottom' | 'right'
      text: 'Some text',
      xOffsetTooltip: '10',
      yOffsetTooltip: '10',
      anchorElement: "assignee",
      iconUrl: '/assets/whatever'
    },
    cta: 'Next'
  };

  describe('constructor', function() {
    let chariot = {},
      step = null,
      index = 0,
      tutorial = null,
      overlay = null;

    function createStep(config, tutorial) {
      return new Step(config, index, tutorial, overlay);
    }

    before(function() {
      tutorial = new Tutorial({ steps: [] }, 'tutorialName');
    });

    describe('with invalid config', function() {
      it('throws error if selectors is missing', function() {
        let invalidConfig = Object.assign({}, stepConfiguration);
        delete invalidConfig.selectors;
        expect(createStep.bind(invalidConfig, tutorial)).to.throw(Error);
      });

      it('throws error if selectors is null', function() {
        let invalidConfig = Object.assign({}, stepConfiguration, { selectors: null });
        expect(createStep.bind(invalidConfig, tutorial)).to.throw(Error);
      });

      it('throws error if selectors object has no keys', function() {
        let invalidConfig = Object.assign({}, stepConfiguration, { selectors: {} });
        expect(createStep.bind(invalidConfig, tutorial)).to.throw(Error);
      });

      it('throws error if any of the selector values is invalid', function() {
        let invalidConfig = Object.assign({}, stepConfiguration, { selectors: ['valid', undefined] });
        expect(createStep.bind(invalidConfig, tutorial)).to.throw(Error);
      });
    });

    describe('with valid arguments and configuration', function() {
      before(function() {
        step = createStep(stepConfiguration, tutorial);
      });

      it('reads index', function() {
        expect(step.index).to.equal(index);
      });

      it('reads selectors', function() {
        expect(step.selectors).to.equal(stepConfiguration.selectors);
      });

      it('reads tutorial', function() {
        expect(step.tutorial).to.equal(tutorial);
      });
    });
  });

  describe('getClonedElement', function() {
    let step = null,
      tutorial = {},
      overlay = null;

    before(function() {
      step = new Step(stepConfiguration, 0, tutorial, overlay);
    });

    it('returns null for invalid selectorName', function() {
      let result = step.getClonedElement('random');
      expect(result).to.equal(undefined);
    });

    it('returns undefined for selectorName that has not been cloned', function() {
      let result = step.getClonedElement('assignee');
      expect(result).to.equal(undefined);
    });

    it('returns clone for selectorName', function() {
      let selectorName = 'assignee';
      let clone = 'clone';
      step._elementMap[selectorName].clone = clone;
      let result = step.getClonedElement(selectorName);
      expect(result).to.equal(clone);
    });
  });

  describe('tearDown', function() {
    let chariot = {},
      step = null,
      tutorial = null,
      overlay = null;

    before(function() {
      tutorial = new Tutorial({ steps: [] }, 'tutorialName');
      step = new Step(stepConfiguration, 0, tutorial, overlay);
      sinon.stub(step.tooltip, ('tearDown'));
    });

    it('clears cached styles', function() {
      sinon.stub(Style, 'clearCachedStylesForElement');
      step.tearDown();
      expect(Style.clearCachedStylesForElement.calledTwice).to.be.true;
    });

    it('removes all clone elements', function() {
      for (let selectorName in stepConfiguration.selectors) {
        let clone = { remove: () => {} };
        sinon.spy(clone, 'remove');
        step._elementMap[selectorName].clone = clone;
      }

      step.tearDown();
      for (let selectorName in stepConfiguration.selectors) {
        expect(step._elementMap[selectorName].clone.remove.calledOnce).to.be.true;
      }
    });

    it('tears down tooltip', function() {
      expect(step.tooltip.tearDown.called).to.be.true;
    });
  });
});
