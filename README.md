# 账本项目-前端
依赖：
```yaml
specifiers:
  '@babel/cli': ^7.14.8
  '@babel/core': ^7.15.0
  '@babel/preset-env': ^7.15.0
  '@babel/preset-react': ^7.14.5
  axios: ^0.21.1
  babel-loader: ^8.2.2
  clean-webpack-plugin: ^4.0.0-alpha.0
  css-loader: ^6.2.0
  html-webpack-plugin: ^5.3.2
  less: ^4.1.1
  less-loader: ^10.0.1
  lib-flexible: ^0.3.2
  postcss-loader: ^6.1.1
  postcss-pxtorem: ^6.0.0
  react: ^17.0.2
  react-dom: ^17.0.2
  react-router-dom: ^5.2.0
  style-loader: ^3.2.1
  webpack: ^5.50.0
  webpack-cli: 3.3.12
  webpack-dev-server: ^3.11.2
  zarm: ^2.9.6

dependencies:
  axios: 0.21.1
  lib-flexible: registry.nlark.com/lib-flexible/0.3.2
  postcss-pxtorem: registry.nlark.com/postcss-pxtorem/6.0.0
  react: registry.nlark.com/react/17.0.2
  react-dom: registry.nlark.com/react-dom/17.0.2_react@17.0.2
  react-router-dom: registry.nlark.com/react-router-dom/5.2.0_react@17.0.2
  zarm: registry.nlark.com/zarm/2.9.6_react-dom@17.0.2+react@17.0.2

devDependencies:
  '@babel/cli': registry.nlark.com/@babel/cli/7.14.8_@babel+core@7.15.0
  '@babel/core': registry.nlark.com/@babel/core/7.15.0
  '@babel/preset-env': registry.nlark.com/@babel/preset-env/7.15.0_@babel+core@7.15.0
  '@babel/preset-react': registry.nlark.com/@babel/preset-react/7.14.5_@babel+core@7.15.0
  babel-loader: 8.2.2_6a7208b678074d97b8e10779794541f1
  clean-webpack-plugin: 4.0.0-alpha.0_webpack@5.50.0
  css-loader: registry.nlark.com/css-loader/6.2.0_webpack@5.50.0
  html-webpack-plugin: registry.nlark.com/html-webpack-plugin/5.3.2_webpack@5.50.0
  less: 4.1.1
  less-loader: registry.nlark.com/less-loader/10.0.1_less@4.1.1+webpack@5.50.0
  postcss-loader: registry.nlark.com/postcss-loader/6.1.1_webpack@5.50.0
  style-loader: registry.nlark.com/style-loader/3.2.1_webpack@5.50.0
  webpack: registry.nlark.com/webpack/5.50.0_webpack-cli@3.3.12
  webpack-cli: registry.nlark.com/webpack-cli/3.3.12_webpack@5.50.0
  webpack-dev-server: registry.nlark.com/webpack-dev-server/3.11.2_82edc660df6d20401a8f9ab62daca892
```
webpack配置：
```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, '../src/index.jsx'),
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../dist')
  },
  target: 'web',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    // historyApiFallback: true,
    compress: true,
    // webpack-dev-server启动时要指定ip，不能直接通过localhost启动，不指定会报错
    host: '127.0.0.1',
    port: 3000,
    hot: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.join(__dirname, '../src'),
      '@utils': path.join(__dirname, '../src/utils')
    }
  },
  module:{
    rules:[
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test:/\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
          },
          'postcss-loader',
          'less-loader',
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: path.resolve(__dirname, '../dist/index.html')
    })
  ]
}
```
babel：
```js
module.exports = {
  // 预设
  presets: [
    // 根据配置的目标浏览器或者运行环境，选择对应的语法包，从而将代码进行转换
    '@babel/preset-env',
    // react 语法包，让我们可以使用 React ES6 Class Component 的写法，支持JSX、TSX语法格式
    '@babel/preset-react',
  ]
}
```
postcss：
```js
module.exports = {
  plugins: [
    require("postcss-pxtorem")({
      rootValue: 37.5,
      propList: ['*'],
      selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
    })
  ]
}
```
