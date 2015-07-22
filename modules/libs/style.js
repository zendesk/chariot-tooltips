let classNameToComputedStyles = {};
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
        $selector.attr('class').match(/chariot_computed_styles[^\s]*/) : null;
    let className = match ? match[0] :
      this._generateUniqueClassName('chariot_computed_styles');
    let computedStyles;
    let style;

    if (style = classNameToComputedStyles[className]) {
      // console.log('hit');
      return style;
    }
    // console.log('miss');
    $selector.addClass(className);

    if (navigator.userAgent.match(/msie|firefox/i)) {
      computedStyles = $selector[0].getComputedCSSText();
    } else {
      computedStyles = document.defaultView.getComputedStyle($selector[0]).
        cssText;
    }
    classNameToComputedStyles[className] = computedStyles;
    return computedStyles;
  }

  static cloneStyles($element, $clone) {
    let start = new Date().getTime();
    let cssText = this.getComputedStylesFor($element);
    $clone[0].style.cssText = cssText;

    //this._clonePseudoStyle($element, $clone, 'before');
    //this._clonePseudoStyle($element, $clone, 'after');

    let end = new Date().getTime();
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
}
export default Style;
