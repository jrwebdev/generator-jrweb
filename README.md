# generator-jrweb

Simple Yeoman generator for front-end web projects. Unlike other generators which are often bloated and install more than
is needed, this generator only installs the bare minimum to get up-and-running.

Runs `webpack` with `webpack-dev-server` for development, with Babel or TypeScript for ES6/ES7 transpiliation,
along with source maps and a production build step. Uses SASS for CSS.

Includes a choice of either a basic bootstrap (choice of Angular 1.x, Angular 2, React) or an empty JavaScript file.

[![Travis](https://img.shields.io/travis/jrwebdev/generator-jrweb.svg)](https://travis-ci.org/jrwebdev/generator-jrweb)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

Ensure Yeoman is installed globally (`npm install -g yeoman`) and install the generator via:

```npm install -g generator-jrweb```

## Usage

From the command line, open the directory where you wish to create the project and enter:

```yo jrweb```