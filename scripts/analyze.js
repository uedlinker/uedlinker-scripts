process.env.NODE_ENV = 'production'
process.env.BABEL_ENV = 'production'

process.on('unhandledRejection', err => {
  throw err
})

const chalk = require('chalk')
const webpack = require('webpack')
const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpackProdConfig = require('../configs/webpack.prod')

const configs = merge(webpackProdConfig, {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
})

webpack(configs, (err, stats) => {
  if (err) {
    console.log(chalk.red(err.stack || err))
    if (err.details) console.log(chalk.red(err.details))
    process.exit(1)
  }

  console.log(stats.toString({ colors: true }))
})
