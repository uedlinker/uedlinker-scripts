const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const autoprefixer = require('autoprefixer')
const OfflinePlugin = require('offline-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const common = require('./webpack.common')
const combineConfig = require('../utils/combineConfig')
const { appPath, srcPath, staticPath } = require('./paths')
const { templatePath, sourceMap, publicPath, removeConsole } = require('./uedlinker.config')

const defaultProdConfig = merge(common, {
  mode: 'production',
  bail: true,

  // 暂时没有深究为什么使用这个选项，还不是很理解这个选项。
  // 如果有更好的选择，麻烦提交一个 Issue 并对比一下不同选项之间的差异。
  // 参考：http://cheng.logdown.com/posts/2016/03/25/679045
  devtool: sourceMap ? 'cheap-module-source-map' : '',

  output: {
    filename: 'assets/js/[name].[chunkhash].js',
    chunkFilename: 'assets/js/[name].[chunkhash].js',
    publicPath,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: srcPath,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              root: appPath,
              cwd: appPath,
              extends: path.resolve(__dirname, './babel.config.js'),
              cacheDirectory: true,
            },
          },
        ],
      },

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
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
          MiniCssExtractPlugin.loader,
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
              name: 'assets/images/[name].[hash].[ext]',
            },
          },
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/images/[name].[hash].[ext]',
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
              name: 'assets/fonts/[name].[hash].[ext]',
            },
          },
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.BABEL_ENV': JSON.stringify('production'),
    }),
    new CleanWebpackPlugin(['dist'], { root: appPath }),
    new CopyWebpackPlugin([
      { from: staticPath },
    ]),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[chunkhash].css',
      chunkFilename: 'assets/css/[name].[chunkhash].css',
    }),
    new HtmlWebpackPlugin({
      template: templatePath,
      // 下面的选项指定压缩 HTML 文件
      // https://github.com/kangax/html-minifier#options-quick-reference
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
      },
    }),
    new OfflinePlugin(),
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: !!sourceMap,
        uglifyOptions: {
          compress: {
            drop_console: !!removeConsole,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: !!sourceMap && {
            inline: false,
          },
        },
      }),
    ],
  },
})

module.exports = combineConfig('webpack')(defaultProdConfig)
