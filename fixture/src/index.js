import React from 'react'
import { render } from 'react-dom'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'

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

OfflinePluginRuntime.install()
