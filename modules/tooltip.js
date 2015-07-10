import $ from 'jquery';

class Tooltip {
	constructor(config, step) {
		this.position = config.position;
		this.text = config.text;
		this.xOffset = config.xOffset;
		this.yOffset = config.yOffset;
		this.width = config.width;
		this.height = config.height;
		this.anchorSelector = step.getSelectorByName(config.anchorElement);
	}
	render() {
		let $tooltip = $(`<div class='ch-tooltip'>
			<div class='ch-tooltip-icon'><img class='ch-tooltip-icon-img' src="${this.iconUrl}"/></div>
			<div class='ch-tooltip-title'>${this.name}</div>
			<div class='ch-tooltip-body'>${this.text}</div>
			<div class='ch-tooltip-steps'>"${tutorial.currentStep(this)} of ${tutorial.steps.length}"</div>
			<div class='ch-tooltip-next'>${this.cta}</div>
		</div>
		`);
		
		$(body).append($tooltip);

		$tooltip.css(computeTooltipStyles($tooltip));

		
	}
	
	computeTooltipStyles($tooltip) {
		return {
			position: 'absolute',
			top: calculateTop($tooltip),
			left: calculateLeft($tooltip)
		}
	}

	calculateLeft($tooltip) {
		let $anchor = $(this.anchorSelector);
		let offset = 0;
		switch(this.position) {
			case 'left':
				offset = $anchor.offset().left - $tooltip.outerWidth() - this.xOffset;
				break;
			case 'right':
				offset = $anchor.offset().left + $anchor.outerWidth() + this.xOffset;
				break;
			case 'top':
			case 'bottom':
				offset = $anchor.offset().left + $anchor.outerWidth()/2 - $tooltip.outerWidth()/2 - this.xOffset;
				break;
			default: 
				break;
		}
		return offset;
	}

	calculateTop($tooltip) {
		let $anchor = $(this.anchorSelector);
		let offset = 0;
		switch(this.position) {
			case 'top':
				offset = $anchor.offset().top - $tooltip.outerHeight() - this.yOffset;
				break;
			case 'bottom':
				offset = $anchor.offset().top + $anchor.outerHeight() + this.yOffset;
				break;
			case 'left':
			case 'right':
				offset = $anchor.offset().top + $anchor.outerHeight()/2 - $tooltip.outerHeight()/2 - this.yOffset;
				break;
			default: 
				break;
		}
		return offset;
	}
}

export default Tooltip;