import $ from 'jquery';
import { OVERLAY_Z_INDEX, CLONE_Z_INDEX } from './constants';

class Overlay {
  constructor(config) {
    this.shouldOverlay = config.shouldOverlay === undefined ? true : config.shouldOverlay;
    this.overlayColor = config.overlayColor || 'rgba(255,255,255,0.8)';
  }

  isVisible() {
    return this.shouldOverlay === false;
  }

  render() {
    if (this.isVisible()) return;

    let $overlay = this._createOverlay();
    $('body').append($overlay);
    this.$overlay = $overlay;

    let $transparentOverlay = this._createTransparentOverlay();
    $('body').append($transparentOverlay);
    this.$transparentOverlay = $transparentOverlay;
  }

  showBackgroundOverlay() {
    // Remove the resize handler that might exist from focusOnElement
    // (Note: take care to not call this after cloning elements, because they
    //  have their own window resize handlers)
    $(window).unbind('resize');

    this.$overlay.css({
      background: this.overlayColor,
      width: '100%',
      height: '100%',
      border: 'none'
    });
  }

  showTransparentOverlay() {
    this.$transparentOverlay.show();
  }

  focusOnElement($element) {
    // Hide overlay from showTransparentOverlay
    this.$transparentOverlay.hide();

    this._resizeOverlayToElement($element);

    $(window).resize(() => {
      this._resizeOverlayToElement($element);
    });
  }


  tearDown() {
    this.$overlay.remove();
    if (this.$transparentOverlay) {
      this.$transparentOverlay.remove();
    }
  }

  toString() {
    return `[Overlay - shouldOverlay: {this.shouldOverlay}, ` +
      `overlayColor: {this.overlayColor}]`;
  }

  //// PRIVATE

  _createOverlay() {
    let $overlay = $("<div class='chariot-overlay'></div>");
    $overlay.css({ 'z-index': OVERLAY_Z_INDEX });
    return $overlay;
  }

  _createTransparentOverlay() {
    let $transparentOverlay = $("<div class='chariot-transparent-overlay'></div>");
    $transparentOverlay.css({ 'z-index': CLONE_Z_INDEX + 1 });
    return $transparentOverlay;
  }

  _resizeOverlayToElement($element) {
    // First position the overlay
    let offset = $element.offset();

    // Then resize it
    let borderStyles = `solid ${this.overlayColor}`;
    let docWidth = $(window).outerWidth();
    let docHeight = $(window).outerHeight();

    let width = $element.outerWidth();
    let height = $element.outerHeight();
    let leftWidth = offset.left;
    let rightWidth = docWidth - (offset.left + width);
    let topWidth = offset.top;
    let bottomWidth = docHeight - (offset.top + height);

    this.$overlay.css({
      background: 'transparent',
      width, height,
      'border-left': `${leftWidth}px ${borderStyles}`,
      'border-top': `${topWidth}px ${borderStyles}`,
      'border-right': `${rightWidth}px ${borderStyles}`,
      'border-bottom': `${bottomWidth}px ${borderStyles}`
    });
  }
}

export default Overlay;
