import Constants from './constants';
import Style from './style';

// distance between arrow tip and edge of tooltip, not including border
const DEFAULT_ARROW_LENGTH = 11;

/** The tooltip configuration allows you to specify which anchor element will
 * be pointed to by the tooltip, along with its position. A default template is
 * provided, which can be configured
 *
 * @typedef TooltipConfiguration
 * @property {string} position - Relatively positions the tooltip to the anchor
 *   element. Possible values: 'top' | 'left' | 'bottom' | 'right'
 * @property {string} [anchorElement] - Optional if the corresponding Step
 *  contains only one selector. <code>anchorElement</code> can be either
 *  (1) a key from StepConfiguration.selectors above, or
 *  (2) a CSS selector
 * @property {string} [className] - One or more space-separated classes to be
 *  added to the class attribute of each tooltip.
 * @property {number} [xOffsetTooltip] - Value in pixels to offset the
 *  x-coordinate of the tooltip.
 * @property {number} [yOffsetTooltip] - Value in pixels to offset the
 *  y-coordinate of the tooltip.
 * @property {number} [offsetArrow] - Value in pixels to offset the arrow.
 * If the position is top or bootom, this still offset the x coord. If
 * left or right it will offset the y coord. If undefined or 0, arrow is centered.
 * @property {Tooltip-renderCallback} [render] - (TODO) Renders a custom template,
 *  thereby ignoring all other properties below.
 * @property {string} [iconUrl] - Path to an image displayed above the title.
 * @property {string} [title] - The title text of a toolip.
 * @property {string|function} [body] - The body text of a tooltip, or a callback
 *  that returns custom HTML.
 * @property {string} [cta] - The text contained within the button.
 * @property {Object} [attr] - HTML attributes to set on the tooltip.
 * @property {Number} [arrowLength] - Distance between arrow tip and edge of
 *  tooltip, not including border.  A value of 0 removes the arrow.
 * @property {Tooltip-subtextCallback} [subtext] - Callback that returns subtext
 *  content.
 *
 */

/**
 * A function that provides step information and returns subtext content.
 * @callback Tooltip-renderCallback
 * @param {number} currentStep - The current step number
 * @param {number} totalSteps - The total # of steps
 * @returns {string} markup - The HTML markup that represents the subtext
 */

/**
 * A function that provides step information and returns subtext content.
 * @callback Tooltip-subtextCallback
 * @param {number} currentStep - The current step number
 * @param {number} totalSteps - The total # of steps
 * @returns {string} markup - The HTML markup that represents the subtext
 */

class Tooltip {
  /**
   * @constructor
   * @param {TooltipConfiguration} config - The configuration for this tooltip
   * @param {Step} step - The Step object displayed along with this tooltip
   * @param {Tutorial} tutorial - The Tutorial object corresponding to this
   *  Tooltip
   */
  constructor(config, step, tutorial) {
    config = Object.assign({
      xOffsetTooltip: 0,
      yOffsetTooltip: 0,
      offsetArrow: 0,
      attr: {},
      arrowLength: DEFAULT_ARROW_LENGTH,
      subtext: (() => `${this.currentStepNum()} of ${this.tutorial.steps.length}`)
    }, config);

    this.step = step;
    this.tutorial = tutorial;

    if (!config.position) {
      throw new Error('tooltop position must be defined');
    }
    const selectorKeys = Object.keys(this.step.selectors);
    if (selectorKeys.length > 1 && !config.anchorElement) {
      throw new Error(`anchorElement is not optional when more than one selector exists:\n ${this}`);
    }
    if (typeof config.subtext !== 'function') {
      throw new Error('subtext must be a function')
    }

    config = Object.assign({
      anchorElement: selectorKeys[0]
    }, config);
    this.config = config;

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

    this.className = config.className;
    this.xOffsetTooltip = parseInt(config.xOffsetTooltip);
    this.yOffsetTooltip = parseInt(config.yOffsetTooltip);
    this.offsetArrow = parseInt(config.offsetArrow);
    this.arrowClass = arrowClass;
    this.appearAnimationClass = 'animate-appear-' + this.position;
    this.width = parseInt(config.width);
    this.height = parseInt(config.height);
    this.anchorElement = config.anchorElement;
    this.text = config.text;
    this.subtext = config.subtext;
    this.iconUrl = config.iconUrl;
    this.title = config.title;
    this.attr = config.attr;
    this.arrowLength = config.arrowLength;
  }

  currentStepNum() {
    return this.tutorial.stepNum(this.step);
  }

  render() {
    const $tooltip = this.$tooltip = this._createTooltipTemplate();

    // Hide the tooltip first, in case we need to scroll into view first
    $tooltip.css({ opacity: 0 });
    $('body').append($tooltip);

    const $tooltipArrow = this.$tooltipArrow = $('.chariot-tooltip-arrow');
    this._position($tooltip, $tooltipArrow);

    // Add button event handler
    $('.chariot-btn-row button').click(() => {
      this._animateTooltipDisappear($tooltip);
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
    return `[Tooltip - currentStep: ${this.currentStepNum()}, Step: ${this.step},` +
      ` text: ${this.text}]`;
  }

  //// PRIVATE

  _createTooltipTemplate() {
    const currentStep = this.currentStepNum();
    const totalSteps = this.tutorial.steps.length;
    this.cta = this.config.cta || (currentStep != totalSteps ? 'Next' : 'Done');
    const subtextMarkup = this._subtextMarkup();
    const buttonFloat = subtextMarkup === '' ? 'center' : 'right';
    const template = `
      <div class="${this._classNames()}">
        ${this._arrowMarkup()}
        <div class="chariot-tooltip-content">${this._iconMarkup()}</div>
        <h1 class="chariot-tooltip-header">${this.title}</h1>
        <div class="chariot-tooltip-content"><p>${this.text}</p></div>
        <div class="chariot-btn-row">
          ${subtextMarkup}
          <button class="btn btn-inverse ${buttonFloat}">${this.cta}</button>
        </div>
      </div>`;
    const $template = $(template);

    // Add default data attributes
    this.attr['data-step-order'] = currentStep;
    $template.attr(this.attr);
    return $template;
  }

  _classNames() {
    const currentStep = this.currentStepNum();
    const defaultClassNames = `chariot-tooltip chariot-step-${currentStep}`;
    if (!this.className) return defaultClassNames;
    return `${defaultClassNames} ${this.className}`;
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
      ${this.subtext(this.currentStepNum(), this.tutorial.steps.length)}
    </span>`;
  }

  _arrowMarkup() {
    if (this.arrowLength === 0) return '';
    return `<div class="chariot-tooltip-arrow ${this.arrowClass}"></div>`;
  }

  _position($tooltip, $tooltipArrow) {
    this._positionTooltip($tooltip);
    this._positionArrow($tooltip, $tooltipArrow);

    // Animate scrolling to the tooltip if it's not completely visible
    if (this.tutorial.animateScrolling && !this._isElementInViewport($tooltip)) {
      $("html, body").animate({
        scrollTop: $tooltip.offset().top + $tooltip.height() / 2 - document.body.clientHeight / 2,
        scrollLeft: $tooltip.offset().left + $tooltip.width() / 2 - document.body.clientWidth / 2
      }, this.tutorial.scrollAnimationDuration, () => {
        this._animateTooltipAppear($tooltip);
      });
    } else {
      this._animateTooltipAppear($tooltip);
    }
  }

  _positionTooltip($tooltip) {
    let $anchorElement = this._getAnchorElement();
    if (!$anchorElement) return;

    this.borderLeftWidth = parseInt($tooltip.css('border-left-width')) || 0;
    this.borderRightWidth = parseInt($tooltip.css('border-right-width')) || 0;
    this.borderBottomWidth = parseInt($tooltip.css('border-bottom-width')) || 0;
    this.borderTopWidth = parseInt($tooltip.css('border-top-width')) || 0;
    let top = Style.calculateTop($tooltip,
      $anchorElement, this.yOffsetTooltip, this.position,
      this.arrowLength + this.borderTopWidth + this.borderBottomWidth
    );
    let left = Style.calculateLeft($tooltip,
      $anchorElement, this.xOffsetTooltip, this.position,
      this.arrowLength + this.borderLeftWidth + this.borderRightWidth
    );
    let tooltipStyles = {
      top: top,
      left: left,
      'z-index': Constants.TOOLTIP_Z_INDEX,
      position: 'absolute'
    };
    $tooltip.css(tooltipStyles);
  }

  /*
    Positions the arrow to point at the center of the anchor element.
    If a tooltip is offset via xOffsetTooltip / yOffsetTooltip, the arrow will continue to
    point to center. You can change this via the offsetArrow property.
  */
  _positionArrow($tooltip, $tooltipArrow) {
    if (this.arrowLength === 0) return;
    let arrowDiagonal = this.arrowLength * 2;

    // Calculate length of arrow sides
    // a^2 + b^2 = c^2, but a=b since arrow is a square, so a = sqrt(c^2 / 2)
    let arrowEdge = Math.sqrt(Math.pow(arrowDiagonal, 2) / 2);

    let arrowEdgeStyle = `${arrowEdge}px`;
    let arrowStyles = {
      'z-index': Constants.TOOLTIP_Z_INDEX + 1,
      width: arrowEdgeStyle,
      height: arrowEdgeStyle
    };
    let top, left, min, max, borderWidth;

    let borderRadius = parseInt($tooltip.css('border-radius')) || 0;

    switch (this.arrowClass) {
      case 'chariot-tooltip-arrow-left':
        top = (($tooltip.outerHeight() - arrowDiagonal) / 2) - this.yOffsetTooltip +
          this.offsetArrow;
        min = borderRadius;
        max = $tooltip.outerHeight() - arrowDiagonal - borderRadius;
        arrowStyles.top = Math.max(Math.min(top, max), min);
        arrowStyles.left = -(arrowEdge / 2 + this.borderLeftWidth);
        break;
      case 'chariot-tooltip-arrow-right':
        top = (($tooltip.outerHeight() - arrowDiagonal) / 2) - this.yOffsetTooltip +
          this.offsetArrow;
        min = borderRadius;
        max = $tooltip.outerHeight() - arrowDiagonal - borderRadius;
        arrowStyles.top = Math.max(Math.min(top, max), min);
        arrowStyles.right = -(arrowEdge / 2 + this.borderRightWidth);
        break;
      case 'chariot-tooltip-arrow-bottom':
        left = (($tooltip.outerWidth() - arrowDiagonal) / 2) - this.xOffsetTooltip +
          this.offsetArrow;
        min = borderRadius;
        max = $tooltip.outerWidth() - arrowDiagonal - borderRadius;
        arrowStyles.left = Math.max(Math.min(left, max), min);
        arrowStyles.bottom = -(arrowEdge / 2 + this.borderBottomWidth);
        break;
      case 'chariot-tooltip-arrow-top':
        left = (($tooltip.outerWidth() - arrowDiagonal) / 2) - this.xOffsetTooltip +
          this.offsetArrow;
        min = borderRadius;
        max = $tooltip.outerWidth() - arrowDiagonal - borderRadius;
        arrowStyles.left = Math.max(Math.min(left, max), min);
        arrowStyles.top = -(arrowEdge / 2 + this.borderTopWidth);
        break;
    }

    $tooltipArrow.css(arrowStyles);
  }

  _isElementInViewport($el) {
    const rect = $el[0].getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }

  _animateTooltipAppear($tooltip) {
    // Reveal the tooltip again
    $tooltip.css({ opacity: 1 });
    if (!this.tutorial.animateTooltips) {
      return;
    }
    $tooltip.addClass(this.appearAnimationClass)
      .one('animationend', (e) => {
        $(e.currentTarget).removeClass(this.appearAnimationClass);
      });
  }

  _animateTooltipDisappear($tooltip) {
    if (!this.tutorial.animateTooltips) {
      this.next();
      return;
    }

    $tooltip
      .addClass(this.appearAnimationClass)
      .css({ 'animation-direction': 'reverse' })
      .on('animationend', () => {
        this.next();
      });
  }

  _getAnchorElement() {
    // Look for already cloned elements first
    let clonedSelectedElement = this.step.getClonedElement(this.anchorElement);
    if (clonedSelectedElement) return clonedSelectedElement;
    const anchorElement = this.step.selectors[this.anchorElement];
    // Try fetching from selectors
    let $element = $(anchorElement);
    // Try fetching from DOM
    if ($element.length === 0) {
      $element = $(this.anchorElement);
    }
    if ($element.length === 0) {
      console.error(`Anchor element not found: ${this.anchorElement}`);
    }
    return $element;
  }

  next() {
    this.step.next();
  }
}

export default Tooltip;
