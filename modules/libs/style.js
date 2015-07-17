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

  static cloneStyles($element, $clone) {
    $clone[0].style.cssText = document.defaultView.
      getComputedStyle($element[0], "").cssText;
    this._clonePseudoStyle($element, $clone, 'before');
    this._clonePseudoStyle($element, $clone, 'after');
  }

  static _generateRandomClassName() {
    return `class_${Math.floor(Math.random() * 1000000)}`;
  }

  static _clonePseudoStyle($element, $clone, pseudoClass) {
    let pseudoStyle = window.getComputedStyle($element[0], `::${pseudoClass}` );
    if (pseudoStyle.content && pseudoStyle.content !== '') {
      let className = this._generateRandomClassName();
      $clone.addClass(className);
      document.styleSheets[0].insertRule(`.${className}::${pseudoClass} {
        ${pseudoStyle.cssText}; content: ${pseudoStyle.content}; }`,
        0);
    }
  }
}
export default Style;
