var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

var config = {
    context: __dirname + '/src',
    entry: './app.<%= (typescript ? 'ts' : 'js') %>',
    output: {
        path: __dirname + '/src',
        filename: 'app-bundle.js'
    },
    devtool: 'eval-source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'stage-0'],
                plugins: ['transform-decorators-legacy']
            }
        <% if (typescript) { -%>
        },{
            test: /\.ts$/,
            loader: 'ts'
        <% } -%>
        },{
            test: /\.css$/,
            loader: 'style!css?sourceMap!postcss'
        },{
            test: /\.scss$/,
            loader: 'style!css?sourceMap!postcss!sass?sourceMap'
        },{
            test: /\.html$/,
            loader: 'html'
        }]
    },
    postcss: function () {
        return [autoprefixer];
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        port: 8080
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};

if (process.env.NODE_ENV === 'production') {
    config.output.path = __dirname + '/dist';
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
    config.devtool = 'source-map';
}

module.exports = config;