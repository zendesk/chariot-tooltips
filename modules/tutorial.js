import { Step } from './step';

class Tutorial {
	constructor(name, config) {
		this.name = name;
		self.steps = [];
		if (typeof config.steps === 'object') {
			for(let step of config.steps) {
				self.steps.push(new Step(config.step, tutorial));
			}
		}
		if (typeof config.complete === 'function') {
			self.complete = config.complete ;
		}
	}

	start(){
		self.steps[0].render();
	}

	next(currentStep) {
		let index = self.steps.indexOf(currentStep);
		if (index < 0) {
			throw new Error('currentStep not found');
		}
		else if (index === self.steps-1) {
			// this is the last step
			currentStep.tearDown();
			self.complete();
		}
		else {
			currentStep.tearDown();
			self.steps[index + 1].render();
		}
	}

	currentStep(step) {
		return self.steps.indexOf(step) + 1;
	}
}

export default Tutorial;