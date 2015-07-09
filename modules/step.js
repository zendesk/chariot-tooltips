class Step {
	constructor(config = {}) {
		self.elem = config.elem;
		self.text = config.text;
		self.before = typeof before == Function ? before : function(){};
		self.tooltip = config.tooltip;
		self.cta = config.cta || 'Next';
	}

	render() {

	}

	next() {

	}

	overlay(elem) {
		var clone = $(ele).clone(),
		style = document.defaultView.getComputedStyle($(ele)[0],"").cssText,
		overlay = $("<div class='overlay'></div>"),
		left = $(ele).offset().left,
		top = $(ele).offset().top

		clone[0].style.cssText=style;
		//clone.css({'z-index': 20, position:'absolute', top: top, left, left});
		clone.css({'z-index': 20, position:'absolute'});
		clone.offset($(ele).offset());
		overlay.css({top: 0, left: 0, background: 'black', 'z-index':10, opacity: 0.5, position:'absolute', height: '1000px', width: '100%'});
		$("body").append(clone);
		$("body").append(overlay);
	}
}

export { Step };