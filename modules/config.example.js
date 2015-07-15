var OnboardingConfig = {
  tutorials: {
    ticketing: {
      steps: [
        {
          name: 'Internal or Public?',
          selectors: {
            assignee: "#input",
            assignLabel: "#label"
          },
          tooltip: {
            position: 'right', // 'top' | 'left' | 'bottom' | 'right'
            text: 'Some text',
            xOffset: '10',
            yOffset: '10',
            anchorElement: "assignee",
            iconUrl: '/assets/whatever',
            cta: 'Next'
          },
          before: function() {
            // any arbitrary code to run before showing this step (after the timeout between steps)
            // eg. populate an image outside of the #elem
          },
        },
        {
          name: 'External or Private?',
          selectors: {
            assignee: "#input",
            assignLabel: "#label"
          },
          tooltip: {
            position: 'right', // 'top' | 'left' | 'bottom' | 'right'
            text: 'Some text',
            anchorElement: "assignee",
            cta: 'Done'
          },
          before: function() {
            // any arbitrary code to run before showing this step (after the timeout between steps)
            // eg. populate an image outside of the #elem
          },
        }
      ],
      complete: function() {
        var url = location.protocol+location.hostname+location.pathname;
        history.replaceState({path: url}, null, url);
      },
      overlay: { transparent: '#000000' } // {transparent: '#000000'} || {fullscreen: '#FFFFFF'}
    }
  }
};
