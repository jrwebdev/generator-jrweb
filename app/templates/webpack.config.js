var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
    context: __dirname + '/src',
    entry: './app.js',
    output: {
        path: __dirname + '/src',
        filename: 'app-bundle.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style!css!postcss'
        },{
            test: /\.scss$/,
            loader: 'style!css!postcss!sass'
        },{
            test: /\.html$/,
            loader: 'html'
        },{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }]
    },
    postcss: function () {
        return [autoprefixer];
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};