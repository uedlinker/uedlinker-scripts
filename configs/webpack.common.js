const { appPath, srcPath, entryPath, outputPath } = require('./paths')

module.exports = {
  context: appPath,
  entry: entryPath,

  output: {
    path: outputPath,
  },

  resolve: {
    modules: [
      'node_modules',
      srcPath,
    ],
    extensions: ['.js', '.json', '.jsx'],
  },

  module: {
    rules: [
      // 禁用 `require.ensure()`，动态加载使用 `import()`
      { parser: { requireEnsure: false } },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
    runtimeChunk: true,
  },

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
    setImmediate: false,
  },
}
