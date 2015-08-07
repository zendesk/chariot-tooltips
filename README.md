<pre>
   ___    _                         _              _
  / __|  | |_     __ _      _ _    (_)     ___    | |_
 | (__   | ' \   / _` |    | '_|   | |    / _ \   |  _|
  \___|  |_||_|  \__,_|   _|_|_   _|_|_   \___/   _\__|
_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|
"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'
</pre>

# Chariot
> Walkthroughs so easy, you might as well be flying in a chariot.

A Javascript library for creating step-by-step tooltip tutorials, using a
background overlay to bring focus to the elements you care about.

# Demo

Refer to [Development](#development) section below.

# Motivation
We believe that tooltips are better at drawing focus to highlighted elements
on a website when the background is dimmed out.

Existing tooltip overlay solutions don't use overlay backgrounds, or if they
do, they fail to consider when parent containers already have the CSS
`z-index` property set.

(A child element's `z-index` cannot override it's parent's `z-index`).

# Features

- Tutorial kicked off by query parameter
- Overlay hides background and clones your key elements over it
- `z-index` is taken care of
- Programmatic API and configurable callbacks
- Browser support includes every sane browser and IE9+.

# Usage

First, initialize chariot.

## `new Chariot.chariot(config)`

Once configured, to launch the tutorial, append the query parameter `tutorial`
to your URL setting it to the name of a tutorial defined in your configuration.

`http://www.example.com?tutorial=tutorialName`

## Configuration

Here's how to configure `chariot`:

[example](https://github.com/zendesk/chariot/blob/master/modules/config.example.js)

## API

### `Chariot.chariot(config)`

Creates the chariot instance.


# Setup
Install packages

	npm install

Install the gulp cli

	npm install -g gulp


# Development
To run a simple server to test out the script. Run:

	gulp connect

This will start a simple server that serves `index.html`, and loads `chariot.js` onto the page. The task will also watch your changes and reloads the page as the files are updated.

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

# Build
Run the following to build `chariot.js` into thd `/dist` directory.

	gulp

*Do not check in the `dist` directory. Release on github will contain the tarballs with compiled js/css.*

# Release

When you have merge in all your changes from your branch. Run the following **IN MASTER**:

	gulp release

This gulp task will

1. Bump version in package.json, npm-shrinkwrap.json, bower.json
1. Package release into the ```release/``` folder
1. Commit the version bump changes in package.json npm-shrinkwrap bower.json
1. Push the bump changes
1. Tag with the new version

After releasing, update the relevant files in your project which uses ChariotJS. Update version in bower/npm, or copy release/chariot.[min.]js, release/chariot.[min.]css into your project's ```vendor/``` folder


# Implementation

Chariot uses the hashchange event to determine if a tutorial query parameter
is present, then starts the corresponding tutorial.

# Copyright and License

Copyright 2014, Zendesk Inc. Licensed under the Apache License Version 2.0, http://www.apache.org/licenses/LICENSE-2.0


