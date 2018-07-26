const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('./webpack.common')
const { staticPath } = require('./paths')

module.exports = merge(common, {
  mode: 'development',

  // 暂时没有深究为什么使用这个选项，还不是很理解这个选项。
  // 如果有更好的选择，麻烦提交一个 Issue 并对比一下不同选项之间的差异。
  // 根据：http://cheng.logdown.com/posts/2016/03/25/679045
  devtool: 'cheap-module-eval-source-map',

  output: {
    filename: 'assets/js/bundle.js',
    chunkFilename: 'assets/js/[name].chunk.js',
    pathinfo: true,
    publicPath: '/',
  },

  module: {
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './template.html'),
      favicon: '/favicon.ico',
    }),
  ],

  devServer: {
    compress: true,
    contentBase: staticPath,
    historyApiFallback: {
      disableDotRule: true,
    },
    host: '0.0.0.0',
    open: true,
    openPage: '',
    overlay: true,
    port: 3000,
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    clientLogLevel: 'none',
  },
})
