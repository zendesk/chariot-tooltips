import $ from 'jquery';
import { TOOLTIP_Z_INDEX } from './constants';
import Style from './libs/style';

const DEFAULT_PADDING = 15;

class Tooltip {
  constructor(config, step, tutorial) {
    this.step = step;
    this.tutorial = tutorial;
    this.position = config.position;
    this.text = config.text;
    let defaultXOffset, defaultYOffset, arrowClass = 'chariot-tooltip';
    switch (this.position) {
      case 'left':
        defaultXOffset = -DEFAULT_PADDING;
        defaultYOffset = 0;
        arrowClass += '-arrow-right';
        break;
      case 'right':
        defaultXOffset = DEFAULT_PADDING;
        defaultYOffset = 0;
        arrowClass += '-arrow-left';
        break;
      case 'top':
        defaultXOffset = 0;
        defaultYOffset = -DEFAULT_PADDING;
        arrowClass += '-arrow-bottom';
        break;
      case 'bottom':
        defaultXOffset = 0;
        defaultYOffset = DEFAULT_PADDING;
        arrowClass += '-arrow-top';
        break;
    }

    this.xOffset = config.xOffset ? parseInt(config.xOffset) : defaultXOffset;
    this.yOffset = config.yOffset ? parseInt(config.yOffset) : defaultYOffset;
    this.arrowClass = arrowClass;
    this.z_index = TOOLTIP_Z_INDEX;

    this.width = parseInt(config.width);
    this.height = parseInt(config.height);
    this.anchorElement = config.anchorElement;

    // TODO: Sanitize these user-inputted elements
    this.iconUrl = config.iconUrl;
    this.title = config.title;
    this.cta = config.cta;
    this.subtext = config.subtext;
    this.attr = config.attr || {};
  }

  createTooltipTemplate() {
    let stepNum = this.currentStep();
    let template = `
      <div class="chariot-tooltip chariot-step-${stepNum}">
        <div class="chariot-tooltip-arrow ${this.arrowClass}"></div>
        <div class="chariot-tooltip-content">
          ${this.iconMarkup()}
        </div>
        <div class="chariot-tooltip-header">
          ${this.title}
        </div>
        <div class="chariot-tooltip-content">
          <p>${this.text}</p>
        </div>
        <div class="chariot-btn-row">
          <span class='chariot-tooltip-subtext'>${this.subtextMarkup()}</span>
          <button class="btn btn-inverse btn-right">${this.cta}</button>
        </div>
      </div>`;
    let $template = $(template);

    // Add default data attributes
    this.attr['data-step-order'] = stepNum;
    $template.attr(this.attr);
    return $template;
  }

  currentStep() {
    return this.tutorial.currentStep(this.step);
  }

  iconMarkup() {
    if (!this.iconUrl) return '';
    return `<div class='chariot-tooltip-icon'>
       <img class='chariot-tooltip-icon-img' src="${this.iconUrl}"/>
     </div>`;
  }

  subtextMarkup() {
    if (!this.subtext) return '';
    return this.subtext(this.currentStep(), this.tutorial.steps.length);
  }

  createTooltipArrow() {
    return $(`<div class="${this.arrowClass}"></div>`);
  }

  render() {
    let $tooltip = this.$tooltip = this.createTooltipTemplate();
    $('body').append($tooltip);

    let $tooltipArrow = this.$tooltipArrow = $('.chariot-tooltip-arrow');
    this.styleTooltip($tooltip, $tooltipArrow);

    // Add event handlers
    $('.chariot-btn-row button').click(() => {
      this.next();
    });
  }

  tearDown() {
    if (!this.$tooltip) return;
    this.$tooltip.remove();
    this.$tooltip = null;
    this.$tooltipArrow.remove();
    this.$tooltipArrow = null;
  }

  styleTooltip($tooltip, $tooltipArrow) {
    this.positionTooltip($tooltip);
    this.positionArrow($tooltip, $tooltipArrow);
  }

  positionTooltip($tooltip) {
    let $anchorElement = this.getAnchorElement();
    if (!$anchorElement) return;

    let top = Style.calculateTop($tooltip,
      $anchorElement, this.yOffset, this.position);
    let left = Style.calculateLeft($tooltip,
      $anchorElement, this.xOffset, this.position);
    let tooltipStyles = {
      top: top,
      left: left,
      'z-index': this.z_index
    };
    $tooltip.css(tooltipStyles);
  }

  /*
    Positions the arrow to point at the center of the anchor element.
    If a tooltip is offset via xOffset / yOffset, the arrow will continue to point to center.
  */
  positionArrow($tooltip, $tooltipArrow) {
    let arrowDimension = 15; // px
    let tooltipStyles = { 'z-index': this.z_index + 1 };
    let top, left, min, max;

    switch (this.arrowClass) {
      case 'chariot-tooltip-arrow-left':
        top = (($tooltip.outerHeight() - arrowDimension) / 2) - this.yOffset;
        min = arrowDimension / 2;
        max = $tooltip.outerHeight() - 2 * arrowDimension;
        tooltipStyles.top = Math.max(Math.min(top, max), min);

        tooltipStyles.left = -arrowDimension / 2 - 2; // 2 is a fudge factor
        break;
      case 'chariot-tooltip-arrow-right':
        top = (($tooltip.outerHeight() - arrowDimension) / 2) - this.yOffset;
        min = arrowDimension / 2;
        max = $tooltip.outerHeight() - 2 * arrowDimension;
        tooltipStyles.top = Math.max(Math.min(top, max), min);

        tooltipStyles.right = -arrowDimension / 2 - 1;
        break;
      case 'chariot-tooltip-arrow-bottom':
        left = (($tooltip.outerWidth() - arrowDimension) / 2) - this.xOffset;
        min = arrowDimension / 2;
        max = $tooltip.outerWidth() - 2 * arrowDimension;
        tooltipStyles.left = Math.max(Math.min(left, max), min);

        tooltipStyles.bottom = -arrowDimension / 2 - 1;
        break;
      case 'chariot-tooltip-arrow-top':
        left = (($tooltip.outerWidth() - arrowDimension) / 2) - this.xOffset;
        min = arrowDimension / 2;
        max = $tooltip.outerWidth() - 2 * arrowDimension;
        tooltipStyles.left = Math.max(Math.min(left, max), min);

        tooltipStyles.top = -arrowDimension / 2 - 2;
        break;
    }

    $tooltipArrow.css(tooltipStyles);
  }

  getAnchorElement() {
    // Look for defined selectors first
    let clonedSelectedElement = this.step.getClonedElement(this.anchorElement);
    if (clonedSelectedElement) return clonedSelectedElement;
    let $element = $(this.anchorElement);
    if (!$element) {
      console.log("Anchor element not found: " + this.anchorElement);
    }
    return $element;
  }

  next() {
    this.step.next();
  }
}

export default Tooltip;
