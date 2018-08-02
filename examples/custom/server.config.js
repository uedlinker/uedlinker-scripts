// module.exports = {
//   hotClient: {
//     logLevel: 'info',
//   },
// }

module.exports = defaultConfig => {
  defaultConfig.hotClient.logLevel = 'info'
  return defaultConfig
}
