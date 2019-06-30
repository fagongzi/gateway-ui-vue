'use strict'
const path = require('path');
const defaultSettings = require('./src/setting.js');

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.name || 'Gateway UI';
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  publicPath: '/',
  assetsDir: 'static',
  lintOnSave: isDev,
  productionSourceMap: false,
  devServer: {
    clientLogLevel: 'warning', //
    historyApiFallback: true, //
    hot: true, //
    compress: true, //
    port: 3000,
    host: 'localhost',
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/',
    quiet: true, //
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:9093',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    watchOptions: {
      poll: false
    }
  },
  // configure webpack
  // 会被 webpack-merge 合并进去。
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '~': resolve('src'),
      }
    },
    output: {
      filename: isProd ? 'static/js/[name].[chunkhash:8].js' : 'static/js/[name].[hash:8].js',
      chunkFilename: isProd ? 'static/js/[name].[chunkhash:8].js' : 'static/js/[name].[hash:8].js'
    },
    devtool: isDev ? '#eval-source-map' : ''
  },

  // 链式操作
  chainWebpack(config) {
    //
    config.plugins.delete('preload') // TODO: need test
    //
    config.plugins.delete('prefetch') // TODO: need test
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    //
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    //
    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    //
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          //
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          //
          config
            .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // only package third parties that are initially dependent
              },
              elementUI: {
                name: 'chunk-elementUI', // split elementUI into a single package
                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // can customize your rules
                minChunks: 3, //  minimum common number
                priority: 5,
                reuseExistingChunk: true
              }
            }
          })

          //
          config.optimization.runtimeChunk('single')
        }
      )
  }
};
