let MAX_ATTEMPTS = 1000;

class Step {
  constructor(config = {}) {
    this.elements = config.elements;
    this.text = config.text;
    this.before = typeof before == Function ? before : function(){};
    this.tooltip = config.tooltip;
    this.cta = config.cta || 'Next';
  }

  render() {

    var delay = 500;
    this.intervalId = window.setInterval(this.waitForElements.bind(this), delay);
    this.numAttempts = 0;

    this.overlay();
  }

  waitForElements() {
    if(this.numAttempts < MAX_ATTEMPTS) {
      // for (let elem of this.elements) {
      for (let elementName in this.elements) {
        var elem = this.elements[elementName];
        var element = $(elem);
        if(element.length == 0) {
          this.numAttempts++;
          return;
        }
      }
    }
    clearInterval(this.intervalId);
    this.cloneElements(this.elements);
  }

  next() {

  }

  cloneElements(elements) {
    // for (let elem of elements) {
    for (let elementName in elements) {
      var elem = this.elements[elementName];
      this.cloneElement(elem);
    }
  }

  cloneElement(elem) {
    var element = $(elem);
    var clone = element.clone(),
      style = document.defaultView.getComputedStyle(element[0],"").cssText;
    clone[0].style.cssText = style;
    clone.css({'z-index': 20, position:'absolute'});
    clone.offset(element.offset());

    $("body").append(clone);
  }

  overlay() {
    var overlay = $("<div class='overlay'></div>");
    // left = $(elem).offset().left,
    // top = $(elem).offset().top

    //clone.css({'z-index': 20, position:'absolute', top: top, left, left});
    overlay.css({top: 0, left: 0, background: 'black', 'z-index':10, opacity: 0.5, position:'absolute', height: '100%', width: '100%'});
    $("body").append(overlay);
  }
}

export default Step;
