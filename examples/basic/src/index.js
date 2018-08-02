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

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept(['./App'], () => {
    const App = require('./App').default
    renderApp(App)
  })
}

if (process.env.NODE_ENV === 'production') {
  const OfflinePluginRuntime = require('offline-plugin/runtime').default
  OfflinePluginRuntime.install()
}
