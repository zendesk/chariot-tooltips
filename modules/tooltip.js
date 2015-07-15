import $ from 'jquery';
import { TOOLTIP_Z_INDEX } from './constants';
import Style from './libs/style';

const DEFAULT_PADDING = 10;
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
    this.name = config.name;
    this.cta = config.cta;
  }

  tooltipMarkup() {
    let template = `<div class="chariot-tooltip ${this.arrowClass}">
      ${this.iconMarkup()}
      <div class='chariot-tooltip-title'>${this.name}</div>
      <div class='chariot-tooltip-body'>${this.text}</div>
      <div class='chariot-tooltip-steps'>
        ${this.tutorial.currentStep(this)} of ${this.tutorial.steps.length}
      </div>
      <button class='chariot-tooltip-next'>${this.cta}</button>`;
    return $(template);
  }

  iconMarkup() {
   if (!this.iconUrl) return '';
   return `<div class='chariot-tooltip-icon'>
       <img class='chariot-tooltip-icon-img' src="${this.iconUrl}"/>
     </div>`;
 }

  render() {
    let $tooltip = this.$tooltip = this.tooltipMarkup();
    $('body').append($tooltip);
    this.styleTooltip($tooltip);

    // Add event handlers
    $('.chariot-tooltip-next').click(() => {
      this.next();
    });
  }

  tearDown() {
    if (!this.$tooltip) return;
    this.$tooltip.remove();
  }

  styleTooltip($tooltip) {
    this.positionTooltip($tooltip);
    this.styleArrow($tooltip);
  }

  positionTooltip($tooltip) {
    let $anchorElement = this.getAnchorElement();
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

  styleArrow($tooltip) {
    let arrowDimension = 10; // px
    let arrowOffset = 0.5; // % units
    let positionAttribute;
    if (this.position === 'left' || this.position === 'right') {
      arrowOffset -= this.yOffset / $tooltip.height();
      positionAttribute = 'top';
    } else if (this.position === 'top' || this.position === 'bottom') {
      arrowOffset -= this.xOffset / $tooltip.width();
      positionAttribute = 'left';
    }
    let arrowPercentage = (arrowDimension / $tooltip.height());
    let maxPercentage = 100 - arrowPercentage;
    let minPercentage = arrowPercentage;
    arrowOffset = Math.max(Math.min(arrowOffset, maxPercentage), arrowPercentage) * 100;

    // NOTE: Can't edit pseudo-selectors (:before, :after) with jQuery, so use vanilla JS
    document.styleSheets[0].insertRule(`
      .${this.arrowClass}:after {
        ${positionAttribute}: ${arrowOffset + '%'};
      }
    `, document.styleSheets[0].cssRules.length);
  }

  getAnchorElement() {
    return this.step.getClonedElement(this.anchorElement);
  }

  next() {
    this.step.next();
  }
}

export default Tooltip;
