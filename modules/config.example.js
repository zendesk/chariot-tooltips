/* The config argument to chariot should be a dictionary of various tutorial configs.

  Each sub-configuration can contain the following possible keys & values.

  Tutorial configuration (dict):
    steps (array): An array of step configuration dictionaries (see below).
    complete (function): A callback that is called once the tutorial has gone through
      all steps.
    overlay (dict): A dictionary containing CSS for the overlay that appears behind
      the tutorial. (TODO)

  Step configuration (dict):
    selectors (dict): Contains arbitrarily-named keys with CSS selector values.
      Note: Specifying a selector that lives within another specified selector will
      result in unpredictable behavior.
    tooltip (dict): Tooltip configuration.
    before (function): A callback that is called once before step is rendered.
    after (function): A callback that is called once after step is rendered.

  Tooltip configuration (dict):
    position (string): Possible values: 'top' | 'left' | 'bottom' | 'right'
    xOffset (string): Value in pixels to offset the x-coordinate of the tooltip.
    yOffset (string): Value in pixels to offset the y-coordinate of the tooltip.
    *iconUrl (string): Path to an image displayed above the title.
    title (string): The title text of a toolip.
    body (string or function): The body text of a tooltip, or a function that returns
      custom HTML.
    cta (string): The text contained within the button.
    anchorElement (string): Contains either (1) a key from the step's "selectors"
      dict above, or (2) a CSS selector. (TODO)
    subtext (function) (optional): A function that returns subtext content.

*/

var OnboardingConfig = {
  ticketing: {
    steps: [
      {
        selectors: {
          assignee: "#input",
          assignLabel: "#label"
        },
        tooltip: {
          position: 'right',
          title: 'Title',
          text: 'Some text',
          xOffset: '10',
          yOffset: '10',
          anchorElement: "assignee",
          iconUrl: '/assets/whatever',
          cta: 'Next',
          subtext: function(currentStep, totalSteps) {
            return `${currentStep} of ${totalSteps}`;
          },
          attr: { 'id': 'know_your_customer' }
        },
        before: function() {
          // any arbitrary code to run before showing this step (after the timeout between steps)
          // eg. populate an image outside of the #elem
        }
      },
      {
        selectors: {
          assignee: "#input",
          assignLabel: "#label"
        },
        tooltip: {
          title: 'Title',
          position: 'right',
          text: 'Some text',
          anchorElement: "assignee",
          cta: 'Done'
        },
        before: function() {
          // any arbitrary code to run before showing this step (after the timeout between steps)
          // eg. populate an image outside of the #elem
        }
      }
    ],
    complete: function() {
    },
    overlayStyle: { opacity: 0.7, background: 'white' }
  }
};
