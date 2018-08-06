# uedlinker-scripts

React 单页应用构建脚本。

- [目标](#目标)
- [功能](#功能)
- [使用](#使用)
  - [开启 HMR](#开启-hmr)
  - [开启离线缓存](#开启离线缓存)
- [自定义配置](#自定义配置)
  - [自定义环境命令](#自定义环境命令)
  - [自定义 Webpack 配置](#自定义-webpack-配置)
  - [自定义 webpack-server 配置](#自定义-webpack-server-配置)
  - [自定义 Babel 配置](#自定义-babel-配置)
- [问题](#问题)
- [TODO](#todo)

## 目标

分离构建工具和业务开发两者的工作。在众多的 React 单页应用中，都使用同一个构建脚本，方便构建工具的维护和升级。

[React] 生态中，我所知道的最出名的构建工具就是 [Create React App]，一套很优秀的工具。但在实际的业务开发中，还是没有满足需求，缺少很多自定义的功能。虽然可以通过 `eject` 来全面化的自定义，但在众多的应用中，都要 `eject`，在维护和升级时，就显得麻烦和繁琐。以下就是我使用此工具（不 `eject` 时）遇到的问题：

- 开发时重新构建速度慢（想其原因应该是在重新构建前检查了代码样式）；
- 其工具内依赖的 ESLint 版本太低，遇到自定义一套依赖高版本的 ESLint 的规范时，会起冲突；
- 无法自定义 Webpack、Babel 和 ESLint 配置；
- 暂时不支持 Sass 和 Less 等预处理器（看其代码中已经有 sass-loader 了，但迄今为止的发新版本中依然没有 sass-loader）；
- 很多依赖包的版本很低（Webpack 还是使用的 v3.x），且很多依赖包的版本都是固定的。

总之，此构建脚本就是在 [Create React App] 的基础上，解决以上问题，不 `eject` 时，还能满足开发需求。

## 功能

此脚本使用 [Webpack] 作为构建工具，使用 [Babel] 作为编译工具，使用 [webpack-server] 作为开发服务器，并提供一些便利的脚本命令：

- **`uedlinker-scripts dev`：** 启动开发环境；
- **`uedlinker-scripts build`：** 生产环境打包。

一般情况下，你只需要使用这些命令就能够满足大多数开发需求。当遇到不能满足需求的时候，请查看[自定义配置](#自定义配置)章节。不自定义时，默认有以下功能：

- 支持 ES 最新的语法（包括处于草案中的语法）；
- 支持 [JSX] 语法；
- 支持 [Flowtype] 类型检查；
- 支持代码分离和[懒加载](https://webpack.js.org/guides/lazy-loading/)；
- 支持 CSS 自动加前缀；
- 支持开发环境下压缩 HTML、CSS 和 JS 代码；
- 支持热更新重载（HMR）；
- 支持离线缓存（PWA）；
- 支持 Polyfills；
- 支持自定义配置。
- 支持解析的文件后缀：
  - 脚本：`.js`、`.jsx`；
  - 样式：`.css`、`.scss`；
  - 图片：`.bmp`、`.png`、`.jpg`、`.jpeg`、`.gif`、`.svg`；
  - 字体：`.eot`、`.ttf`、`.woff`、`woff2`。

还有很多文件在默认配置中不支持解析，但你可以在自定义的 webpack 配置中添加一个文件解析规则，[查看示例](#自定义-webpack-配置)。

## 使用

在使用此脚本前，你需要安装 [@uedlinker/scripts] 包，最好将其作为本地依赖：

```shell
npm install --save-dev @uedlinker/scripts
```

然后在 package.json 中配置命令：

```js
{
  "scripts": {
    "dev": "uedlinker-scripts dev",
    "build": "uedlinker-scripts build"
  }
}
```

最后，执行脚本命令：

```shell
# 启动开发环境
npm run dev
```

### 开启 HMR

虽然脚本默认支持 HMR，但也需要编写一些额外的代码。在入口文件中，你需要编写下面的代码：

```js
// src/index.js
import React from 'react'
import { render } from 'react-dom'

import App from './App'

const renderApp = Component => {
  render(
    <Component />,
    document.getElementById('root')
  )
}

renderApp(App)

// 开启 HMR
if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept(['./App'], () => {
    const App = require('./App').default
    renderApp(App)
  })
}
```

[查看详情](https://github.com/uedlinker/uedlinker-scripts/blob/master/examples/basic/src/index.js)

### 开启离线缓存

与开启 HMR 一样，你也需要在入口文件中编写下面的代码：

```js
// src/index.js
if (process.env.NODE_ENV === 'production') {
  const OfflinePluginRuntime = require('offline-plugin/runtime').default
  OfflinePluginRuntime.install()
}
```

[查看详情](https://github.com/uedlinker/uedlinker-scripts/blob/master/examples/basic/src/index.js)

## 自定义配置

此脚本允许用户自定义配置，包括：[自定义环境命令](#自定义环境命令)、[自定义 Webpack 配置](#自定义-webpack-配置)、[自定义 webpack-server 配置](#自定义-webpack-server-配置)、[自定义 Babel 配置](#自定义-babel-配置)。

### 自定义环境命令

脚本默认提供了 `NODE_ENV` 和 `BABEL_ENV` 两个环境命令，它们是只读的，不能够通过命令行修改这两个环境变量的值，只能在前端代码中读取到这两个变量，因为这两个变量分别决定了 [Webpack] 和 [Babel] 的运行模式，用户修改会导致它们的运行模式发生不可预测的变化。在执行不同命令时，它们的值也不一样，在 `uedlinker-scripts dev` 命令中，它们的值都是 `development`，在 `uedlinker-scripts build` 命令中，它们的值都是 `production`。

你可以在你的命令中自定义环境变量：`cross-env UEDLINKER_MY_ENV=awesome uedlinker-scripts dev`。其中使用了 [cross-env] 这个工具，它的作用是跨平台定义环境变量。这样，你可以在你的前端代码中通过 `process.env.UEDLINKER_MY_ENV` 获取到值 `awesome`。

**注意：所有的自定义环境变量都要以 `UEDLINKER_` 开头。** 因为在 `process.env` 上还挂载了很多其他的环境变量，这样做防止用户在自定义时不小心修改了其他的环境变量的值。

当 `NODE_ENV` 和 `BABEL_ENV` 的值不能满足需求时，就需要自定义环境变量。经常遇到的一种情况就是预发环境：后台接口使用测试环境的，前端代码使用生产环境下的。下面是没有自定义环境变量的情况下的前端接口配置文件：

```js
// configs/index.js

// 这里我们使用 NODE_ENV 环境变量来决定使用什么环境下的接口；
// 因为 BABEL_ENV 的值和 NODE_ENV 是一样的，所以使用谁都没有差别。
const env = process.env.NODE_ENV

export default {
  serverAddress: env === 'production' ? 'api.example.com' : 'test-api.example.com'
}
```

上面个的代码只能够满足两种情况：前端开发环境下使用 'test-api.example.com' 地址；生产环境下使用 'api.example.com' 接口。如何能够满足预发环境：生产环境下使用 'test-api.example.com'。可以通过自定义环境变量来解决：

```js
// package.json

...
"scripts": {
  "dev": "cross-env UEDLINKER_ADRESS_ENV=development uedlinker-scripts dev",
  "build": "cross-env UEDLINKER_ADRESS_ENV=production uedlinker-scripts build",
  "build:pre": "cross-env UEDLINKER_ADRESS_ENV=development uedlinker-scripts build"
}
...
```

```js
// configs/index.js

// 这里使用 UEDLINKER_ADRESS_ENV 决定使用什么环境下的 API
const env = process.env.UEDLINKER_ADRESS_ENV

export default {
  serverAddress: env === 'production' ? 'api.example.com' : 'test-api.example.com'
}
```

### 自定义 Webpack 配置

在你的项目根目录下添加一个 `webpack.config.js` 文件就能够自定义 [Webpack] 配置。你可以导出一个对象或一个函数。当导出对象时，此脚本会合并你的自定义配置；当导出函数时，此脚本会把默认配置注入到你的函数中，并执行一次这个函数，使用函数返回的对象作为 [Webpack] 的配置。下面我们以添加一个解析 `.less` 的配置为例来说明：

```js
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const env = process.env.NODE_ENV
const isProd = env === 'production'

module.exports = defaultConfig => {
  defaultConfig.module.rules.push({
    test: /\.less$/,
    use: [
      isProd ? MiniCssExtractPlugin.loader : 'style-loader',
      'css-loader',
      'less-loader'
    ],
  })
  return defaultConfig
}
```

在此脚本中，默认使用 `mini-css-extract-plugin` 作为提取 CSS 的工具。在这些依赖包中，你不需要再安装 `mini-css-extract-plugin`、`style-loader` 和 `css-loader` 包，因为脚本已经默认安装了，并且你自定义配置中的 `MiniCssExtractPlugin.loader` 必须是和脚本中使用的 `MiniCssExtractPlugin.loader` **一模一样**（必须是同一个包），否则会出错。

在你自定义 [Webpack] 配置前，请先查看 [Webpack] 官方文档和脚本中的[开发环境配置](https://github.com/uedlinker/uedlinker-scripts/blob/master/configs/webpack.dev.js)和[生产环境配置](https://github.com/uedlinker/uedlinker-scripts/blob/master/configs/webpack.prod.js)。

### 自定义 webpack-server 配置

在你的项目根目录下添加一个 `server.config.js` 文件就能够自定义 [webpack-server] 配置。与自定义 [Webpack] 一样，你可以导出一个对象或一个函数。当导出对象时，此脚本会合并你的自定义配置；当导出函数时，此脚本会把默认配置注入到你的函数中，并执行一次这个函数，使用函数返回的对象作为 [webpack-server] 的配置。下面我们以开启热更新信息提示功能为例说明（默认遇到警告或错误时才提示）：

```js
// server.config.js
module.exports = {
  hotClient: {
    logLevel: 'info',
  },
}
```

在你自定义 [webpack-server] 配置前，请先查看 [webpack-server] 的配置文档和脚本中的[默认 webpack-server 配置](https://github.com/uedlinker/uedlinker-scripts/blob/master/configs/server.config.js)。

### 自定义 Babel 配置

在你根目录下添加一个 `babel.config.js` 文件就能够自定义 [Babel] 配置。与自定义 [Webpack] 一样，你可以导出一个对象或一个函数。当导出对象时，此脚本会合并你的自定义配置；当导出函数时，此脚本会把默认配置注入到你的函数中，并执行一次这个函数，使用函数返回的对象作为 [Babel] 的配置。

在你自定义 [Babel] 配置前，请先查看 [Babel] 的配置文档和脚本中的[默认 Babel 配置](https://github.com/uedlinker/uedlinker-scripts/blob/master/configs/babel.config.js)。

## 问题

如果你遇到什么问题，可以在[这里](https://github.com/uedlinker/uedlinker-scripts/issues/new)提出你的问题，我会尽量解决。如果你能够提供解决方案或 PR，那就最好不过了。

## TODO

- [ ] 支持 `uedlinker-scripts test`
- [ ] 支持 `uedlinker-scripts eject`

[Flowtype]: https://flow.org/
[Babel]: https://babeljs.io/
[JSX]: https://jsx.github.io/
[React]: https://reactjs.org/
[Webpack]: https://webpack.js.org/
[cross-env]: https://www.npmjs.com/package/cross-env
[Create React App]: https://github.com/facebook/create-react-app
[webpack-server]: https://github.com/webpack-contrib/webpack-serve
[@uedlinker/scripts]: https://www.npmjs.com/package/@uedlinker/scripts
