require('./test_helper');
import Tooltip from '../modules/tooltip';
import chai from 'chai';
import sinon from 'sinon';
import Style from '../modules/libs/style';
import $ from 'jquery';

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
  },
    tutorial = new Object(),
    step = new Object(),
    tooltip = null;
  beforeEach(() => {
    tooltip = new Tooltip(configuration, step, tutorial);
  })
  context('constructor', function() {
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
    });
  });

  context('tearDown', () => {
    it('tearDown with null DOM element', () => {
      tooltip.$tooltip = null;
      expect(tooltip.tearDown.bind(tooltip)).not.to.throw(Error);
    });
    it('tearDown removes element', () => {
      let $tooltip = { remove: () => ({}) }
      tooltip.$tooltip = $tooltip;
      sinon.spy($tooltip, 'remove');
      tooltip.tearDown();
      expect($tooltip.remove.calledOnce).to.be.true;
    });
  });

  context('render', () => {
    it('sets css styles', () => {
      let css = sinon.stub().returns();
      let $markup = $();
      sinon.stub(tooltip, 'tooltipMarkup', () => { return $markup });
      sinon.stub(tooltip, 'getAnchorElement', () => ({}));
      sinon.stub(Style, "calculateTop", () => {return 0});
      sinon.stub(Style, "calculateLeft", () => {return 0});
      sinon.spy($markup, 'css');
      tooltip.render();
      expect($markup.css.calledWith({ top: 0, left: 0, 'z-index': tooltip.z_index })).to.be.true;
    })
  });
});
