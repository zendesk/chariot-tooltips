import $ from 'jquery';
import Step from './step';
import { OVERLAY_Z_INDEX } from './constants';

class Tutorial {
  constructor(chariot, config) {
    this.chariot = chariot;
    this.steps = [];
    if (typeof config.steps === 'object') {
      for (let step of config.steps) {
        this.steps.push(new Step(step, this));
      }
    }
    this.complete = typeof config.complete === 'function' ? config.complete : ()=> {};
    this.overlayStyle = config.overlayStyle;
  }

  start() {
    this.renderOverlay();
    this.steps[0].render();
  }

  renderOverlay() {
    let $overlay = $("<div class='overlay'></div>");
    if (!this.overlayStyle) {
      $overlay.css({
        top: 0,
        left: 0,
        background: 'white',
        'z-index': OVERLAY_Z_INDEX,
        opacity: 0.7,
        position: 'absolute',
        height: '100%',
        width: '100%'
      });
    } else {
      $overlay.css(this.overlayStyle);
    }
    $('body').append($overlay);
    this.$overlay = $overlay;
  }

  next(currentStep) {
    let index = this.steps.indexOf(currentStep);
    if (index < 0) {
      throw new Error('currentStep not found');
      return;
    }

    currentStep.tearDown();
    if (index === this.steps.length - 1) {
      this.end();
      this.tearDown();
    } else {
      this.steps[index + 1].render();
    }
  }

  currentStep(step) {
    if (step === null) return null;
    return this.steps.indexOf(step) + 1;
  }

  end() {
    // Note: Order matters. complete callback should be called after UI is torn down
    this.tearDown();
    this.chariot.endTutorial();
    this.complete();
  }

  tearDown() {
    this.$overlay.remove();
    // Ensure all steps are torn down
    this.steps.forEach(step => {
      step.tearDown();
    });
  }
}

export default Tutorial;
