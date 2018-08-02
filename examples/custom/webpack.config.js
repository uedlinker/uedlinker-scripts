const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const env = process.env.NODE_ENV
const isProd = env === 'production'

// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.less$/,
//         use: [
//           isProd ? MiniCssExtractPlugin.loader : 'style-loader',
//           'css-loader',
//           'less-loader'
//         ],
//       },
//     ]
//   }
// }

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
