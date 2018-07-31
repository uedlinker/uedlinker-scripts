const { staticPath } = require('./paths')
const webpackDevConfig = require('./webpack.dev')

module.exports = {
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
