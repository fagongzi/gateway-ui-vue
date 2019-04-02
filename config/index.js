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
                // target:"http://gw.infinivision.cn:9292",
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

    build: {
        //
        index: path.resolve(__dirname, '../dist/index.html'),

        assetsRoot: path.resolve(__dirname, '../dist'),

        assetsSubDirectory: 'static',

        assetsPublicPath: './'
    },

    //
    preview: {
        target: 'http://localhost:9093',
        port: 3001,
        host: '0.0.0.0',
        dir: '../dist',
        prefix: '/v1',
        debug: true
    }
}
