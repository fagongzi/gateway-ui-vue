const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


// For NamedChunksPlugin
const seen = new Set()
const nameLength = 4

const prodWebpackConfig = merge(baseWebpackConfig, {
    // mode
    mode: 'production',
    // output
    output: {
        publicPath: config.build.assetsPublicPath,
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash:8].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash:8].js')
    },
    // module
    module: {
        rules: utils.styleLoaders({
            sourceMap: false,
            extract: true,
            usePostCSS: true
        })
    },
    // plugins
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/prod.env')
        }),
        // 单独提取css 文件。
        //
        // extract css into its own file
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash:8].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash:8].css')
        }),

        new HtmlWebpackPlugin({
            //
            filename: config.build.index,
            template: 'src/index.html',
            inject: true,
            templateParameters: {
                BASE_URL: config.build.assetsPublicPath + config.build.assetsSubDirectory,
            },
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),

        new ScriptExtHtmlWebpackPlugin({
            //`runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
        }),
        // keep chunk.id stable when chunk has no name
        new webpack.NamedChunksPlugin(chunk => {
            if (chunk.name) {
                return chunk.name
            }
            const modules = Array.from(chunk.modulesIterable)
            if (modules.length > 1) {
                const hash = require('hash-sum')
                const joinedHash = hash(modules.map(m => m.id).join('_'))
                let len = nameLength
                while (seen.has(joinedHash.substr(0, len))) len++
                seen.add(joinedHash.substr(0, len))
                return `chunk-${joinedHash.substr(0, len)}`
            } else {
                return modules[0].id
            }
        }),
        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),
    ],
    // optimization
    optimization: {
        splitChunks: {
            chunks: 'all', // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
            cacheGroups: {
                // libs
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // 只打包初始时依赖的第三方
                },
                // elementui
                elementUI: {
                    name: 'chunk-elementUI', // 单独将 elementUI 拆包
                    priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                    test: /[\\/]node_modules[\\/]element-ui[\\/]/
                },
                commons: {
                    name: 'chunk-commons',
                    test: path.resolve(__dirname, '../src/components'), // 可自定义拓展你的规则
                    minChunks: 3, // 最小公用次数
                    priority: 5,
                    reuseExistingChunk: true
                }
            }
        },

        runtimeChunk: 'single',

        minimizer: [

            new UglifyJsPlugin({
                uglifyOptions: {
                    mangle: {
                        safari10: true
                    }
                },
                sourceMap: config.build.productionSourceMap,
                cache: true,
                parallel: true
            }),

            // Compress extracted CSS. We are using this plugin so that possible
            // duplicated CSS from different components can be deduped.
            new OptimizeCSSAssetsPlugin()
        ]
    },
    // performance
    performance: {
        // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
        hints: 'error',
        // 根据入口起点的最大体积，控制webpack何时生成性能提示,整数类型,以字节为单位
        maxEntrypointSize: 5000000,
        // 最大单个资源体积，默认250000 (bytes)
        maxAssetSize: 3000000
    }
});

module.exports = prodWebpackConfig;
