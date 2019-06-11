const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '~': path.join(__dirname,'src')
        }
    }
};
