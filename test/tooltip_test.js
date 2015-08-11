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
      subtext: function() {return 'foobar';},
      attr: {},
      arrowLength: 10
    },
    step = { selectors: {} },
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
    it('reads attr', function() {
      expect(tooltip.attr).to.equal(configuration.attr);
    });
    it('reads arrowLength', function() {
      expect(tooltip.arrowLength).to.equal(configuration.arrowLength);
    });
  });

  context('render', () => {
    it('sets css styles', () => {
      let css = sinon.stub().returns();
      let $markup = $('<div></div>');
      sinon.stub(tooltip, '_createTooltipTemplate', () => { return $markup });
      sinon.stub(tooltip, '_getAnchorElement', () => ({}));
      sinon.stub(Style, "calculateTop", () => {return 0});
      sinon.stub(Style, "calculateLeft", () => {return 0});

      tooltip.render();

      expect($markup.css('position')).to.equal('absolute');
      expect($markup.css('top')).to.equal("0px");
      expect($markup.css('left')).to.equal("0px");
      expect(parseInt($markup.css('z-index'))).to.equal(parseInt(tooltip.z_index));
    })
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

  context('_createTooltipTemplate', () => {
    let template = null;
    beforeEach(() => {
      template = tooltip._createTooltipTemplate();
    });

    it('uses elements from config to create markup', () => {
      let templateHtml = template.html();
      expect(tooltip.cta).to.equal(configuration.cta);
      expect(tooltip.subtext).to.equal(configuration.subtext);
      expect(template.attr('class').includes('step-1')).to.be.true;
      expect(templateHtml.includes(tooltip.title)).to.be.true;
      expect(templateHtml.includes(tooltip.text)).to.be.true;
      expect(templateHtml.includes(tooltip.cta)).to.be.true;
      expect(templateHtml.includes(tooltip.iconUrl)).to.be.true;
      expect(templateHtml.includes(tooltip.subtext())).to.be.true;
    });
  });
});
