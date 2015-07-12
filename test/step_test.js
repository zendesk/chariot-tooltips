var assert = require("assert");
import Step from '../modules/step';
import Tutorial from '../modules/tutorial'


describe('Step', function() {
  it('reads config', function(){
  	var tutorial = new Tutorial('test', {});
  	var step = new Step({tooltip: {}}, tutorial);
  	assert.equal(typeof step, 'object');
  });
});
