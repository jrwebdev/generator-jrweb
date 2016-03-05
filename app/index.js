var generators = require('yeoman-generator');
var gitUrl = require('git-remote-origin-url');
var beautify = require('gulp-beautify');
var gulpif = require('gulp-if');

module.exports = generators.Base.extend({

    constructor: function () {
        generators.Base.apply(this, arguments);

        /**
        var isAppJs = function(file) {
            return file.path.match(/src\/app\.(js|ts)$/);
        };
        this.registerTransformStream(gulpif(isAppJs, beautify({indentSize: 2})));
        **/

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
                name: 'Angular 1.4.x',
                value: 'ng1'
            },{
                name: 'Angular 2.0.0-beta.1',
                value: 'ng2'
            },{
                name: 'React',
                value: 'react'
            }]
        }, function (res) {
            this.framework = res.framework;
            done();
        }.bind(this));
    },

    getTypeScript: function () {
        var done = this.async();
        this.prompt({
            type: 'confirm',
            name: 'typescript',
            message: 'Use TypeScript?',
            default: false
        }, function (res) {
            this.typescript = res.typescript;
            done();
        }.bind(this));
    },

    copyFiles: function () {

        var appFileExt = this.typescript ? '.ts' : '.js';

        var files = [
            ['gitignore', '.gitignore'],
            'README.md',
            'package.json',
            'webpack.config.js',
            'src/index.html',
            ['src/app/' + this.framework + '.ejs', 'src/app' + appFileExt]
        ];

        if (this.typescript) {
            files.push('tsconfig.json');
        }

        var tplVars = {
            appname: this.appname,
            description: this.description,
            gitUrl: this.gitUrl,
            framework: this.framework,
            typescript: this.typescript
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
            'babel-preset-stage-0',
            'babel-plugin-transform-decorators-legacy',
            'css-loader',
            'style-loader',
            'html-loader',
            'postcss',
            'autoprefixer',
            'postcss-loader',
            'node-sass',
            'sass-loader'
        ];

        var tsds = [
            'lodash'
        ];

        var frameworkDeps = {
            none: {
                deps: [],
                devDeps: [],
                tsds: []
            },
            ng1: {
                deps: ['angular'],
                devDeps: [],
                tsds: ['angular']
            },
            ng2: {
                deps: [
                    'angular2@2.0.0-beta.8',
                    'rxjs@5.0.0-beta.2',
                    'zone.js@0.5.15',
                    'es6-promise@^3.0.2',
                    'es6-shim@^0.33.3',
                    'reflect-metadata@0.1.2'
                ],
                devDeps: [],
                tsds: ['angular2']
            },
            react: {
                deps: [
                    'react',
                    'react-dom'
                ],
                devDeps: [
                    'babel-preset-react',
                    'react-hot-loader'
                ],
                tsds: [
                    'react',
                    'react-dom'
                ]
            }
        };

        deps = deps.concat(frameworkDeps[this.framework].deps);
        devDeps = devDeps.concat(frameworkDeps[this.framework].devDeps);

        if (this.typescript) {
            devDeps = devDeps.concat(['typescript', 'typings', 'ts-loader']);
            tsds = tsds.concat(frameworkDeps[this.framework].tsds);
        }

        var generator = this;
        this.npmInstall(deps, {'save': true});
        this.npmInstall(devDeps, {'saveDev': true}, function () {
            if (generator.typescript) {
                generator.spawnCommandSync('node', ['./node_modules/.bin/typings', 'init']);
                tsds.forEach(function(tsd) {
                    generator.spawnCommandSync('node', ['./node_modules/.bin/typings', 'install', tsd, '--save']);
                });
            }
        });

    }

});