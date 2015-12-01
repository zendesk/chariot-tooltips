import { OVERLAY_Z_INDEX, CLONE_Z_INDEX } from './constants';

class Overlay {

  /**
   * @constructor
   * @public
   * isVisible(), resize()
   *
   */
  constructor(config) {
    this.shouldOverlay = config.shouldOverlay === undefined ? true : config.shouldOverlay;
    this.overlayColor = config.overlayColor || 'rgba(255,255,255,0.8)';
    this.useTransparentOverlayStrategy = config.useTransparentOverlayStrategy;
    this._resizeHandler = null;
  }

  isVisible() {
    return this.shouldOverlay === false;
  }

  render() {
    if (this.isVisible()) return;

    this.$document = $(document);
    let $body = $('body');
    let $overlay = this._createOverlay();
    $body.append($overlay);
    this.$overlay = $overlay;

    let $transparentOverlay = this._createTransparentOverlay();
    $body.append($transparentOverlay);
    this.$transparentOverlay = $transparentOverlay;
  }

  isTransparentOverlayStrategy() {
    return this.useTransparentOverlayStrategy;
  }

  // The following 2 methods are part of the "clone element" strategy

  /**
   * Shows a background overlay to obscure the main interface, and acts as the
   * background for the cloned elements involved in the tutorial.
   * This method is involved in the "clone element" strategy.
   */
  showBackgroundOverlay() {
    // Remove the resize handler that might exist from focusOnElement
    // (Note: take care to not call this after cloning elements, because they
    //  have their own window resize handlers)
    let $window = $(window);

    this.$overlay.css({
      background: this.overlayColor,
      border: 'none'
    });

    this._resizeOverlayToFullScreen();
    this._resizeHandler = this._resizeOverlayToFullScreen.bind(this);
  }

  /**
   * Shows a transparent overlay to prevent user from interacting with cloned
   * elements.
   */
  showTransparentOverlay() {
    this.$transparentOverlay.show();
  }

  /**
   * Focuses on an element by resizing a transparent overlay to match its
   * dimensions and changes the borders to be colored to obscure the main UI.
   * This method is involved in the "transparent overlay" strategy.
   */
  focusOnElement($element) {
    // Hide overlay from showTransparentOverlay
    this.$transparentOverlay.hide();

    this._resizeOverlayToElement($element);
    this._resizeHandler = this._resizeOverlayToElement.bind(this, $element);
  }

  resize() {
    this._resizeHandler();
  }

  tearDown() {
    this.$overlay.remove();
    if (this.$transparentOverlay) {
      this.$transparentOverlay.remove();
    }
  }

  toString() {
    return `[Overlay - shouldOverlay: ${this.shouldOverlay}, ` +
      `overlayColor: ${this.overlayColor}]`;
  }

  //// PRIVATE

  _createOverlay() {
    let $overlay = $("<div class='chariot-overlay'></div>");
    $overlay.css({ 'z-index': OVERLAY_Z_INDEX });
    return $overlay;
  }

  _createTransparentOverlay() {
    let $transparentOverlay = $("<div class='chariot-transparent-overlay'></div>");
    $transparentOverlay.css({
      'z-index': CLONE_Z_INDEX + 1
    });
    return $transparentOverlay;
  }

  // Used for clone element strategy
  _resizeOverlayToFullScreen() {
    this.$overlay.css({
      width: '100%',
      height: '100%'
    });
  }

  // Used for transparent overlay strategy
  _resizeOverlayToElement($element) {
    // First position the overlay
    let offset = $element.offset();

    // Then resize it
    let borderStyles = `solid ${this.overlayColor}`;
    let $document = this.$document;
    let docWidth = $document.outerWidth();
    let docHeight = $document.outerHeight();

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
