# uedlinker-scripts

React 单页应用构建脚本。

## 目标

分离构建工具和业务开发两者的工作。在众多的 React 单页应用中，都使用同一个构建脚本，方便构建工具的维护和升级。

React 生态中，我所知道的最出名的构建工具就是 [Create React App](https://github.com/facebook/create-react-app)，一套很优秀的工具。但在实际的业务开发中，还是没有满足需求，缺少很多自定义的功能。虽然可以通过 `eject` 来全面化的自定义，但在众多的应用中，都要 `eject`，在维护和升级时，就显得麻烦和繁琐。以下就是我使用此工具（不 `eject` 时）遇到的问题：

- 开发时重新构建速度慢（想其原因应该是在重新构建前检查了代码样式）；
- 其工具内依赖的 ESLint 版本太低，遇到自定义一套依赖高版本的 ESLint 的规范时，会起冲突；
- 无法自定义 Webpack、Babel 和 ESLint 配置；
- 暂时不支持 Sass 和 Less 等预处理器（看其代码中已经有 sass-loader 了，但迄今为止的发新版本中依然没有 sass-loader）；
- 很多依赖包的版本很低（Webpack 还是使用的 v3.x），且很多依赖包的版本都是固定的。

总之，此构建脚本就是在 [Create React App](https://github.com/facebook/create-react-app) 的基础上，解决以上问题，不 `eject` 时，还能满足开发需求。

## 命令

- [ ] 提供 `uedlinker-scripts dev` 开发命令；
- [ ] 提供 `uedlinker-scripts build` 打包命令；
- [ ] 提供 `uedlinker-scripts test` 测试命令；
- [ ] 提供 `uedlinker-scripts eject` 命令。
