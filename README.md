![example image](example/chariot_screenshot.png)

# Chariot
> Walkthroughs so easy, you might as well be flying in a chariot.

A Javascript library for creating step-by-step tooltip tutorials, using a
background overlay to bring focus to the elements you care about.

# Demo

Visit the [live demo](http://chariot.zendesk.com).

# Motivation
Tooltips are better at drawing focus to highlighted elements on a website
when the background is dimmed out.

Existing tooltip overlay solutions don't use overlay backgrounds, or if they
do, they fail to consider when parent containers already have the CSS
`z-index` property set.
(A child element's `z-index` cannot override it's parent's `z-index`).

# Features

- Tutorial kicked off by query parameter in the URL or programmatically
- Overlay hides background and clones your key elements over it
- `z-index` is taken care of
- Programmatic API and lifecycle callbacks
- Browser support includes every sane browser and IE9+

# Usage

chariot.js works in global, CommonJS and AMD contexts.

Visit the [demo page](http://chariot.zendesk.com) for usage examples.

# API

If you're running the project locally, you can view the JSDoc-formatted
documentation at
[http://localhost:8080/docs/global.html](http://localhost:8080/docs/global.html).

Or go to the example site: http://chariot.zendesk.com/docs

# Development
Install node packages.

	npm install

Install the gulp cli.

	npm install -g gulp

To run a simple server:

	gulp connect

This will start a simple server that serves `index.html` at
[http://localhost:8080/example/index.html](http://localhost:8080/example/index.html),
 and loads `chariot.js` onto the page.
The task will also watch your changes and reloads the page as the files are updated.

Run the following style-checker before pushing your branch.

	gulp style

To automatically fix the style errors:

	gulp style-fix

To update the generated docs:

	gulp js-doc

# Test

## Command Line
To run test in command line, run:

	gulp test

## Browser
If you want to test the same test suite in multiple browsers, run:

	gulp testem

The browsers to test can be configured in `testem.yml`, currently it is configured to test in all major browsers (Firefox, Safari, Chrome) and PhantomJS.

## Build
Run the following to build `chariot.js` into thd `/dist` directory.

	gulp

*Do not check in the `dist` directory. Release on github will contain the tarballs with compiled js/css.*

## Release

When you have merge in all your changes from your branch. Run the following **IN MASTER**:

	gulp release

This gulp task will

1. Bump version in package.json, bower.json
1. Auto-generate documentation with js-doc
1. Package release into the ```release/``` folder
1. Commit the version bump changes in package.json, bower.json
1. Push the bump changes
1. Tag with the new version

After releasing, update the relevant files in your project which uses ChariotJS.
Update version in bower/npm, or copy release/chariot.[min.]js,
release/chariot.[min.]css into your project's ```vendor/``` folder.

# Implementation details

By default, a tutorial is displayed with a semi-transparent overlay
that hides background content and highlights the selected element(s) for the
current step of the tutorial.
This is achieved by one of two exclusive strategies:
1. An overlay div with a semi-transparent border but with a transparent center
equal in size to the selected element.
Example: A 50x50 div is the selected element, so the overlay's transparent center
is 50x50, and its semi-transparent border fills the rest of the viewport.
1. A complete semi-transparent overlay fills the entire viewport, and the
selected element is cloned and placed on top of this overlay, using z-index.

Both strategies have pros & cons.
1. Background overlay with transparent center and semi-transparent border
- Pros: More performant than the clone strategy because styles are not being cloned.
- Cons: When an element is not rectangular in shape, or
when it has `:before` or `:after` pseudo-selectors that insert new DOM elements
that protrude out of the main element, the transparent center will either
reveal or occlude sections of the element.
2. Clone strategy
- Pros: It will correctly render the entire element in question,
regardless of shape or size.
- Cons: Slow because of the deep-cloning involved with CSS styling. The more
children elements that exist, the slower each step will take to render.
(This can be improved over time by pre-caching the next step in advance.)
There are also edge cases where Firefox will not clone the
CSS `margin` attribute of children elements.
In those cases, the callbacks Step.beforeCallback and Step.afterCallback
can be used to properly restore the margin.

NOTE: The clone strategy is always chosen if multiple selectors are
specified in StepConfiguration.selectors.

# Copyright and License

Copyright 2014, Zendesk Inc. Licensed under the Apache License Version 2.0, http://www.apache.org/licenses/LICENSE-2.0


