const path = require('path')
const { appPath } = require('./paths')
const combineConfig = require('../utils/combineConfig')

const polyfillsPath = path.resolve(__dirname, './polyfills.js')
const templatePath = path.resolve(__dirname, './template.html')

const defaultConfig = {
  templatePath,
  polyfillsPath,
  publicPath: '/',
  sourceMap: false,
  removeConsole: true,
}

const combinedConfig = combineConfig('uedlinker')(defaultConfig)

if (!path.isAbsolute(combinedConfig.polyfillsPath)) {
  combinedConfig.polyfillsPath = path.resolve(appPath, combinedConfig.polyfillsPath)
}
if (!path.isAbsolute(combinedConfig.templatePath)) {
  combinedConfig.templatePath = path.resolve(appPath, combinedConfig.templatePath)
}

module.exports = combinedConfig
