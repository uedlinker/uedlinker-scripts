const webpackDevConfig = require('./webpack.dev')
const { staticPath } = require('./paths')

module.exports = {
  config: webpackDevConfig,
  content: staticPath,
  hotClient: false,
  logLevel: 'silent',
}
