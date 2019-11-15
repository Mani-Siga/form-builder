const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        index: [
            './src/index.js'
        ]
    },
    devtool: 'source-map',
    output: {
        libraryTarget: 'umd',
        filename: 'form-builder.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: [/.js$/],
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                }
            },
            {
                test: [/.css$/],
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'form-builder.css',
            chunkFilename: '[id].css',
            ignoreOrder: false,
        })
    ]
};