let classNameToComputedStyles = {};
const CHARIOT_COMPUTED_STYLE_CLASS_PREFIX = 'chariot_computed_styles';

class Style {
  static calculateLeft($tooltip, $anchor, xOffset, position) {
    let offset = 0;
    switch (position) {
      case 'left':
        offset = $anchor.offset().left - $tooltip.outerWidth() + xOffset;
        break;
      case 'right':
        offset = $anchor.offset().left + $anchor.outerWidth() + xOffset;
        break;
      case 'top':
      case 'bottom':
        offset = $anchor.offset().left + $anchor.outerWidth() / 2 -
          $tooltip.outerWidth() / 2 + xOffset;
        break;
      default:
        break;
    }
    return offset;
  }
  static calculateTop($tooltip, $anchor, yOffset, position) {
    let offset = 0;
    switch (position) {
      case 'top':
        offset = $anchor.offset().top - $tooltip.outerHeight() + yOffset;
        break;
      case 'bottom':
        offset = $anchor.offset().top + $anchor.outerHeight() + yOffset;
        break;
      case 'left':
      case 'right':
        offset = $anchor.offset().top + $anchor.outerHeight() / 2 -
          $tooltip.outerHeight() / 2 + yOffset;
        break;
      default:
        break;
    }
    return offset;
  }

  static getComputedStylesFor($selector) {
    let match = $selector.length && $selector.attr('class') ?
        $selector.attr('class').
        match(new RegExp('chariot_computed_styles[^\s]*')) :
        null;

    return match ? classNameToComputedStyles[match[0]] :
      this._cacheStyleFor($selector);
  }

  static cloneStyles($element, $clone) {
    let start = new Date().getTime();
    let cssText = this.getComputedStylesFor($element);
    $clone[0].style.cssText = cssText;
    if (navigator.userAgent.match(/msie|windows/i)) {
      this._ieBoxModelStyleFix('width', $clone, cssText);
      this._ieBoxModelStyleFix('height', $clone, cssText);
    }
    //this._clonePseudoStyle($element, $clone, 'before');
    //this._clonePseudoStyle($element, $clone, 'after');
  }

  static _ieBoxModelStyleFix(style, $ele, cssText) {
    let match = cssText.match(new RegExp(`; ${style}: ([^;]*)`));
    let value = (match && match.length > 1) ? parseInt(match[1]) : 0;
    if (value != 0 && !isNaN(value)) {
      $ele[style](value);
    }
  }

  static _generateUniqueClassName(prefix = 'class') {
    return `${prefix}_${Math.floor(Math.random() * 1000000)}`;
  }

  static _clonePseudoStyle($element, $clone, pseudoClass) {
    let pseudoStyle = window.getComputedStyle($element[0], `:${pseudoClass}` );
    if (pseudoStyle.content && pseudoStyle.content !== '') {
      let className = this._generateUniqueClassName();
      $clone.addClass(className);
      document.styleSheets[0].insertRule(`.${className}::${pseudoClass} {
        ${pseudoStyle.cssText}; content: ${pseudoStyle.content}; }`,
        0);
    }
  }

  static _cacheStyleFor($selector) {
    let className = this._generateUniqueClassName(
      CHARIOT_COMPUTED_STYLE_CLASS_PREFIX);
    $selector.addClass(className);

    let computedStyles = navigator.userAgent.match(/msie|windows|firefox/i) ?
      $selector[0].getComputedCSSText() :
      document.defaultView.getComputedStyle($selector[0]).cssText;

    classNameToComputedStyles[className] = computedStyles;
    return computedStyles;
  }

}
export default Style;
