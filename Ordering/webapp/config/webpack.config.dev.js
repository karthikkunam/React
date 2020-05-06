const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname),
    entry: ['babel-polyfill','../server.js'],
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'server.js',
        libraryTarget: 'commonjs'
    },
    watch: false,
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['@babel/env']],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties"]
                            ],
                            compact: false,
                            babelrc: false
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    optimization: {
        minimize: false,
        namedModules: true
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: '../.env' },
            { from: '../private.key' },
            { from: '../public.key' },
            { from: '../node_modules/ioredis', to: '../dist/node_modules/ioredis'},
            {
                context: '../client/build/',
                from: '**/*',
                to: '../dist/public/',
                toType:'dir',
                force: true,
            }
        ])
    ],
    externals: [{
        "ioredis": 'ioredis',
    },
        nodeExternals()],
    target: 'node',
    node: {
        // Allow these globals.
        __filename: false,
        __dirname: false
    },
    stats: 'errors-only',
    bail: true
};
