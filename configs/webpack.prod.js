const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  bail: true,

  // 暂时没有深究为什么使用这个选项，还不是很理解这个选项。
  // 如果有更好的选择，麻烦提交一个 Issue 并对比一下不同选项之间的差异。
  // 根据：http://cheng.logdown.com/posts/2016/03/25/679045
  devtool: 'cheap-module-source-map',

  output: {
    filename: 'assets/js/[name].[chunkhash].js',
    chunkFilename: 'assets/js/[name].[chunkhash].js',
    // TODO: 接收 `process.env.UEDLINKER_PUBLIC_PATH` 修改下面的值
    // 它应该是用户设置的生成环境下的 CDN 地址，例如：'http://domain.com/'
    publicPath: '/',
  },

  module: {
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './template.html'),
      favicon: '/favicon.ico',
      minify: true,
    }),
  ],
})
