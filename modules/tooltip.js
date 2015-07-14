import $ from 'jquery';
import { TOOLTIP_Z_INDEX } from './constants';

class Tooltip {
  constructor(config, step, tutorial) {
    this.step = step;
    this.tutorial = tutorial;
    this.position = config.position;
    this.text = config.text;
    this.xOffset = config.xOffset ? parseInt(config.xOffset) : 10;
    this.yOffset = config.yOffset ? parseInt(config.yOffset) : 10;
    this.width = parseInt(config.width);
    this.height = parseInt(config.height);
    this.anchorElement = config.anchorElement;
    this.name = config.name;
    this.cta = config.cta;
  }

  render() {
    let $tooltip = $(`<div class='chariot-tooltip'>
      <div class='chariot-tooltip-icon'>
        <img class='chariot-tooltip-icon-img' src="${this.iconUrl}"/>
      </div>
      <div class='chariot-tooltip-title'>${this.name}</div>
      <div class='chariot-tooltip-body'>${this.text}</div>
      <div class='chariot-tooltip-steps'>
        "${this.tutorial.currentStep(this)} of ${this.tutorial.steps.length}"
      </div>
      <button class='chariot-tooltip-next'>${this.cta}</button>
    </div>
    `);
    this.$tooltip = $tooltip;

    $('body').append($tooltip);

    $tooltip.css(this.computeTooltipStyles($tooltip));

    // Add event handlers
    $('.chariot-tooltip-next').click(() => {
      this.next();
    });
  }

  computeTooltipStyles($tooltip) {
    return {
      position: 'absolute',
      top: this.calculateTop($tooltip),
      left: this.calculateLeft($tooltip),
      'z-index': TOOLTIP_Z_INDEX
    }
  }

  calculateLeft($tooltip) {
    let $anchor = this.step.getClonedElement(this.anchorElement);
    let offset = 0;
    switch (this.position) {
      case 'left':
        offset = $anchor.offset().left - $tooltip.outerWidth() - this.xOffset;
        break;
      case 'right':
        offset = $anchor.offset().left + $anchor.outerWidth() + this.xOffset;
        break;
      case 'top':
      case 'bottom':
        offset = $anchor.offset().left + $anchor.outerWidth() / 2 -
          $tooltip.outerWidth() / 2 - this.xOffset;
        break;
      default:
        break;
    }
    return offset;
  }

  calculateTop($tooltip) {
    let $anchor = this.step.getClonedElement(this.anchorElement);
    let offset = 0;
    switch (this.position) {
      case 'top':
        offset = $anchor.offset().top - $tooltip.outerHeight() - this.yOffset;
        break;
      case 'bottom':
        offset = $anchor.offset().top + $anchor.outerHeight() + this.yOffset;
        break;
      case 'left':
      case 'right':
        offset = $anchor.offset().top + $anchor.outerHeight() / 2 -
          $tooltip.outerHeight() / 2 - this.yOffset;
        break;
      default:
        break;
    }
    return offset;
  }

  next() {
    this.step.next();
  }

  tearDown() {
    this.$tooltip.remove();
  }
}

export default Tooltip;
