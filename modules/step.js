import $ from 'jquery';
import Tooltip from './tooltip';


class Step {
	constructor(config = {}, tutorial) {
		this.selectors = config.selectors;
		this.text = config.text;
		this.before = typeof before == 'function' ? before : function(){};
		this.tooltip = new Tooltip(config.tooltip, this);
		this.cta = config.cta || 'Next';
		this.name = config.name;
		this.tutorial = tutorial;
	}

	renderTooltip() {
		this.tooltip.render();
	}

	render() {
		this.before();
		renderTooltip();
	}

	next() {
		this.tutorial.next(this);
	}

	getSelectorByName(name) {
		return this.selectors[name] || null;
	}

	static cloneElement(elem) {
		let clone = $(elem).clone(),
			style = document.defaultView.getComputedStyle($(elem)[0],"").cssText;
		clone[0].style.cssText = style;
		clone.css({'z-index': 20, position:'absolute'});
		clone.offset($(elem).offset());
		return clone;
	}

	static overlay(clones) {
		let overlay = $("<div class='overlay'></div>");
		// left = $(elem).offset().left,
		// top = $(elem).offset().top

		//clone.css({'z-index': 20, position:'absolute', top: top, left, left});
		overlay.css({top: 0, left: 0, background: 'black', 'z-index':10, opacity: 0.5, position:'absolute', height: '1000px', width: '100%'});
		$("body").append(clones);
		$("body").append(overlay);
	}
}

export default Step;
