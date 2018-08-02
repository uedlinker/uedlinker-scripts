// 结合用户自定义 webpack 配置；
// 如果自定义配置是一个纯对象，则合并默认配置；
// 如果自定义配置是一个函数，则把默认配置当做参数传入到函数中，需要用户再返回一个对象。

const fs = require('fs')
const merge = require('webpack-merge')
const { isPlainObject, isFunction } = require('lodash')
const { customWebpackConfigPath } = require('../configs/paths')

module.exports = defaultConfig => {
  if (fs.existsSync(customWebpackConfigPath)) {
    const customConfig = require(customWebpackConfigPath)

    if (isPlainObject(customConfig)) {
      return merge(defaultConfig, customConfig)
    }

    if (isFunction(customConfig)) {
      const computedConfig = customConfig(defaultConfig)
      if (isPlainObject(computedConfig)) return computedConfig
    }
  }

  return defaultConfig
}
