import chai from 'chai';
import sinon from 'sinon';
import Chariot from '../lib/chariot'

let helper = require('./test_helper');
let assert = require("assert");
let expect = chai.expect;

describe('Chariot', function() {
  let delegate = null;
  let tutorialName = "tutorialName";
  let config = helper.fixtures.configFixture;

  describe('#startTutorial', function() {
    it('returns null when there is a current tutorial', function() {
      let chariot = new Chariot(config, delegate);
      let tutorial = chariot.startTutorial(tutorialName);
      assert.equal(chariot.startTutorial("differentTutorial"), null);
    });

    it('returns the started tutorial when no current tutorial', function() {
      let chariot = new Chariot(config, delegate);
      let tutorial = chariot.startTutorial(tutorialName);
      assert.equal(tutorial.name, tutorialName);
    });
  });

  describe('#endTutorial', function() {
    it('ends the current tutorial', function() {
      let chariot = new Chariot(config, delegate);
      let tutorial = chariot.startTutorial(tutorialName);
      sinon.stub(tutorial, ('end'));
      chariot.endTutorial();
      expect(tutorial.end.called).to.be.true;
    });
  });

  describe('#currentTutorial', function() {
    it('returns null when no tutorial has started', function() {
      let chariot = new Chariot({}, delegate);
      assert.equal(chariot.currentTutorial(), null);
    });

    it('returns the current tutorial if started', function() {
      let chariot = new Chariot(config, delegate);
      let tutorial = chariot.startTutorial(tutorialName);
      assert.equal(chariot.currentTutorial(), tutorial);
    });
  });

  describe('#Chariot.createTutorial', function() {
    it('returns a tutorial with a valid config', function() {
      let tutorial = Chariot.createTutorial(config[tutorialName], delegate);
      expect(tutorial).to.not.equal(null);
    });
  });

  describe('#Chariot.startTutorial', function() {
    it('returns and starts a tutorial with a valid config', function() {
      let stub = { start: () => '' };
      sinon.stub(Chariot, 'createTutorial').returns(stub);
      sinon.stub(stub, 'start');
      let tutorial = Chariot.startTutorial(config[tutorialName], delegate);
      expect(tutorial).to.equal(stub);
      expect(stub.start.called).to.be.true;
    });
  });
});
