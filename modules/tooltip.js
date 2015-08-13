import $ from 'jquery';
import { TOOLTIP_Z_INDEX } from './constants';
import Style from './libs/style';

// distance between arrow tip and edge of tooltip, not including border
const DEFAULT_ARROW_LENGTH = 11;

class Tooltip {
  constructor(config, step, tutorial) {
    this.config = config;
    this.step = step;
    this.tutorial = tutorial;
    this.position = config.position;
    let arrowClass = 'chariot-tooltip';

    switch (this.position) {
      case 'left':
        arrowClass += '-arrow-right';
        break;
      case 'right':
        arrowClass += '-arrow-left';
        break;
      case 'top':
        arrowClass += '-arrow-bottom';
        break;
      case 'bottom':
        arrowClass += '-arrow-top';
        break;
    }

    this.xOffset = config.xOffset ? parseInt(config.xOffset) : 0;
    this.yOffset = config.yOffset ? parseInt(config.yOffset) : 0;

    this.arrowClass = arrowClass;
    this.z_index = TOOLTIP_Z_INDEX;

    this.width = parseInt(config.width);
    this.height = parseInt(config.height);
    let selectorKeys = Object.keys(this.step.selectors);
    if (selectorKeys.length > 1 && !config.anchorElement) {
      throw new Error('anchorElement is not optional when more than one ' +
        'selector exists:\n' + this);
    }
    this.anchorElement = config.anchorElement || selectorKeys[0];
    this.text = config.text;
    this.iconUrl = config.iconUrl;
    this.title = config.title;
    this.attr = config.attr || {};
    this.arrowLength = config.arrowLength || DEFAULT_ARROW_LENGTH;
  }

  currentStep() {
    return this.tutorial.currentStep(this.step);
  }

  render() {
    let $tooltip = this.$tooltip = this._createTooltipTemplate();
    $('body').append($tooltip);

    let $tooltipArrow = this.$tooltipArrow = $('.chariot-tooltip-arrow');

    this._position($tooltip, $tooltipArrow);

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

  reposition() {
    this._position(this.$tooltip, this.$tooltipArrow);
  }

  toString() {
    return `[Tooltip - currentStep: ${this.currentStep()}, Step: ${this.step},` +
      ` text: ${this.text}]`;
  }

  //// PRIVATE

  _createTooltipTemplate() {
    let currentStep = this.tutorial.currentStep(this.step);
    let totalSteps = this.tutorial.steps.length;
    this.cta = this.config.cta || (currentStep != totalSteps ? 'Next' : 'Done');
    this.subtext = this.config.subtext ||
      (() => `${currentStep} of ${totalSteps}`);
    let subtextMarkup = this._subtextMarkup();
    let buttonFloat = subtextMarkup == '' ? 'center' : 'right';
    let template = `
      <div class="chariot-tooltip chariot-step-${currentStep}">
        ${this._arrowMarkup()}
        <div class="chariot-tooltip-content">${this._iconMarkup()}</div>
        <h1 class="chariot-tooltip-header">${this.title}</h1>
        <div class="chariot-tooltip-content"><p>${this.text}</p></div>
        <div class="chariot-btn-row">
          ${subtextMarkup}
          <button class="btn btn-inverse ${buttonFloat}">${this.cta}</button>
        </div>
      </div>`;
    let $template = $(template);

    // Add default data attributes
    this.attr['data-step-order'] = currentStep;
    $template.attr(this.attr);
    return $template;
  }

  _iconMarkup() {
    if (!this.iconUrl) return '';
    return `<div class='chariot-tooltip-icon'>
       <img class='chariot-tooltip-icon-img' src="${this.iconUrl}"/>
     </div>`;
  }

  _subtextMarkup() {
    if (!this.subtext) return '';
    return `<span class='chariot-tooltip-subtext'>
      ${this.subtext(this.currentStep(), this.tutorial.steps.length)}
    </span>`;
  }

  _arrowMarkup() {
    if (this.arrowLength === 0) return '';
    return `<div class="chariot-tooltip-arrow ${this.arrowClass}"></div>`;
  }

  _position($tooltip, $tooltipArrow) {
    this._positionTooltip($tooltip);
    this._positionArrow($tooltip, $tooltipArrow);
  }

  _positionTooltip($tooltip) {
    let $anchorElement = this._getAnchorElement();
    if (!$anchorElement) return;

    this.borderLeftWidth = parseInt($tooltip.css('border-left-width')) || 0;
    this.borderRightWidth = parseInt($tooltip.css('border-right-width')) || 0;
    this.borderBottomWidth = parseInt($tooltip.css('border-bottom-width')) || 0;
    this.borderTopWidth = parseInt($tooltip.css('border-top-width')) || 0;
    let top = Style.calculateTop($tooltip,
      $anchorElement, this.yOffset, this.position,
      this.arrowLength + this.borderTopWidth + this.borderBottomWidth
    );
    let left = Style.calculateLeft($tooltip,
      $anchorElement, this.xOffset, this.position,
      this.arrowLength + this.borderLeftWidth + this.borderRightWidth
    );
    let tooltipStyles = {
      top: top,
      left: left,
      'z-index': this.z_index,
      position: 'absolute'
    };
    $tooltip.css(tooltipStyles);
  }

  /*
    Positions the arrow to point at the center of the anchor element.
    If a tooltip is offset via xOffset / yOffset, the arrow will continue to
    point to center.
  */
  _positionArrow($tooltip, $tooltipArrow) {
    if (this.arrowLength === 0) return;
    let arrowDiagonal = this.arrowLength * 2;

    // Calculate length of arrow sides
    // a^2 + b^2 = c^2, but a=b since arrow is a square, so a = sqrt(c^2 / 2)
    let arrowEdge = Math.sqrt(Math.pow(arrowDiagonal, 2) / 2);

    let arrowEdgeStyle = `${arrowEdge}px`;
    let arrowStyles = {
      'z-index': this.z_index + 1,
      width: arrowEdgeStyle,
      height: arrowEdgeStyle
    };
    let top, left, min, max, borderWidth;

    let borderRadius = parseInt($tooltip.css('border-radius')) || 0;

    switch (this.arrowClass) {
      case 'chariot-tooltip-arrow-left':
        top = (($tooltip.outerHeight() - arrowDiagonal) / 2) - this.yOffset;
        min = borderRadius;
        max = $tooltip.outerHeight() - arrowDiagonal - borderRadius;
        arrowStyles.top = Math.max(Math.min(top, max), min);
        arrowStyles.left = -(arrowEdge / 2 + this.borderLeftWidth);
        break;
      case 'chariot-tooltip-arrow-right':
        top = (($tooltip.outerHeight() - arrowDiagonal) / 2) - this.yOffset;
        min = borderRadius;
        max = $tooltip.outerHeight() - arrowDiagonal - borderRadius;
        arrowStyles.top = Math.max(Math.min(top, max), min);
        arrowStyles.right = -(arrowEdge / 2 + this.borderRightWidth);
        break;
      case 'chariot-tooltip-arrow-bottom':
        left = (($tooltip.outerWidth() - arrowDiagonal) / 2) - this.xOffset;
        min = borderRadius;
        max = $tooltip.outerWidth() - arrowDiagonal - borderRadius;
        arrowStyles.left = Math.max(Math.min(left, max), min);
        arrowStyles.bottom = -(arrowEdge / 2 + this.borderBottomWidth);
        break;
      case 'chariot-tooltip-arrow-top':
        left = (($tooltip.outerWidth() - arrowDiagonal) / 2) - this.xOffset;
        min = borderRadius;
        max = $tooltip.outerWidth() - arrowDiagonal - borderRadius;
        arrowStyles.left = Math.max(Math.min(left, max), min);
        arrowStyles.top = -(arrowEdge / 2 + this.borderTopWidth);
        break;
    }

    $tooltipArrow.css(arrowStyles);
  }

  _getAnchorElement() {
    // Look for already cloned elements first
    let clonedSelectedElement = this.step.getClonedElement(this.anchorElement);
    if (clonedSelectedElement) return clonedSelectedElement;
    // Try fetching from DOM
    let $element = $(this.anchorElement);
    if ($element.length === 0) {
      // Try fetching from selectors
      $element = $(this.step.selectors[this.anchorElement]);
    }
    if ($element.length === 0) {
      console.log("Anchor element not found: " + this.anchorElement);
    }
    return $element;
  }

  next() {
    this.step.next();
  }
}

export default Tooltip;
