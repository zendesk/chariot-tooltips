import $ from 'jquery';
import { OVERLAY_Z_INDEX, CLONE_Z_INDEX } from './constants';

class Overlay {
  constructor(config) {
    this.shouldOverlay = config.shouldOverlay === undefined ? true : config.shouldOverlay;
    this.overlayColor = config.overlayColor || 'rgba(255,255,255,0.8)';
    this._resizeHandler = null;
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

  // Following 2 methods are part of clone element stragey

  showBackgroundOverlay() {
    // Remove the resize handler that might exist from focusOnElement
    // (Note: take care to not call this after cloning elements, because they
    //  have their own window resize handlers)
    let $window = $(window);
    $window.off('resize', this._resizeOverlayToElement);

    this.$overlay.css({
      background: this.overlayColor,
      border: 'none'
    });

    this._resizeOverlayToFullScreen();
    this._resizeHandler = this._resizeOverlayToFullScreen.bind(this);
    $window.on('resize', this._resizeHandler);
  }

  showTransparentOverlay() {
    this.$transparentOverlay.show();
  }

  // One transparent overlay strategy
  focusOnElement($element) {
    // Hide overlay from showTransparentOverlay
    this.$transparentOverlay.hide();
    $(window).off('resize', this._resizeOverlayToFullScreen);

    this._resizeOverlayToElement($element);
    this._resizeHandler = this._resizeOverlayToElement.bind(this, $element);
    $(window).on('resize', this._resizeHandler);
  }

  resize() {
    this._resizeHandler();
  }

  tearDown() {
    this.$overlay.remove();
    if (this.$transparentOverlay) {
      this.$transparentOverlay.remove();
    }
    $(window).off('resize', this._resizeOverlayToFullScreen);
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
    let body = $('body')[0];
    let $transparentOverlay = $("<div class='chariot-transparent-overlay'></div>");
    $transparentOverlay.css({
      'z-index': CLONE_Z_INDEX + 1,
      width: body.scrollWidth + 'px',
      height: body.scrollHeight + 'px'
    });
    return $transparentOverlay;
  }

  _resizeOverlayToFullScreen() {
    let body = $('body')[0];
    this.$overlay.css({
      width: body.scrollWidth + 'px',
      height: body.scrollHeight + 'px'
    });
  }

  _resizeOverlayToElement($element) {
    // First position the overlay
    let offset = $element.offset();

    // Then resize it
    let borderStyles = `solid ${this.overlayColor}`;
    let body = $('body')[0];
    let docWidth = body.scrollWidth;
    let docHeight = body.scrollHeight;

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
