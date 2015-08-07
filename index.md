---
title: Chariot
---

<html>
  <head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <link href='https://fonts.googleapis.com/css?family=Chivo:900' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="stylesheets/stylesheet.css" media="screen">
    <link rel="stylesheet" type="text/css" href="stylesheets/github-dark.css" media="screen">
    <link rel="stylesheet" type="text/css" href="stylesheets/pygments/zenburn.css" media="screen">
    <link rel="stylesheet" type="text/css" href="stylesheets/main.css" media="screen">
    <link rel="stylesheet" type="text/css" href="stylesheets/print.css" media="print">
    <!--[if lt IE 9]>
    <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <script type="text/javascript" src="javascripts/jquery.js"></script>
    <script type="text/javascript" src="javascripts/chariot.js"></script>
    <link rel="stylesheet" type="text/css" href="stylesheets/chariot.css">
    <link rel="stylesheet" type="text/css" href="stylesheets/example-tooltip.css">
    <title>Chariot by Zendesk</title>
  </head>

  <body>
    <div id="container">
      <div class="inner">

        <header>
          <h1>Chariot</h1>
          <h2>Don't walkthrough with your tooltips, fly high with chariot.</h2>
        </header>

        <hr>

        <section id="main_content">
          <div class="example-button">
            <a href="" class="button example1"><span class="cta">Peek at Chariot</span></a>
          </div>

          <div id="example1">
            {% highlight js %}
Chariot.startTutorial([
  {
    selectors: 'header',
    tooltip: {
      position: 'bottom',
      title: 'Chariot in action',
      text: 'This is an example Chariot tooltip.'
    }
  }
]);
            {% endhighlight %}
          </div>

          <div class="example2 header">
            <h3>
              <a id="basics" class="anchor" href="#basics" aria-hidden="true"></a>
              Basics
            </h3>
            <p>
              Chariot highlights elements and displays tooltips alongside the elements, taking the user
              on a guided tour of your page.
            </p>

            <div class="example-button">
              <a href="" class="button example2"><span class="cta">Board the Chariot</span></a>
            </div>
          </div>

          <div id="example2">
        {% highlight js %}
Chariot.startTutorial([
  {
    selectors: "div.example2.header",
    tooltip: {
      position: 'top',
      title: 'Highlights & Tooltips',
      text: "Chariot highlights element(s), like this div element, over a " +
        "semi-transparent overlay, and creates a tooltip, like the one " +
        "you're reading now.",
      iconUrl: '/images/chariot.svg'
    },
  },
  {
    selectors: "div#example2",
    tooltip: {
      position: 'right',
      title: 'Easy to configure',
      text: 'This is all the code required to create this two-step tutorial.'
    }
  }
]);
        {% endhighlight %}
          </div>

          <h3>
            <a id="configuration" class="anchor" href="#configuration" aria-hidden="true"></a>
            Configure everything
          </h3>
          <p>
            The content of a tooltip is all configurable: title text, body text, icon, button text, subtext.
            The tooltip and arrow positions can be offset, and the arrow size tweaked. Assign HTML attributes.
            You can even anchor the tooltip to another DOM element separate from the elements being highlighted.
          </p>
          <p>The overlay color can be tweaked, or can be completely optional.</p>
          <p>Animations for tooltip bouncing or scrolling the tooltip into view can be disabled.</p>

          <div id="bling-the-chariot" class="example-button">
            <a href="" class="button example3"><span class="cta">Bling your Chariot</span></a>
          </div>

          <div id="example3">
            {% highlight js %}
Chariot.startTutorial({
  steps: [
    {
      selectors: ["div#bling-the-chariot a", "div#example3"],
      tooltip: {
        position: 'left',
        title: 'Customize all the things',
        text: 'This step customizes the major tooltip options.<br/>' +
          'Notice how multiple selectors are specified to highlight the ' +
          'button and code section, but the tooltip is anchored to the anchor ' +
          'icon below.',
        cta: 'Custom Button',
        subtext: function() { return 'Subtext here!'; },
        iconUrl: '/images/blueprint_sparkle.svg',
        anchorElement: '#anchor-example',
        attr: { 'custom-tooltip-attr': 'custom value'},
        arrowLength: 20
      },
    },
    {
      selectors: "div#example3",
      tooltip: {
        position: 'top',
        title: 'Overlay options',
        text: 'Change the overlay color, as shown here, or disable it entirely.' +
          ' Offset the tooltip position, or offset the arrow from the center.' +
          ' Note how we had to specify <code>steps</code> key in the ' +
          'configuration because we customize the <code>overlayColor</code>.',
        xOffsetTooltip: 500,
        yOffsetTooltip: 300,
        offsetArrow: 450
      },
    }
  ],
  overlayColor: 'rgba(0,0,0,0.5)'
});
            {% endhighlight %}

            <div class="anchor-container">
              <img id="anchor-example" src="/images/anchor.svg" alt="Anchor icon" />
            </div>
          </div>

          <h3>
            <a id="queryparam" class="anchor" href="#queryparam" aria-hidden="true"></a>
            Launch options
          </h3>
          <p>
            You can also instantiate Chariot with a configuration containing several
            named tutorials, allowing you to launch these tutorials at a later time.
          </p>

          <div class="example-button">
            <a href="" class="button example4"><span class="cta">Takeoff with Chariot</span></a>
          </div>

          <div id="example-named-tutorial">
            {% highlight js %}
chariot = new Chariot({
  example4: [
    {
      selectors: 'div#example-named-tutorial',
      tooltip: {
        position: 'right',
        title: 'Named tutorials',
        text: 'The chariot instance launches the tutorial named "example4" ' +
          'defined in the configuration above.'
      }
    },
    {
      selectors: 'div#example4',
      tooltip: {
        position: 'left',
        title: 'Launch programmatically',
        text: "This one line launched the tutorial you're seeing now."
      }
    }
  ]
});
            {% endhighlight %}
          </div>

          <div id="example4">
            {% highlight js %}
              chariot.startTutorial('example4')
            {% endhighlight %}
          </div>

          <h3>
            <a id="delegate" class="anchor" href="#delegate" aria-hidden="true"></a>
            Delegate Lifecycle callbacks
          </h3>
          <p>
            Pass in an optional delegate object to listen and react to Chariot lifecycle events.
            You can optionally return promises from each callback if you need to wait for other
            tasks to finish.
          </p>
          <p>
            This can be useful for delaying tooltip rendering until specific parts of your DOM are ready.
          </p>

          <div class="example-button">
            <a href="" class="button example5"><span class="cta">Call back your Chariot</span></a>
          </div>

          <div id="example5">
            {% highlight js %}
function sleepFor(sleepDuration, message) {
  return new Promise(resolve => {
    setTimeout(resolve, sleepDuration);
    console.log(message);
  });
}
function willBeginTutorial(tutorial) {
  console.log("delegate - willBeginTutorial\n  tutorial:" + tutorial);
  return sleepFor(0, "willBeginTutorial promise resolved");
}
function willBeginStep(step, stepIndex, tutorial) {
  console.log("delegate - willBeginStep\n  step:" + step + "\n  stepIndex:" + stepIndex + "\n  tutorial:" + tutorial);
  return sleepFor(0, "willBeginStep promise resolved");
}
function willShowOverlay(overlay, stepIndex, tutorial) {
  console.log("delegate - willShowOverlay\n  overlay:" + overlay + "\n  stepIndex:" + stepIndex + "\n  tutorial:" + tutorial);
  return sleepFor(0, "willShowOverlay promise resolved");
}
function didShowOverlay(overlay, stepIndex, tutorial) {
  console.log("delegate - didShowOverlay\n  overlay:" + overlay + "\n  stepIndex:" + stepIndex + "\n  tutorial:" + tutorial);
  return sleepFor(0, "didShowOverlay promise resolved");
}
function willRenderTooltip(tooltip, stepIndex, tutorial) {
  console.log("delegate - willRenderTooltip\n  tooltip:" + tooltip + "\n  stepIndex:" + stepIndex + "\n  tutorial:" + tutorial);
  return sleepFor(0, "willRenderTooltip promise resolved");
}
function didRenderTooltip(tooltip, stepIndex, tutorial) {
  console.log("delegate - didRenderTooltip\n  tooltip:" + tooltip + "\n  stepIndex:" + stepIndex + "\n  tutorial:" + tutorial);
  return sleepFor(0, "didRenderTooltip promise resolved");
}
function didFinishStep(step, stepIndex, tutorial) {
  console.log("delegate - didFinishStep\n  step:" + step + "\n  stepIndex:" + stepIndex + "\n  tutorial:" + tutorial);
  return sleepFor(2000, "didFinishStep promise resolved");
}
function didFinishTutorial(tutorial, forced) {
  console.log("delegate - didFinishTutorial\n  tutorial:" + tutorial + " forced:" + forced);
  return sleepFor(0, "didFinishTutorial promise resolved");
}

window.willBeginTutorial = willBeginTutorial;
window.willBeginStep = willBeginStep;
window.willShowOverlay = willShowOverlay;
window.didShowOverlay = didShowOverlay;
window.willRenderTooltip = willRenderTooltip;
window.didRenderTooltip = didRenderTooltip;
window.didFinishStep = didFinishStep;
window.didFinishTutorial = didFinishTutorial;

var delegate = window;
Chariot.startTutorial([
  {
    selectors: "div#example5",
    tooltip: {
      position: 'right',
      title: 'Delegate callbacks',
      text: "Open up the console to see the lifecycle callbacks. Once you " +
        "click next, notice that the didFinishTutorial log is not printed " +
        "until after the 2 second promise from the didFinishStep has been " +
        "resolved."
    }
  }
], delegate);
            {% endhighlight %}
          </div>

          <h3>
            <a id="delegate" class="anchor" href="#delegate" aria-hidden="true"></a>
            (Advanced) Overlay Strategies
          </h3>
          <p>
            By default, Chariot uses a cloning strategy to highlight the elements
            specified by your selectors. Selected elements are cloned, and CSS
            styles are recursively computed for the elements and its children
            tags. These cloned elements are placed above an overlay.
          </p>
          <p>
            Since this strategy can be computationally expensive depending on
            your markup, the <code>useTransparentOverlayStrategy</code> can be
            used to render an overlay that highlights the element without
            needing to clone the element markup and styling. The downside is
            that this method can only be used with one selector.
          </p>

          <div class="example-button">
            <a href="" class="button example6">
              <span class="cta">Dive into Chariot</span>
            </a>
          </div>

          <div id="example6">
            {% highlight js %}
Chariot.startTutorial({
  steps: [
    {
      selectors: "div#example6",
      tooltip: {
        position: 'top',
        title: 'Semi-transparent overlay',
        text: "Open up the devtools and notice how the element specified by " +
          "the selector is not cloned. Instead, the overlay uses CSS to " +
          " obscure non-relevant portions.<br/>" +
          "This strategy is more performant than the default, but " +
          "unfortunately multiple selectors cannot be specified."
      }
    }
  ],
  useTransparentOverlayStrategy: true
});
            {% endhighlight %}
          </div>

          <h3>
            <a id="dependencies" class="anchor" href="#dependencies" aria-hidden="true"></a>
            Dependencies
          </h3>
          <p>
            The following dependencies are not bundled with Chariot and must be included separately.
          </p>
          <ul>
            <li>jQuery</li>
          </ul>

          <h3>
            <a id="templates" class="anchor" href="#templates" aria-hidden="true"></a>
            Predefined Templates
          </h3>
          <p>Only one stylesheet provided for now.  Feel free to open a pull request and contribute more!</p>
        </section>

        <section id="downloads" class="clearfix">
          <a href="https://github.com/zendesk/chariot/zipball/master" id="download-zip" class="button"><span>Download .zip</span></a>
          <a href="https://github.com/zendesk/chariot/tarball/master" id="download-tar-gz" class="button"><span>Download .tar.gz</span></a>
          <a href="https://github.com/zendesk/chariot" id="view-on-github" class="button"><span>View on GitHub</span></a>
        </section>

        <footer>
          Chariot is maintained by <a href="https://github.com/zendesk">Zendesk</a><br>
          This page was generated by <a href="https://pages.github.com">GitHub Pages</a>. Tactile theme by <a href="https://twitter.com/jasonlong">Jason Long</a>.
        </footer>

        <script type="text/javascript">
          var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
          document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
        </script>
        <script type="text/javascript">
          try {
            var pageTracker = _gat._getTracker("UA-66094626-1");
          pageTracker._trackPageview();
          } catch(err) {}
        </script>

      </div>
    </div>

    <script>
      var evalExampleCode = function(idSuffix, preventDefault) {
        return function () {
          var codeDiv = $('div#example' + idSuffix)[0];
          var exampleCode = codeDiv.textContent || codeDiv.innerText;
          eval(exampleCode);
          if (preventDefault) {
            return false;
          }
        };
      }

      // Setup example button click handlers
      var i = 1, link = $('a.example' + i);
      for(; link && link.length; i++) {
        link = $('a.example' + i);
        var preventDefault = link.length ? !link.attr('href').length : false;
        link.click(evalExampleCode(i, preventDefault));
      };

      // Evaluate example 4's code ahead of time so we can have the chariot instance ready
      evalExampleCode('-named-tutorial')();
    </script>
  </body>
</html>
