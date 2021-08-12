module.exports = {
  // 预设
  presets: [
    // 根据配置的目标浏览器或者运行环境，选择对应的语法包，从而将代码进行转换
    '@babel/preset-env',
    // react 语法包，让我们可以使用 React ES6 Class Component 的写法，支持JSX、TSX语法格式
    '@babel/preset-react',
  ],
  plugins:[
    '@babel/plugin-transform-runtime'
  ]
}