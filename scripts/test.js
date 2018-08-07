process.env.NODE_ENV = 'test'
process.env.BABEL_ENV = 'test'

process.on('unhandledRejection', err => {
  throw err
})

const path = require('path')
const jest = require('jest')
const args = process.argv.slice(2)

args.push('--config', path.resolve(__dirname, '../configs/jest.config.js'))

jest.run(args)
