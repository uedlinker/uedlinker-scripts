// 结合用户自定义配置（Jest、Babel、Webpack、webpack-server）；
// 如果自定义配置是一个纯对象，则合并默认配置；
// 如果自定义配置是一个函数，则把默认配置当做参数传入到函数中，需要用户再返回一个对象。

const fs = require('fs')
const merge = require('webpack-merge')
const { isPlainObject, isFunction } = require('lodash')

const {
  customJestConfigPath,
  customBabelConfigPath,
  customServerConfigPath,
  customWebpackConfigPath,
  customUedlinkerConfigPath,
} = require('../configs/paths')

module.exports = type => {
  let customPath = ''

  switch (type) {
    case 'jest': customPath = customJestConfigPath; break
    case 'babel': customPath = customBabelConfigPath; break
    case 'server': customPath = customServerConfigPath; break
    case 'webpack': customPath = customWebpackConfigPath; break
    case 'uedlinker': customPath = customUedlinkerConfigPath; break
  }

  return defaultConfig => {
    if (!customPath) return defaultConfig

    if (fs.existsSync(customPath)) {
      const customConfig = require(customPath)

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
}
