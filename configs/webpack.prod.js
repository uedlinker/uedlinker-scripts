const path = require('path')
const cssnano = require('cssnano')
const merge = require('webpack-merge')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const common = require('./webpack.common')
const { appPath, srcPath, staticPath } = require('./paths')

module.exports = merge(common, {
  mode: 'production',
  bail: true,

  // 暂时没有深究为什么使用这个选项，还不是很理解这个选项。
  // 如果有更好的选择，麻烦提交一个 Issue 并对比一下不同选项之间的差异。
  // 参考：http://cheng.logdown.com/posts/2016/03/25/679045
  devtool: 'cheap-module-source-map',

  output: {
    filename: 'assets/js/[name].[chunkhash].js',
    chunkFilename: 'assets/js/[name].[chunkhash].js',
    // TODO: 生产环境下的 publicPath 应该使用用户配置的链接（大多数情况下是 CDN 地址）
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        include: srcPath,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // eslint-loader 的配置
          // https://github.com/webpack-contrib/eslint-loader#options
          cache: true,
          emitError: true,
          emitWarning: true,
          failOnError: true,
          // eslint CLIEngine 的配置
          // https://eslint.org/docs/developer-guide/nodejs-api#cliengine
          cwd: appPath,
          baseConfig: {
            extends: '@uedlinker/eslint-config-react',
          },
        },
      },

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
                cssnano(),
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
                cssnano(),
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
    new CleanWebpackPlugin(['dist'], { root: appPath }),
    new CopyWebpackPlugin([
      { from: staticPath },
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './template.html'),
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
  ],
})
