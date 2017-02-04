import chai from 'chai';
import sinon from 'sinon';
import { fixtures } from './test_helper';
import assert from 'assert';
import Tutorial from '../lib/tutorial'

const expect = chai.expect;
const stepFixture = fixtures.stepFixture;

describe('Tutorial', function() {
  let tutorial;

  function createTutorial(config) {
    return new Tutorial(config, 'test');
  }

  describe('constructor', function() {
    describe('with invalid config', function() {
      it('throws error if config is not an object or array', function() {
        let invalidConfig = '';
        expect(createTutorial.bind(invalidConfig)).to.throw(Error);
      });

      it('throws error if steps is not an array', function() {
        let invalidConfig = { steps: {} };
        expect(createTutorial.bind(invalidConfig)).to.throw(Error);
      });
    });

    it('reads config', function() {
      // tutorial = new Tutorial({ steps: [] }, 'test');
      tutorial = createTutorial({ steps: [] });
      assert.equal(typeof tutorial, 'object');
    });
  });

  describe('next', function() {
    before(function() {
      // tutorial = new Tutorial({ steps: [stepFixture, stepFixture, stepFixture] });
      tutorial = createTutorial({ steps: [stepFixture, stepFixture, stepFixture] });
    });

    it('renders the next step when no args passed', function() {
      tutorial.currentStep = tutorial.getStep(0);
      const stepSpy1 = sinon.spy(tutorial.currentStep, 'tearDown');
      const stepSpy2 = sinon.spy(tutorial.getStep(1), 'render');
      tutorial.next();
      expect(stepSpy1.called).to.be.true;
      expect(stepSpy2.called).to.be.true;
    });

    it('ends tutorial when currentStep is last step', function() {
      tutorial.currentStep = tutorial.getStep(2);
      const spy = sinon.stub(tutorial, 'end');
      tutorial.next();
      expect(spy.called).to.be.true;
    });

    describe('when an arg is passed', function () {
      let tearDownSpy, endSpy;

      before(function() {
        // tutorial = new Tutorial({ steps: [stepFixture, stepFixture, stepFixture] });
        tutorial = createTutorial({ steps: [stepFixture, stepFixture, stepFixture] });
        tutorial.currentStep = tutorial.getStep(0);
        tearDownSpy = sinon.spy(tutorial.currentStep, 'tearDown');
      });

      it('tears down current step and advances to step when step arg is an integer', function() {
        tutorial.next(2);
        expect(tearDownSpy.called).to.be.true;
        assert.equal(tutorial.currentStep, tutorial.getStep(2));
      });

      it('tears down current step and advances to step when arg is a Step instance', function() {
        const nextStep = tutorial.getStep(1);
        tutorial.next(nextStep);
        expect(tearDownSpy.called).to.be.true;
        assert.equal(tutorial.currentStep, nextStep);
      });
    });
  });

  describe('stepNum', function() {
    it('returns null with null argument', function() {
      const tutorial = new Tutorial({ steps: [] });
      assert.equal(tutorial.stepNum(null), null);
    });

    it('returns index + 1 for valid step', function() {
      const tutorial = new Tutorial({ steps: [stepFixture] });
      const step = tutorial.getStep(0);
      assert.equal(tutorial.stepNum(step), 1);
    });
  });
});
