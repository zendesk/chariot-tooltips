require('./test_helper');
import Tooltip from '../lib/tooltip';
import chai from 'chai';
import sinon from 'sinon';
import Style from '../lib/style';
import Constants from '../lib/constants';
let expect = chai.expect;

describe('Tooltip', function() {
  let configuration = {
      position: 'right', // 'top' | 'left' | 'bottom' | 'right'
      text: 'Some text',
      xOffsetTooltip: '10',
      yOffsetTooltip: '10',
      offsetArrow: '5',
      anchorElement: "assignee",
      width: '10',
      height: '10',
      iconUrl: '/assets/whatever',
      title: 'Title',
      cta: 'Next',
      subtext: () => 'foobar',
      attr: {},
      arrowLength: 10
    },
    step = { selectors: {} },
    tutorial = new Object({
      currentStep: () => 1,
      steps: [step]
    }),
    tooltip = null;

  beforeEach(function() {
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
    it('reads xOffsetTooltip', function() {
      expect(tooltip.xOffsetTooltip).to.equal(parseInt(configuration.xOffsetTooltip));
    });
    it('reads xOffsetTooltip', function() {
      expect(tooltip.yOffsetTooltip).to.equal(parseInt(configuration.yOffsetTooltip));
    });
    it('reads offsetArrow', function() {
      expect(tooltip.offsetArrow).to.equal(parseInt(configuration.offsetArrow));
    });
    it('reads width', function() {
      expect(tooltip.width).to.equal(parseInt(configuration.width));
    });
    it('reads height', function() {
      expect(tooltip.height).to.equal(parseInt(configuration.height));
    });
    it('reads iconUrl', function() {
      expect(tooltip.iconUrl).to.equal(configuration.iconUrl);
    });
    it('reads title', function() {
      expect(tooltip.title).to.equal(configuration.title);
    });
    it('reads attr', function() {
      expect(tooltip.attr).to.equal(configuration.attr);
    });
    it('reads arrowLength', function() {
      expect(tooltip.arrowLength).to.equal(configuration.arrowLength);
    });
  });

  context('render', function() {
    it('sets css styles', function() {
      let css = sinon.stub().returns();
      let $markup = $('<div></div>');
      sinon.stub(tooltip, '_createTooltipTemplate').returns($markup);
      sinon.stub(tooltip, '_getAnchorElement').returns({});
      sinon.stub(Style, "calculateTop").returns(0);
      sinon.stub(Style, "calculateLeft").returns(0);
      tooltip.render();

      expect($markup.css('position')).to.equal('absolute');
      expect($markup.css('top')).to.equal("0px");
      expect($markup.css('left')).to.equal("0px");
      expect(parseInt($markup.css('z-index'))).to.equal(
        parseInt(Constants.TOOLTIP_Z_INDEX));
    });
  });

  context('tearDown', function() {
    it('tearDown with null DOM element', function() {
      tooltip.$tooltip = null;
      expect(tooltip.tearDown.bind(tooltip)).not.to.throw(Error);
    });

    it('tearDown removes element', function() {
      let $tooltip = { remove: () => ({}) };
      tooltip.$tooltip = $tooltip;
      sinon.spy($tooltip, 'remove');
      let $tooltipArrow = { remove: () => ({}) };
      tooltip.$tooltipArrow = $tooltipArrow;
      sinon.spy($tooltipArrow, 'remove');
      tooltip.tearDown();
      expect($tooltip.remove.calledOnce).to.be.true;
    });
  });

  context('_createTooltipTemplate', function() {
    let template = null;

    beforeEach(function() {
      template = tooltip._createTooltipTemplate();
    });

    it('uses elements from config to create markup', function() {
      let templateHtml = template.html();
      expect(tooltip.cta).to.equal(configuration.cta);
      expect(tooltip.subtext).to.equal(configuration.subtext);
      expect(templateHtml.includes(tooltip.title)).to.be.true;
      expect(templateHtml.includes(tooltip.text)).to.be.true;
      expect(templateHtml.includes(tooltip.cta)).to.be.true;
      expect(templateHtml.includes(tooltip.iconUrl)).to.be.true;
      expect(templateHtml.includes(tooltip.subtext())).to.be.true;
    });

    it('includes step number in CSS class and data attribute', function() {
      expect(template.attr('class').includes('chariot-step')).to.be.true;
      expect(template.attr('data-step-order').includes(1)).to.be.true;
    });
  });
});
