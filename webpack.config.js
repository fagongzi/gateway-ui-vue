/*
* author: wancheng
* date: 11/5/18
* desc:
*/


const resolve = require('path').resolve;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const url = require('url');
const publicPath = '';

module.exports = (options = {}) => ({

    entry: {
        vendor: './src/vendor.js',
        index: './src/main.js'
    },

    output: {
        path: resolve(__dirname, 'dist'),
        filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
        chunkFilename: '[id].js?[chunkhash]',
        publicPath: options.dev ? '/assets/' : './'
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.svg$/,
                include: [resolve('src/icons')],
                use: [{
                    loader: "svg-sprite-loader",
                    options: {
                        symbolId: 'icon-[name]'
                    }
                }]
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                exclude: [resolve('src/icons')],
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 100000
                    }
                }]
            }
        ]
    },

    plugins: [

        new webpack.DefinePlugin({
            'process.env': options.dev ? require('./config/dev.env') : require('./config/prod.env')
        }),

        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ],

    resolve: {
        alias: {
            '~': resolve(__dirname, 'src') // 使用 alias 起别名，然后使用相对路径找文件。
        },
        extensions: ['.js', '.vue', '.json', '.css']
    },

    devServer: {
        host: 'localhost',
        port: 3000,
        proxy: {
            '/Web': {
                target: 'http://localhost:9093',
                changeOrigin: true,
                pathRewrite: {
                    '^/Web': ''
                }
            }
        },
        historyApiFallback: {
            index: url.parse(options.dev ? '/assets/' : publicPath).pathname
        }
    },

    devtool: options.dev ? '#eval-source-map' : '#source-map'
});
