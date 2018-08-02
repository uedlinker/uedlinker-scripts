const { staticPath } = require('./paths')
const webpackDevConfig = require('./webpack.dev')
const combineConfig = require('../utils/combineConfig')

const defaultServeConfig = {
  config: webpackDevConfig,
  content: staticPath,
  open: true,
  port: 3000,
  devMiddleware: {
    publicPath: webpackDevConfig.output.publicPath,
  },
  hotClient: {
    logLevel: 'warn',
  },
}

module.exports = combineConfig('server')(defaultServeConfig)
