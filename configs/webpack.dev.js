const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('./webpack.common')
const { appPath, srcPath } = require('./paths')
const combineCustomWebpackConfig = require('../utils/combineCustomWebpackConfig')

const defaultDevConfig = merge(common, {
  mode: 'development',

  // 暂时没有深究为什么使用这个选项，还不是很理解这个选项。
  // 如果有更好的选择，麻烦提交一个 Issue 并对比一下不同选项之间的差异。
  // 参考：http://cheng.logdown.com/posts/2016/03/25/679045
  devtool: 'cheap-module-eval-source-map',

  output: {
    filename: 'assets/js/bundle.js',
    chunkFilename: 'assets/js/[name].chunk.js',
    pathinfo: true,
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: srcPath,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          root: appPath,
          cwd: appPath,
          extends: path.resolve(__dirname, './babel.config.js'),
          cacheDirectory: true,
        },
      },

      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ],
      },

      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          'sass-loader',
        ],
      },

      {
        test: /\.(bmp|png|jpe?g|gif|svg)$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            loader: 'url-loader',
          },
          {
            resourceQuery: /external/,
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[ext]',
            },
          },
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/images/[name].[ext]',
            },
          },
        ],
      },

      {
        test: /\.(eot|ttf|woff|woff2)$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            loader: 'url-loader',
          },
          {
            resourceQuery: /external/,
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[ext]',
            },
          },
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.BABEL_ENV': JSON.stringify('development'),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './template.html'),
    }),
  ],
})

module.exports = combineCustomWebpackConfig(defaultDevConfig)
