import Step from './step';

class Tutorial {
  constructor(name, config) {
    this.name = name;
    this.steps = [];
    if (typeof config.steps === 'object') {
      for (let step of config.steps) {
        this.steps.push(new Step(step, this));
      }
    }
    if (typeof config.complete === 'function') {
      this.complete = config.complete;
    }
  }

  start() {
    this.steps[0].render();
  }

  next(currentStep) {
    let index = self.steps.indexOf(currentStep);
    if (index < 0) {
      throw new Error('currentStep not found');
    } else if (index === this.steps - 1) {
      // this is the last step
      currentStep.tearDown();
      this.complete();
    } else {
      currentStep.tearDown();
      this.steps[index + 1].render();
    }
  }

  currentStep(step) {
    if (step === null) return null;
    return this.steps.indexOf(step) + 1;
  }
}

export default Tutorial;
