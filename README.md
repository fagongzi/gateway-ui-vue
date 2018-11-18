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
"build": "rimraf build && webpack -p --progress --hide-modules"
}
```


## 基本使用方法

Gateway 后端核心服务请查阅 [fagongzi/gateway](https://github.com/fagongzi/gateway)

### 修改配置

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

