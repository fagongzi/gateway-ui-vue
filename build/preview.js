/**
 * 使用nodejs创建本地的http服务
 * */
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer(); // See (†)

var requestType = {
  "css": "text/css",
  "js": "text/javascript",
  "html": "text/html"
};

var config = {
  target: 'http://localhost:9093',
  port: 3001,
  host: '0.0.0.0',
  dir: '../dist',
  prefix: '/v1',
  debug: true
};

var proxyConfig = {
  target: config.target,
  changeOrigin: true,
};

//
http.createServer(function (request, response) {
  var pathName = url.parse(request.url).pathname;
  var realName = path.join('.', pathName);
  var ext = path.extname(pathName);
  ext = ext ? ext.slice(1) : 'unknown';

  // 走转发走
  if (pathName.indexOf(config.prefix) !== -1) {
    config.debug && console.log(`Rewriting path from "${pathName}" =====> to "${proxyConfig.target}${pathName}"`);
    proxy.web(request, response, proxyConfig);
    return;
  }

  if (pathName.indexOf('static') === -1) {
    pathName = '/index.html';
  }

  realName = path.join(__dirname, config.dir, pathName);

  config.debug && console.log(realName);

  fs.exists(realName, function (exists) {
    if (!exists) {
      response.writeHead(404, {'Context-type': 'text/plain'});
      response.write('this request url ' + pathName + ' was not found on this server.');
      response.end();
    } else {
      fs.readFile(realName, 'binary', function (err, file) {
        if (err) {
          response.writeHead(500, {'Context-type': 'text/plain'});
          response.end(err);
        } else {
          var contentType = requestType[ext] || "text/plain";
          response.writeHead(200, {'Context-type': contentType});
          response.write(file, 'binary');
          response.end();
        }
      });
    }
  });
}).listen(config.port, config.host);

console.log(`server running at http://${config.host}:${config.port}/`);
