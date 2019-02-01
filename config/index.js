const path = require('path');

module.exports = {
    //
    dev: {
        //
        assetsSubDirectory: 'static',
        //
        assetsPublicPath: '/',
        //
        proxyTable: {
            '/Web': {
                target: 'http://localhost:9093',
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: {
                    '^/Web': ''
                }
            }
        },
        //
        host: 'localhost',
        //
        port: 3000,
        //
        autoOpenBrowser: true,
        //
        errorOverlay: true,
        //
        poll: false,
        //
        devtool: '#eval-source-map',
        //
        cssSourceMap: false
    },
    //
    build: {
        //
        index: path.resolve(__dirname, '../dist/index.html'),

        assetsRoot: path.resolve(__dirname, '../dist'),

        assetsSubDirectory: 'static',

        assetsPublicPath: './'
    }
}
