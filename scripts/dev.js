process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'development'

process.on('unhandledRejection', err => {
  throw err
})

const server = require('webpack-serve')
const serverConfig = require('../configs/server.config')

server({}, serverConfig).then(result => {

  // 当用户主动结束进程时，关闭 server 服务
  ['SIGINT', 'SIGTERM'].forEach(sign => {
    process.on(sign, function () {
      result.app.stop()
      process.exit()
    })
  })
})
