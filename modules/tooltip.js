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
    let defaultXOffset,
      defaultYOffset;
    switch (this.position) {
      case 'left':
        defaultXOffset = -DEFAULT_PADDING;
        defaultYOffset = 0;
        break;
      case 'right':
        defaultXOffset = DEFAULT_PADDING;
        defaultYOffset = 0;
        break;
      case 'top':
        defaultXOffset = 0;
        defaultYOffset = -DEFAULT_PADDING;
        break;
      case 'bottom':
        defaultXOffset = 0;
        defaultYOffset = DEFAULT_PADDING;
        break;
    }
    this.xOffset = config.xOffset ? parseInt(config.xOffset) : defaultXOffset;
    this.yOffset = config.yOffset ? parseInt(config.yOffset) : defaultYOffset;
    this.width = parseInt(config.width);
    this.height = parseInt(config.height);
    this.anchorElement = config.anchorElement;
    this.name = config.name;
    this.cta = config.cta;
  }


  tooltipMarkup() {
    return $(`<div class='chariot-tooltip'>
      <div class='chariot-tooltip-icon'>
        <img class='chariot-tooltip-icon-img' src="${this.iconUrl}"/>
      </div>
      <div class='chariot-tooltip-title'>${this.name}</div>
      <div class='chariot-tooltip-body'>${this.text}</div>
      <div class='chariot-tooltip-steps'>
        ${this.tutorial.currentStep(this)} of ${this.tutorial.steps.length}
      </div>
      <button class='chariot-tooltip-next'>${this.cta}</button>
    </div>
    `);
  }

  render() {
    let $tooltip = this.$tooltip = this.tooltipMarkup();
    $('body').append($tooltip);
    $tooltip.css(this.computeTooltipStyles($tooltip));
    // Add event handlers
    $('.chariot-tooltip-next').click(() => {
      this.next();
    });
  }

  tearDown() {
    if (!this.$tooltip) return;
    this.$tooltip.remove();
  }

  computeTooltipStyles($tooltip) {
    let $anchorElement = this.getAnchorElement();
    let top = Style.calculateTop($tooltip,
      $anchorElement, this.yOffset, this.position);
    let left = Style.calculateLeft($tooltip,
      $anchorElement, this.xOffset, this.position);
    return {
      position: 'absolute',
      top: top,
      left: left,
      'z-index': TOOLTIP_Z_INDEX
    }
  }

  getAnchorElement() {
    return this.step.getClonedElement(this.anchorElement);
  }

  next() {
    this.step.next();
  }
}

export default Tooltip;
