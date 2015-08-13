var assert = require("assert");
require('./test_helper');
import Step from '../modules/step';
import Tutorial from '../modules/tutorial';
import Style from '../modules/libs/style';
import $ from 'jquery';
import chai from 'chai';
import sinon from 'sinon';
let expect = chai.expect;


describe('Step', () => {
  let stepConfiguration = {
    name: 'Internal or Public?',
    selectors: {
      assignee: "#input",
      assignLabel: "#label"
    },
    tooltip: {
      position: 'right', // 'top' | 'left' | 'bottom' | 'right'
      text: 'Some text',
      xOffset: '10',
      yOffset: '10',
      anchorElement: "assignee",
      iconUrl: '/assets/whatever'
    },
    cta: 'Next',
    before: () => {
      return 'before';
    },
    after: () => {
      return 'after';
    }
  };

  context('constructor', () => {
    let step = null,
      tutorial = null;

    before(() => {
      tutorial = new Tutorial('test', { steps: [] });
      step = new Step(stepConfiguration, tutorial);
    });

    it('reads selectors', () => {
      expect(step.selectors).to.equal(stepConfiguration.selectors);
    });

    it('reads before and after', () => {
      expect(step.before).to.be.a('Function');
      expect(step.before()).to.equal(stepConfiguration.before());
      expect(step.after).to.be.a('Function');
      expect(step.after()).to.equal(stepConfiguration.after());
    });

    it('reads tutorial', () => {
      expect(step.tutorial).to.equal(tutorial);
    });
  });

  context('tearDown', () => {
    let step = null,
      tutorial = null;

    before(() => {
      tutorial = new Tutorial('test', { steps: [] });
      step = new Step(stepConfiguration, tutorial);
      sinon.stub(step.tooltip, ('tearDown'));
    });

    it('clears cached styles', () => {
      sinon.stub(Style, 'clearCachedStylesForElement');
      step.tearDown();
      expect(Style.clearCachedStylesForElement.calledTwice).to.be.true;
    });

    it('removes all clone elements', () => {
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

    it('tears down tooltip', () => {
      expect(step.tooltip.tearDown.called).to.be.true;
    });
  });
});
