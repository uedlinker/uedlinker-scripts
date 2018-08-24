const { staticPath } = require('./paths')
const execSync = require('child_process').execSync;
const webpackDevConfig = require('./webpack.dev')
const combineConfig = require('../utils/combineConfig')

const port = 3000

const defaultServeConfig = {
  config: webpackDevConfig,
  content: staticPath,
  open: false,
  port: port,
  devMiddleware: {
    publicPath: webpackDevConfig.output.publicPath,
  },
  hotClient: {
    logLevel: 'warn',
  },
  on: {
    listening: () => {
      execSync('ps cax | grep "Google Chrome"');
      execSync(
        `osascript chrome.applescript "${encodeURI(
          `http://localhost:${port}`
        )}"`,
        {
          cwd: __dirname,
          stdio: 'ignore',
        }
      );
    },
  }
}

module.exports = combineConfig('server')(defaultServeConfig)
