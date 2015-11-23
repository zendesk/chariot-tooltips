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
          iconUrl: '/assets/icon.png',
          cta: 'Next',
          subtext: function(currentStep, totalSteps) {
            return `${currentStep} of ${totalSteps}`;
          },
          attr: { 'id': 'know_your_customer' }
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
        }
      }
    ],
    shouldOverlay: true,
    compatibilityMode: true
  }
};
