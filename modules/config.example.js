var OnboardingConfig = {
  tutorials: [
    {
      ticketing: {
        steps: [
          {
            elems: {
              assignee: "#input",
              assignLabel: "#label"
            },
            tooltip: {
              position: 'right', // 'top' | 'left' | 'bottom' | 'right'
              text: I18n.translate('Some text'),
              anchorElement: "assignee"
            },  
            before: function() {
              // any arbitrary code to run before showing this step (after the timeout between steps)
              // eg. populate an image outside of the #elem
            },
          },
          {
            elems: {
              assignee: "#input",
              assignLabel: "#label"
            },
            tooltip: {
              position: 'right', // 'top' | 'left' | 'bottom' | 'right'
              text: I18n.translate('Some text'),
              anchorElement: "assignee"
            },  
            before: function() {
              // any arbitrary code to run before showing this step (after the timeout between steps)
              // eg. populate an image outside of the #elem
            },
          }
        ],
        overlay: {transparent: '#000000'} // {transparent: '#000000'} || {fullscreen: '#FFFFFF'}
      }
    }
  ]
};
