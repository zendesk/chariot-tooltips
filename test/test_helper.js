require('es5-shim');
require('es6-shim');

const stepFixture = {
  selectors: {
    assignee: "test"
  },
  tooltip: {
    position: 'left'
  }
};

const tutorialFixture = {
  steps: [stepFixture]
};

const configFixture = {
  tutorialName: tutorialFixture
};

export default {
  fixtures: {
    configFixture, tutorialFixture, stepFixture
  }
};
