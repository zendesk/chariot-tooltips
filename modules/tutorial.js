import Step from './step';

class Tutorial {
  constructor(name, config) {
    this.name = name;
    this.steps = [];
    for(let step of config.steps) {
      this.steps.push(new Step(step));
    }
  }

  start() {
    this.steps[0].render();
  }
}

export default Tutorial;
