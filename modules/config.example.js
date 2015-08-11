/**
 * The master Chariot configuration dictionary can consist of multiple tutorial
 *  configurations.
 * @typedef ChariotConfiguration
 * @property {Object.<string, TutorialConfig>} config - The main configuration
 *  containing all tutorials.
 *
 */

/** The tutorial configuration is where the steps of a tutorial are specified,
 * and also allows customization of the overlay style. A complete callback is
 * available for end of tutorial cleanup.
 *
 * @typedef TutorialConfiguration
 * @property {boolean} [shouldOverlay=true] - Setting to false will disable the
 * overlay that normally appears over the page and behind the tooltips.
 * @property {string} [overlayColor='rgba(255,255,255,0.7)'] - Overlay CSS color
 * @property {StepConfiguration[]} steps - An array of step configurations (see below).
 * @property {Tutorial-completeCallback} [complete] - Callback that is called
 * once the tutorial has gone through all steps.
 * @property {boolean} [compatibilityMode=false] - Setting to true will use an
 *  implementation that does not rely on cloning highlighted elements.
 *  Note: This value is ignored if a step contains multiple selectors.
 * @property {boolean} [animated=false] - (TODO) Enables spotlight-like
 *  transitions between steps.  Setting to true will enable compatibilityMode.
 *  Note: Animations will not occur for steps containing multiple selectors.
 */

/**
 * Callback is called after the tutorial has finished all steps.
 * @callback Tutorial-completeCallback
 */

/** The step configuration is where you specify which elements of the page will
 * be cloned and placed over the overlay.
 *
 * @typedef StepConfiguration
 * @property {TooltipConfiguration} tooltip - Tooltip configuration.
 * @property {Object.<string, string>} [selectors] - Contains arbitrarily-named
 *  keys with CSS selector values. These keys can be referenced from
 *  TooltipConfiguration.anchorElement.
 *  Note: Specifying a selector that lives within another specified selector will
 *  result in unpredictable behavior.
 * @property {Step-beforeCallback} [before] - Callback called once before step
 *  is rendered.
 * @property {Step-afterCallback} [after] - Callback called once after step is
 *  rendered.
 */

/**
 * Callback called once before step is rendered.
 * @callback Step-beforeCallback
 */

/**
 * Callback called once after step is rendered.
 * @callback Step-afterCallback
 */

/** The tooltip configuration allows you to specify which anchor element will
 * be pointed to by the tooltip, along with its position. A default template is
 * provided, which can be configured
 *
 * @typedef TooltipConfiguration
 * @property {string} position - Relatively positions the tooltip to the anchor
 *   element. Possible values: 'top' | 'left' | 'bottom' | 'right'
 * @property {string} [anchorElement] - Optional if the corresponding Step
 *  contains only one selector. anchorElement can be either
 *  (1) a key from StepConfiguration.selectors above, or
 *  (2) a CSS selector
 * @property {number} [xOffset] - Value in pixels to offset the x-coordinate of
 *  the tooltip.
 * @property {number} [yOffset] - Value in pixels to offset the y-coordinate of
 *  the tooltip.
 * @property {Tooltip-renderCallback} [render] - (TODO) Renders a custom template,
 *  thereby ignoring all other properties below.
 * @property {string} [iconUrl] - Path to an image displayed above the title.
 * @property {string} [title] - The title text of a toolip.
 * @property {string|function} [body] - The body text of a tooltip, or a callback
 *  that returns custom HTML.
 * @property {string} [cta] - The text contained within the button.
 * @property {Object} [attr] - HTML attributes to set on the tooltip.
 * @property {Number} [arrowLength] - Distance between arrow tip and edge of
 *  tooltip, not including border.  A value of 0 removes the arrow.
 * @property {Tooltip-subtextCallback} [subtext] - Callback that returns subtext
 *  content.
 *
 */

/**
 * A function that provides step information and returns subtext content.
 * @callback Tooltip-renderCallback
 * @param {number} currentStep - The current step number
 * @param {number} totalSteps - The total # of steps
 * @returns {string} markup - The HTML markup that represents the subtext
 */

/**
 * A function that provides step information and returns subtext content.
 * @callback Tooltip-subtextCallback
 * @param {number} currentStep - The current step number
 * @param {number} totalSteps - The total # of steps
 * @returns {string} markup - The HTML markup that represents the subtext
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
        before: () => {
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
          cta: 'Done',
          arrowLength: 30
        },
        before: () => {
          // any arbitrary code to run before showing this step (after the timeout between steps)
          // eg. populate an image outside of the #elem
        }
      }
    ],
    complete: () => {
    },
    shouldOverlay: true,
    compatibilityMode: true
  }
};
