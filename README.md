# Chariot
A javascript library for create on screen step by step tutorials.

## Why did we create this?
Because we can.

# Usage
TBD

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

	npm run jscs

To automatically fix the style errors:
	
	npm run jscs-fix
