const path = require('path')
const webpack = require('webpack')
const { appPath, srcPath, entryPath, outputPath } = require('./paths')

// 获取用户自定义环境变量并在 webpack 中定义，自定义环境变量必须以 `UEDLINKER_` 开头，
// 在 `process.env` 对象上挂载了很多环境变量，但没有必须把这些环境变量都在 webpack 中定义。
const customEnvs = {}
const customEnvRe = /^UEDLINKER_/
for (let key in process.env) {
  if (customEnvRe.test(key)) {
    customEnvs[`process.env.${key}`] = JSON.stringify(process.env[key])
  }
}

module.exports = {
  context: appPath,
  entry: [
    path.resolve(__dirname, './polyfills.js'),
    entryPath,
  ],

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

  plugins: [
    new webpack.DefinePlugin(customEnvs),
  ],

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
    setImmediate: false,
  },
}
