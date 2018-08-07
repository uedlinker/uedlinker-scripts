const path = require('path')
const { appPath } = require('./paths')
const combineConfig = require('../utils/combineConfig')

const defaultJestConfig = {
  bail: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'node',
  ],
  modulePaths: [
    '<rootDir>/src/',
  ],
  rootDir: appPath,
  setupFiles: [
    path.resolve(__dirname, './polyfills.js'),
    path.resolve(__dirname, './jestSetup.js'),
  ],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.jsx?$': path.resolve(__dirname, './jestBabelTransform.js'),
    '^(?!.*\\.(js|jsx|json)$)': path.resolve(__dirname, './jestOtherFileTransform.js'),
  },
  verbose: true,
}

module.exports = combineConfig('jest')(defaultJestConfig)
