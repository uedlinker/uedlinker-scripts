import React, { Component } from 'react'

class App extends Component {
  state = { name: 'World' }

  render () {
    return (
      <h1>Hello { this.state.name }</h1>
    )
  }
}

export default App
