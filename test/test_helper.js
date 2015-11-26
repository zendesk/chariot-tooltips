require('es5-shim');
require('es6-shim');

let configFixture = {
  tutorialName: {
    steps: [
      {
        selectors: {
          assignee: "test"
        },
        tooltip: {
          position: 'left'
        }
      }
    ]
  }
};

export default {
  fixtures: {
    configFixture
  }
};
