process.env.NODE_ENV = 'development'

const server = require('webpack-serve')
const serverConfig = require('../configs/server.config')

server({}, serverConfig).then(result => {
  result.on('listening', () => {
    console.log('服务已开启')
  })

  result.on('build-started', () => {
    console.log('开始构建')
  })

  result.on('build-finished', () => {
    console.log('构建成功')
  })

  result.on('compiler-error', () => {
    console.log('构建出错')
  })

  result.on('compiler-warning', () => {
    console.log('构建警告')
  })
})
