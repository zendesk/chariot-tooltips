require('./test_helper');
var assert = require("assert");
import Tutorial from '../lib/tutorial'

describe('Tutorial', function() {
  it('reads config', function() {
    var tutorial = new Tutorial('test', { steps: [] });
    assert.equal(typeof tutorial, 'object');
  });

  describe('currentStep', function() {
    it('empty argument', function() {
      var tutorial = new Tutorial('test', { steps: [] });
      assert.equal(tutorial.currentStep(null), null);
    });
  });
});
