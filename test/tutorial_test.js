var assert = require("assert");
import Tutorial from '../modules/tutorial'
describe('Tutorial', function() {
  it('reads config', function() {
    var tutorial = new Tutorial('test', {});
    assert.equal(typeof tutorial, 'object');
  });

  describe('currentStep', function() {
    it('empty argument', function() {
      var tutorial = new Tutorial('test', {});
      assert.equal(tutorial.currentStep(null), null);
    });
  });
});
