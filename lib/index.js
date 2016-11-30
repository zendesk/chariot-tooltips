import Chariot from './chariot';

window.Chariot = Chariot;

/**
 * Export for various environments.
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Chariot;
} else if (typeof exports !== 'undefined') {
  exports.Chariot = Chariot;
} else if (typeof define === 'function' && define.amd) {
  define([], function() {
    return Chariot;
  });
} else {
  root.Chariot = Chariot;
}
