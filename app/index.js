var generators = require('yeoman-generator');
var gitUrl = require('git-remote-origin-url');

module.exports = generators.Base.extend({

    constructor: function () {
        generators.Base.apply(this, arguments);
        //this.argument('appname', {type: String, required: false});
    },

    getGitUrl: function () {
        var done = this.async();
        gitUrl('', function(err, url) {
            this.gitUrl = (!err && url) ? url : null;
            done();
        }.bind(this));
    },

    getAppName: function () {
        var done = this.async();
        this.prompt({
            type: 'input',
            name: 'name',
            message: 'Your project name',
            default: this.appname,
            store: true
        }, function (res) {
            this.appname = res.name;
            done();
        }.bind(this));
    },

    getDescription: function () {
        var done = this.async();
        this.prompt({
            type: 'input',
            name: 'description',
            message: 'A description of your project',
            store: true
        }, function (res) {
            this.description = res.description;
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
            'src/app.js'
        ];

        // TODO: Git user
        var tplVars = {
            appname: this.appname,
            description: this.description,
            gitUrl: this.gitUrl
        };

        files.forEach(function (file) {
            this.fs.copyTpl(
                this.templatePath(file),
                this.destinationPath(file),
                tplVars
            );
        }.bind(this));

    },

    //installDeps: function () {
    //    this.npmInstall([
    //        'webpack',
    //        'webpack-dev-server',
    //        'babel',
    //        'babel-core',
    //        'babel-loader',
    //        'babel-preset-es2015',
    //        'css-loader',
    //        'style-loader',
    //        'html-loader',
    //        'postcss',
    //        'autoprefixer',
    //        'postcss-loader',
    //        'node-sass',
    //        'sass-loader'
    //    ],{
    //        'saveDev': true
    //    });
    //},

    complete: function () {
        this.log('Setup complete. To start the app, run `npm start`.');
    }

});