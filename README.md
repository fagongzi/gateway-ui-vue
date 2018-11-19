# Gateway UI By Element UI
> Gateway 可视化管理界面,thanks to [Element UI](http://element-cn.eleme.io/#/zh-CN)


## install

```bash
# install
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production with minification
npm run build

```
见package.json 文件的 script操作
```
{
"dev": "webpack-dev-server --inline --hot --env.dev",
"build": "rimraf dist && webpack -p --progress --hide-modules"
}
```


## 基本使用方法

Gateway 后端核心服务请查阅 [fagongzi/gateway](https://github.com/fagongzi/gateway)

### dev 环境修改配置

见 webpack.config.js 文件的 devServer 配置
```
{
        host: 'localhost',
        port: 3000, // 启动端口
        proxy: {
            '/Web': {
                target: 'http://localhost:9093', // 转发地址
                changeOrigin: true,
                pathRewrite: {
                    '^/Web': ''
                }
            }
        },
        historyApiFallback: {
            index: url.parse(options.dev ? '/assets/' : publicPath).pathname
        }
    }
```

见config 文件下面的 dev.env.js 文件

```
{
    NODE_ENV: '"development"',
    ENV_CONFIG: '"dev"',
    BASE_URL:'""',
    BASE_API: '"/Web"'
}
```

BASE_URL 表示 访问gateway http 服务的地址。
BASE_API 表示请求url 地址的根的path，在dev 环境下面 主要是用于为了代理请求，防止浏览器访问的时候，报跨域错误。



### prod 环境配置
见config 文件下面的 prod.env.js 文件

```
{
    NODE_ENV: '"production"',
    ENV_CONFIG: '"prod"',
    BASE_URL:'"http://localhost:9093"', // 自行修改。
    BASE_API: '""'
}
```


## 部署到 nginx 静态服务器上面

```
npm run build
```

生成了 dist 文件夹，直接通过 nginx 配置一个 静态服务。

在通过浏览器访问的时候，会报跨域报错，自行百度下，如何关闭chrome 浏览器的跨域报错问题。
