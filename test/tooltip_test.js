require('./test_helper');
import Tooltip from '../modules/tooltip';
import chai from 'chai';
import sinon from 'sinon';
import Style from '../modules/libs/style';
import $ from 'jquery';

let expect = chai.expect;

describe('Tooltip', () => {
  let configuration = {
      position: 'right', // 'top' | 'left' | 'bottom' | 'right'
      text: 'Some text',
      xOffset: '10',
      yOffset: '10',
      anchorElement: "assignee",
      width: '10',
      height: '10',
      iconUrl: '/assets/whatever',
      title: 'Title',
      cta: 'Next',
      subtext: function() {},
      attr: {}
    },
    step = new Object(),
    tutorial = new Object({
      currentStep: function() { return 1; },
      steps: [step]
    }),
    tooltip = null;

  beforeEach(() => {
    tooltip = new Tooltip(configuration, step, tutorial);
  });

  context('constructor', function() {
    it('reads step', function() {
      expect(tooltip.step).to.equal(step);
    });
    it('reads tutorial', function() {
      expect(tooltip.tutorial).to.equal(tutorial);
    });
    it('reads position', function() {
      expect(tooltip.position).to.equal(configuration.position);
    });
    it('reads text', function() {
      expect(tooltip.text).to.equal(configuration.text);
    });
    it('reads xOffset', function() {
      expect(tooltip.xOffset).to.equal(parseInt(configuration.xOffset));
    })
    it('reads xOffset', function() {
      expect(tooltip.yOffset).to.equal(parseInt(configuration.yOffset));
    })
    it('reads width', function() {
      expect(tooltip.width).to.equal(parseInt(configuration.width));
    })
    it('reads height', function() {
      expect(tooltip.height).to.equal(parseInt(configuration.height));
    });
    it('reads iconUrl', function() {
      expect(tooltip.iconUrl).to.equal(configuration.iconUrl);
    });
    it('reads title', function() {
      expect(tooltip.title).to.equal(configuration.title);
    });
    it('reads cta', function() {
      expect(tooltip.cta).to.equal(configuration.cta);
    });
    it('reads subtext', function() {
      expect(tooltip.subtext).to.equal(configuration.subtext);
    });
    it('reads attr', function() {
      expect(tooltip.attr).to.equal(configuration.attr);
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
      let $tooltipArrow = { remove: () => ({}) }
      tooltip.$tooltipArrow = $tooltipArrow;
      sinon.spy($tooltipArrow, 'remove');
      tooltip.tearDown();
      expect($tooltip.remove.calledOnce).to.be.true;
    });
  });

  context('createTooltipTemplate', () => {
    let template = null;
    beforeEach(() => {
      sinon.spy(tooltip, '_iconMarkup');
      sinon.spy(tooltip, '_subtextMarkup');
      template = tooltip._createTooltipTemplate();
    });

    it('uses elements from config to create markup', () => {
      let templateHtml = template.html();
      expect(template.attr('class').includes('step-1')).to.be.true;
      expect(templateHtml.includes(tooltip.title)).to.be.true;
      expect(templateHtml.includes(tooltip.text)).to.be.true;
      expect(templateHtml.includes(tooltip.cta)).to.be.true;
      expect(templateHtml.includes(tooltip.iconUrl)).to.be.true;
      expect(tooltip._subtextMarkup.called).to.be.true;
    });
  });

  context('render', () => {
    it('sets css styles', () => {
      let css = sinon.stub().returns();
      let $markup = $();
      sinon.stub(tooltip, '_createTooltipTemplate', () => { return $markup });
      sinon.stub(tooltip, '_getAnchorElement', () => ({}));
      sinon.stub(Style, "calculateTop", () => {return 0});
      sinon.stub(Style, "calculateLeft", () => {return 0});
      sinon.spy($markup, 'css');

      sinon.spy(tooltip, '_styleTooltip');

      tooltip.render();
      expect($markup.css.calledWith({ top: 0, left: 0, 'z-index': tooltip.z_index })).to.be.true;
      expect(tooltip._styleTooltip.called).to.be.true;
    })
  });
});
