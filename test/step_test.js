var assert = require("assert");
require('./test_helper');
import Step from '../modules/step';
import Tutorial from '../modules/tutorial';
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
    }
  };

  context('constructor', () => {
    let step = null,
      tutorial = null;
    before(() => {
      tutorial = new Tutorial('test', {});
      step = new Step(stepConfiguration, tutorial);
    });

    it('reads selectors', () => {
      expect(step.selectors).to.equal(stepConfiguration.selectors);
    });
    it('reads before', () => {
      expect(step.before).to.be.a('Function');
      expect(step.before()).to.equal(stepConfiguration.before());
    });
    it('reads cta', () => {
      expect(step.cta).to.equal(stepConfiguration.cta);
    });
    it('reads tutorial', () => {
      expect(step.tutorial).to.equal(tutorial);
    });
  });

  context('tearDown', () => {
    let step = null,
      tutorial = null,
      clone = null;
    before(() => {
      tutorial = new Tutorial('test', {});
      step = new Step(stepConfiguration, tutorial);
      sinon.stub(step.tooltip, ('tearDown'));
    });
    it('tearsDown with no cloned elements', () => {
      clone = { remove: () => ({}) };
      step.clonedElements = null;
      expect(step.tearDown.bind(step)).not.to.throw(Error);
    });
    it('tearsDown with no cloned elements', () => {
      clone = { remove: () => ({}) };
      step.clonedElements = [];
      expect(step.tearDown.bind(step)).not.to.throw(Error);
    });
    it('tearsDown all clone elements', () => {
      clone = { remove: () => ({}) };
      sinon.spy(clone, 'remove');
      step.clonedElements = [clone];
      step.tearDown();
      expect(clone.remove.calledOnce).to.be.true;
    });
  });
});
