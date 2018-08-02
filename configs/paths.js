const fs = require('fs')
const path = require('path')

const appPath = fs.realpathSync(process.cwd())
const srcPath = path.resolve(appPath, './src')
const entryPath = path.resolve(srcPath, './index.js')
const staticPath = path.resolve(appPath, './static')
const outputPath = path.resolve(appPath, './dist')

if (!fs.existsSync(entryPath)) {
  throw new Error(`找不到入口文件：${entryPath}，请新建此文件`)
}

if (!fs.existsSync(staticPath)) {
  throw new Error(`找不到静态文件目录：${staticPath}，请新建此目录`)
}

module.exports = {
  appPath,
  srcPath,
  entryPath,
  staticPath,
  outputPath,

  // 用户自定义文件路径
  customServerConfigPath: path.resolve(appPath, './server.config.js'),
  customWebpackConfigPath: path.resolve(appPath, './webpack.config.js'),
}
