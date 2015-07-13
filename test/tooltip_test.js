import Tooltip from '../modules/tooltip';
import chai from 'chai';

let expect = chai.expect;

describe('Tooltip', function() {
  let configuration = {
    position: 'right', // 'top' | 'left' | 'bottom' | 'right'
    text: 'Some text',
    xOffset: '10',
    yOffset: '10',
    anchorElement: "assignee",
    iconUrl: '/assets/whatever',
    width: '10',
    height: '10'
  };
  context('constructor', function() {
    let tutorial = new Object();
    let step = new Object();
    let tooltip = null;
    before(function() {
      tooltip = new Tooltip(configuration, step, tutorial);
    });
    it('read step', function() {
      expect(tooltip.step).to.equal(step);
    });
    it('read tutorial', function() {
      expect(tooltip.tutorial).to.equal(tutorial);
    });
    it('read position', function() {
      expect(tooltip.position).to.equal(configuration.position);
    });
    it('read text', function() {
      expect(tooltip.text).to.equal(configuration.text);
    });
    it('read xOffset', function() {
      expect(tooltip.xOffset).to.equal(parseInt(configuration.xOffset));
    })
    it('read xOffset', function() {
      expect(tooltip.yOffset).to.equal(parseInt(configuration.yOffset));
    })
    it('read width', function() {
      expect(tooltip.width).to.equal(parseInt(configuration.width));
    })
    it('read height', function() {
      expect(tooltip.height).to.equal(parseInt(configuration.height));
    })
  });
});
