#! /usr/bin/env node

// TODO: 当使用命令 `uedlinker-scripts --help` 时，删除默认的 help 信息

const path = require('path')
const chalk = require('chalk')
const commander = require('commander')
const { spawnSync } = require('child_process')
const packageJSON = require('../package')

process.on('unhandledRejection', err => {
  throw err
})

commander
  .version(packageJSON.version)
  .arguments('<cmd>')

  .action(cmd => {
    const cmds = ['dev', 'build']

    if (cmds.includes(cmd)) {
      const script = path.resolve(__dirname, `../scripts/${cmd}.js`)
      const node = spawnSync('node', [script], { stdio: 'inherit' })

      if (node.signal) {
        process.exit(1)
      }

      process.exit(node.status)

    } else {
      console.log()
      console.log(chalk.red(`  命令 \`uedlinker-scripts ${cmd}\` 不合法`))
      commander.help(() => '')
    }
  })

  .on('--help', () => {
    console.log()
    console.log('  使用: uedlinker-scripts <命令>')
    console.log()
    console.log('  命令:')
    console.log()
    console.log('    dev    启动开发环境')
    console.log('    build  生产环境打包')
    console.log()
  })
  .parse(process.argv)

// 直接使用 `uedlinker-scripts` 命令时，显示 help 信息
if (commander.args.length === 0) {
  commander.help(() => '')
}
