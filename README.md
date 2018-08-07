# uedlinker-scripts

[React] 单页应用构建脚本。此脚本使用 [Webpack] 作为构建工具，使用 [Babel] 作为编译工具，使用 [webpack-server] 作为开发服务器，使用 [Jest] 作为测试工具。

## 目录

- [目标](#目标)
- [功能](#功能)
- [命令](#命令)
- [使用](#使用)
  - [目录结构](#目录结构)
  - [开启 HMR](#开启-hmr)
  - [开启离线缓存](#开启离线缓存)
  - [导入图片和字体文件](#导入图片和字体文件)
  - [测试](#测试)
- [自定义配置](#自定义配置)
  - [自定义环境变量](#自定义环境变量)
  - [自定义 Webpack 配置](#自定义-webpack-配置)
  - [自定义 webpack-server 配置](#自定义-webpack-server-配置)
  - [自定义 Babel 配置](#自定义-babel-配置)
  - [自定义 Jest 配置](#自定义-jest-配置)
- [问题](#问题)
- [TODO](#todo)

## 目标

- **零配置：** 此脚本提供[默认配置](https://github.com/uedlinker/uedlinker-scripts/tree/master/configs)，用户不需要编写任何其他的配置便可以启动项目进行开发。
- **自定义配置：** 在默认配置满足不了开发需求时，用户可以[自定义配置](#自定义配置)。
- **统一维护和升级：** 用户不需要专门维护一套自己的配置，每次升级只需要升级 [@uedlinker/scripts] 包便可。

## 功能

- 支持 ES 最新的语法（包括处于草案中的语法）。
- 支持 [JSX] 语法。
- 支持 [Flowtype] 类型检查。
- 支持代码分离、动态导入和懒加载。
- 支持 CSS 自动加前缀。
- 支持生产环境下压缩代码。
- 支持热更新（HMR）。
- 支持离线缓存（PWA）。
- 提供[默认 Polyfills](https://github.com/uedlinker/uedlinker-scripts/blob/master/configs/polyfills.js)。
- 提供一些便于使用的[命令](#命令)。
- 支持[自定义配置](#自定义配置)。

默认支持解析的文件：

- 脚本：`.js`、`.jsx`；
- 样式：`.css`、`.scss`；
- 图片：`.bmp`、`.png`、`.jpg`、`.jpeg`、`.gif`、`.svg`；
- 字体：`.eot`、`.ttf`、`.woff`、`woff2`。

还有许多文件不支持解析，但可以在[自定义 Webpack 配置](#自定义-webpack-配置)中添加文件解析规则。

**注意：** 此脚本在构建时没有使用 ESLint 检查代码。考虑到前端码农常用的几个编辑器大多都有 ESLint 插件提供实时提示功能，所以没有必要在构建时再次检查。

## 命令

- **`uedlinker-scripts dev`：** 启动开发环境。
- **`uedlinker-scripts build`：** 生产环境打包。
- **`uedlinker-scripts test`：** 使用 Jest 运行测试代码。
- **`uedlinker-scripts analyze`：** 可视化 Webpack 输出文件的大小。

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
    "build": "uedlinker-scripts build",
    "analyze": "uedlinker-scripts analyze"
  }
}
```

最后，执行命令：

```shell
# 启动开发环境
npm run dev

# 生产环境打包
npm run build

# 可视化 Webpack 输出文件的大小
npm run analyze
```

### 目录结构

你必须遵守以下目录约定才能实现此脚本的功能。

```
your-project-root
├── dist                  // Webpack 构建目标目录，`build` 时自动生成
├── src
│   └── index.js          // 入口文件，必须
├── static                // 静态文件目录，必须
├── babel.config.js        // 自定义 Babel 配置文件
├── package.json
├── server.config.js       // 自定义 webpack-server 配置文件
└── webpack.config.js      // 自定义 Webpack 配置文件
```

其中 `src/index.js` 和 `static` 是必须的。并且，你应该把所有的源文件（需要通过 Webpack 和 Babel 处理的文件）放在 `src` 目录中，把静态文件（直接复制到目标目录 `dist` 的文件）放到 `static` 目录中。

### 开启 HMR

虽然脚本默认支持 HMR，但也需要编写一些额外的代码。在入口文件中，你需要编写类似下面的代码：

```js
// src/index.js

import React from 'react'
import { render } from 'react-dom'

// 你需要新建一个 `src/App.jsx` 文件，并导出一个可用的 React 组件
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

与开启 HMR 一样，你需要在入口文件中编写下面的代码：

```js
// src/index.js

if (process.env.NODE_ENV === 'production') {
  const OfflinePluginRuntime = require('offline-plugin/runtime').default
  OfflinePluginRuntime.install()
}
```

[查看详情](https://github.com/uedlinker/uedlinker-scripts/blob/master/examples/basic/src/index.js)

### 导入图片和字体文件

在导入图片和字体文件时，在文件大小不超过 8kb 时，使用 [url-loader] 内联到 JS 代码中，超过 8kb 时，使用 [file-loader] 复制此文件到目标目录 `dist` 中。但你也可以通过导入选项选择导入方式：

```js
// 强制使用 url-loader 内联到 JS 代码中，注意后面的 `?inline` 选项
import myImg1 from './assets/images/example1.png?inline'

// 强制使用 file-loader 复制文件到 `dist` 目录中，注意后面的 `?external` 选项
import myImg2 from './assets/images/example2.png?external'
```

### 测试

此脚本集成了 [Enzyme] 测试工具，并配置好了适配器，所以你可以直接在测试代码中使用 Enzyme 的功能。

你也可以在 scripts 命令中使用 [Jest 的命令行参数](https://jestjs.io/docs/en/cli)。例如生成测试覆盖报告：

```json
{
  "scripts": {
    "coverage": "uedlinker-scripts test --coverage"
  }
}
```

在大多数情况下，建议通过配置文件[自定义 Jest 配置](#自定义-jest-配置)。

## 自定义配置

### 自定义环境变量

此脚本默认提供了 `NODE_ENV` 和 `BABEL_ENV` 两个环境命令，它们是只读的，不能够通过命令行修改这两个环境变量的值，只能在前端代码中读取到这两个变量，因为这两个变量分别决定了 Webpack 和 Babel 的运行模式，用户修改会导致它们的运行模式发生不可预测的变化。在执行不同命令时，它们的值也不一样，在 `uedlinker-scripts dev` 命令中，它们的值都是 `development`，在 `uedlinker-scripts build` 命令中，它们的值都是 `production`。

你可以在你的命令中自定义环境变量：`cross-env UEDLINKER_MY_ENV=awesome uedlinker-scripts dev`。其中使用了 [cross-env] 这个工具，它的作用是跨平台定义环境变量。这样，你可以在你的前端代码中通过 `process.env.UEDLINKER_MY_ENV` 获取到值 `awesome`。

```js
// package.json
{
  "scripts": {
    "dev": "cross-env UEDLINKER_MY_ENV=awesome uedlinker-scripts dev"
  }
}
```

```js
// src/index.js
const myEnv = process.env.UEDLINKER_MY_ENV
console.log(myEnv) // => 'awesome'
```

**注意：所有自定义环境变量都必须以 `UEDLINKER_` 开头。** 因为在 `process.env` 上还挂载了很多其他的环境变量，这样做防止用户在自定义时不小心修改了其他的环境变量的值。

### 自定义 Webpack 配置

在你的项目根目录下添加一个 `webpack.config.js` 文件就能够自定义 Webpack 配置。你可以导出一个对象或一个函数。当导出对象时，此脚本会合并你的自定义配置；当导出函数时，此脚本会把默认配置注入到你的函数中，并执行一次这个函数，使用函数返回的对象作为 Webpack 的配置。下面我们以添加一个解析 `.less` 的配置为例来说明：

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

在此脚本中，默认使用 `mini-css-extract-plugin` 作为提取 CSS 的工具。在这些依赖包中，你不需要再安装 `mini-css-extract-plugin`、`style-loader` 和 `css-loader` 包，因为脚本已经默认安装，并且你自定义配置中的 `MiniCssExtractPlugin.loader` 必须是和脚本中使用的 `MiniCssExtractPlugin.loader` **一模一样**（必须是同一个包），否则会出错。

在你自定义 Webpack 配置前，请先查看 [Webpack] 官方文档和此脚本中的[开发环境配置](https://github.com/uedlinker/uedlinker-scripts/blob/master/configs/webpack.dev.js)和[生产环境配置](https://github.com/uedlinker/uedlinker-scripts/blob/master/configs/webpack.prod.js)。

### 自定义 webpack-server 配置

在你的项目根目录下添加一个 `server.config.js` 文件就能够自定义 webpack-server 配置。与自定义 Webpack 配置一样，你可以导出一个对象或一个函数。当导出对象时，此脚本会合并你的自定义配置；当导出函数时，此脚本会把默认配置注入到你的函数中，并执行一次这个函数，使用函数返回的对象作为 webpack-server 的配置。下面我们以开启热更新信息提示功能为例说明（默认遇到警告或错误时才提示）：

```js
// server.config.js
module.exports = {
  hotClient: {
    logLevel: 'info',
  },
}
```

在你自定义 webpack-server 配置前，请先查看 [webpack-server] 的配置文档和脚本中的[默认 webpack-server 配置](https://github.com/uedlinker/uedlinker-scripts/blob/master/configs/server.config.js)。

### 自定义 Babel 配置

在你的项目根目录下添加一个 `babel.config.js` 文件就能够自定义 Babel 配置。与自定义 Webpack 配置一样，你可以导出一个对象或一个函数。当导出对象时，此脚本会合并你的自定义配置；当导出函数时，此脚本会把默认配置注入到你的函数中，并执行一次这个函数，使用函数返回的对象作为 Babel 的配置。

在你自定义 Babel 配置前，请先查看 [Babel] 的配置文档和脚本中的[默认 Babel 配置](https://github.com/uedlinker/uedlinker-scripts/blob/master/configs/babel.config.js)。

### 自定义 Jest 配置

在你的项目根目录下添加一个 `jest.config.js` 文件就能够自定义 Jest 配置。与自定义 Webpack 配置一样，你可以导出一个对象或一个函数。当导出对象时，此脚本会合并你的自定义配置；当导出函数时，此脚本会把默认配置注入到你的函数中，并执行一次这个函数，使用函数返回的对象作为 Jest 的配置。

在你自定义 Jest 配置前，请先查看 [Jest] 的配置文档和脚本中的[默认 Jest 配置](https://github.com/uedlinker/uedlinker-scripts/blob/master/configs/jest.config.js)。

## 问题

当你遇到问题时，可以在[这里](https://github.com/uedlinker/uedlinker-scripts/issues/new)提出你的问题，我会尽量解决。如果你能够提供解决方案或 PR，那就最好不过了。

## TODO

- [x] 支持 `uedlinker-scripts test`
- [ ] 支持 `uedlinker-scripts eject`
- [ ] 支持 `uedlinker.config.js` 配置文件

[Jest]: https://jestjs.io/
[Flowtype]: https://flow.org/
[Babel]: https://babeljs.io/
[JSX]: https://jsx.github.io/
[React]: https://reactjs.org/
[Webpack]: https://webpack.js.org/
[Enzyme]: https://github.com/airbnb/enzyme
[cross-env]: https://www.npmjs.com/package/cross-env
[url-loader]: https://github.com/webpack-contrib/url-loader
[file-loader]: https://github.com/webpack-contrib/file-loader
[Create React App]: https://github.com/facebook/create-react-app
[webpack-server]: https://github.com/webpack-contrib/webpack-serve
[@uedlinker/scripts]: https://www.npmjs.com/package/@uedlinker/scripts
