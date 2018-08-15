// @flow

import React from 'react'
import { remote, webFrame } from 'electron'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from 'components/App'

import 'styles/global'

const rootNode = document.getElementById('app')

async function init() {

  // FIXME IMO init() really should only be for window. any other case is a hack!
  const isMainWindow = remote.getCurrentWindow().name === 'MainWindow'

  r(<App />)

  // Only init events on MainWindow
  if (isMainWindow) {
    webFrame.setVisualZoomLevelLimits(1, 1)
  }

  document.addEventListener(
    'dragover',
    (event: Event) => {
      event.preventDefault()
      return false
    },
    false,
  )

  document.addEventListener(
    'drop',
    (event: Event) => {
      event.preventDefault()
      return false
    },
    false,
  )
}

function r(Comp) {
  if (rootNode) {
    render(<AppContainer>{Comp}</AppContainer>, rootNode)
  }
}

init().catch(e => {
    console.error(e)
})
