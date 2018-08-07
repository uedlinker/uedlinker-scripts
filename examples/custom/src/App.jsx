import React from 'react'

// 加载 .css 文件
import './reboot.css'
// 加载 .scss 文件
import './app.scss'
// 加载 .less 文件，测试自定义 webpack 配置
import './app.less'

import Button from 'components/Button'

const App = () => (
  <div className="app">
    <h1>Hello World!</h1>
    <p>自定义环境变量 UEDLINKER_MY_ENV 的值为：<b>{ process.env.UEDLINKER_MY_ENV }</b>。</p>
    <Button>测试按钮</Button>
  </div>
)

export default App
