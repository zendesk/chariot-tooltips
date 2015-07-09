import Step from './step';

class Tutorial {
	constructor(name, config) {
		this.name = name;
		this.steps = [];
		if (typeof config.steps == Array) {
			for(let step of config.steps) {
				this.steps.push(new Step(config.step));
			}
		}
	}

	start(){

	}
}

export { Tutorial };