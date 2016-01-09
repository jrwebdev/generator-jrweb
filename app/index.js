var generators = require('yeoman-generator');
var gitUrl = require('git-remote-origin-url');
var beautify = require('gulp-beautify');
var gulpif = require('gulp-if');

// TODO: Webapp or module (jrpackage)
// TODO: Routing setup
// TODO: Karma + Mocha/Jasmine/Tape
// TODO: Semantic release (jrpackage)
// TODO: CI Providers
// TODO: ES5/ES6/ES7
// TODO: JavaScript/TypeScript/CoffeeScript
// TODO: Redux/State Management
// TODO: Component generator
// TODO: E2E tests
// TODO: Perf
// TODO: Angular Material/Bootstrap/Foundation
// TODO: Google fonts
// TODO: Frameworks (ng1/ng2/React/Polymer/Circle.js/Aurelia/Ember/Backbone/Rendr/Meteor)
// TODO: Module bundler (JSPM/Webpack/Rollup)
// TODO: CSS processor (SASS/LESS/Stylus)
// TODO: Back-end (Socket.io/Falcor)
// TODO: eslint/esdoc/istanbul

module.exports = generators.Base.extend({

    constructor: function () {
        generators.Base.apply(this, arguments);

        var isAppJs = function(file) {
            return file.path.match(/src\/app\.js$/);
        };
        this.registerTransformStream(gulpif(isAppJs, beautify({indentSize: 2})));

        this.argument('appname', {type: String, required: false, default: this.appname});
    },

    getGitUrl: function () {
        var done = this.async();
        gitUrl('', function(err, url) {
            this.gitUrl = (!err && url) ? url : null;
            done();
        }.bind(this));
    },

    getAppName: function () {
        if (!this.args.length) {
            var done = this.async();
            this.prompt({
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname
            }, function (res) {
                this.appname = res.name;
                done();
            }.bind(this));
        }
    },

    getDescription: function () {
        var done = this.async();
        this.prompt({
            type: 'input',
            name: 'description',
            message: 'A description of your project'
        }, function (res) {
            this.description = res.description;
            done();
        }.bind(this));
    },

    getFramework: function () {
        var done = this.async();
        this.prompt({
            type: 'list',
            name: 'framework',
            message: 'Select which framework/library to use',
            default: 'none',
            choices: [{
                name: 'None',
                value: 'none'
            },{
                name: 'Angular',
                value: 'ng1'
            }]
        }, function (res) {
            this.framework = res.framework;
            done();
        }.bind(this));
    },

    copyFiles: function () {

        var files = [
            '.gitignore',
            'README.md',
            'package.json',
            'webpack.config.js',
            'src/index.html',
            ['src/app.ejs', 'src/app.js']
        ];

        var tplVars = {
            appname: this.appname,
            description: this.description,
            gitUrl: this.gitUrl,
            framework: this.framework
        };

        files.forEach(function (file) {

            if (typeof file === 'string') {
                inFile = file;
                outFile = file;
            } else {
                inFile = file[0];
                outFile = file[1];
            }

            this.fs.copyTpl(
                this.templatePath(inFile),
                this.destinationPath(outFile),
                tplVars
            )

        }.bind(this));

    },

    installDeps: function () {

        var deps = [
            'lodash'
        ];

        var devDeps = [
            'webpack',
            'webpack-dev-server',
            'babel',
            'babel-core',
            'babel-loader',
            'babel-preset-es2015',
            'css-loader',
            'style-loader',
            'html-loader',
            'postcss',
            'autoprefixer',
            'postcss-loader',
            'node-sass',
            'sass-loader'
        ];

        var frameworkDeps = {
            none: [],
            ng1: ['angular']
        };

        deps = deps.concat(frameworkDeps[this.framework]);

        this.npmInstall(deps, {'save': true});
        this.npmInstall(devDeps, {'saveDev': true});

    }

});