var assert = require("assert");
import Step from '../modules/step';
import Tutorial from '../modules/tutorial';
import chai from 'chai';
let expect = chai.expect;


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
      xOffset: '10',
      yOffset: '10',
      anchorElement: "assignee",
      iconUrl: '/assets/whatever'
    },
    cta: 'Next',
    before: function() {
      return 'before';
    }
  };
  context('constructor', function(){
    let step = null,
      tutorial = null;
    before(function(){
      tutorial = new Tutorial('test', {});
      step = new Step(stepConfiguration, tutorial);
    });

    it('reads name', function(){
      expect(step.name).to.equal(stepConfiguration.name);
    });
    it('reads selectors', function(){
      expect(step.selectors).to.equal(stepConfiguration.selectors);
    });
    it('reads before', function(){
      expect(step.before).to.be.a('Function');
      expect(step.before()).to.equal(stepConfiguration.before());
    });
    it('reads cta', function(){
      expect(step.cta).to.equal(stepConfiguration.cta);
    });
    it('reads tutorial', function(){
      expect(step.tutorial).to.equal(tutorial);
    });
  });
});
