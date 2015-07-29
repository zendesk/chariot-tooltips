![alt tag](http://thumbs3.jigidi.com/thumbs/GM5R5TBP/l)
# Chariot
A javascript library for create on screen step by step tutorials.

## Motivation
We believe that tooltips are better at drawing focus to highlighted elements
on a website when the background is dimmed out.  Existing tooltip overlay
solutions did not use overlay backgrounds, and they also fail when parent
elements already make use of z-index property.
(A child's z-index cannot override it's parent's z-index).

# Usage

To launch the tutorial, add the query parameter "tutorial" equal to the name of a
tutorial in your configuration.
`http://www.example.com?tutorial=test`


# Setup
Install packages

	npm install

Install the gulp cli

	npm install -g gulp


# Development
To run a simple server to test out the script. Run:

	gulp connect

This will start a simple server that serves `index.html`, and loads `chariot.js` onto the page. The task will also watch your changes and reloads the page as the files are updated.

# Test

## Command Line
To run test in command line, run:

	gulp test

## Browser
If you want to test the same test suite in multiple browsers, run:

	gulp testem

The browsers to test can be configured in `testem.yml`, currently it is configured to test in all major browsers (Firefox, Safari, Chrome) and PhantomJS.

# Build
Run the following to build `chariot.js` into thd `/dist` directory.

	gulp

*Do not check in the `dist` directory. Release on github will contain the tarballs with compiled js/css.*

# Release
Run the following style-checker before pushing your branch.

	gulp style

To automatically fix the style errors:

	gulp style-fix

To update the generated docs:

	gulp js-doc
