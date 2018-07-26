const path = require('path')
const { appPath, srcPath, entryPath, outputPath } = require('./paths')

module.exports = {
  context: appPath,
  entry: entryPath,

  output: {
    path: outputPath,
  },

  resolve: {
    modules: [
      srcPath,
      path.resolve(appPath, './node_modules'),
    ],
    extensions: ['.js', '.json', '.jsx'],
  },
}
