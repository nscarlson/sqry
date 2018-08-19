// @flow

import { app, BrowserWindow, Menu, screen } from 'electron'

import menu from 'main/menu'
import { i } from 'helpers/staticPath'

import { terminateAllTheThings } from './terminator'

// necessary to prevent win from being garbage collected
let mainWindow = null

const isSecondInstance = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (isSecondInstance) {
  app.quit()
}

export const getMainWindow = () => mainWindow

const { UPGRADE_EXTENSIONS, ELECTRON_WEBPACK_WDS_PORT, DEV_TOOLS, DEV_TOOLS_MODE } = process.env

// context menu - see #978
require('electron-context-menu')({
  showInspectElement: __DEV__ || DEV_TOOLS,
  showCopyImageAddress: false,
  labels: {
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    copyLink: 'Copy Link',
    inspect: 'Inspect element',
  },
})

const getWindowPosition = (height, width, display = screen.getPrimaryDisplay()) => {
  const { bounds } = display

  return {
    x: Math.ceil(bounds.x + (bounds.width - width) / 2),
    y: Math.ceil(bounds.y + (bounds.height - height) / 2),
  }
}

const getDefaultUrl = () =>
  __DEV__ ? `http://localhost:${ELECTRON_WEBPACK_WDS_PORT || ''}` : `file://${__dirname}/index.html`

const defaultWindowOptions = {
  // see https://github.com/electron-userland/electron-builder/issues/2269
  icon: i('browser-window-icon-512x512.png'),
  webPreferences: {
    // Enable, among other things, the ResizeObserver
    experimentalFeatures: true,
  },
}

async function createMainWindow() {
  const width =  500
  const height = 500

  const windowOptions = {
    ...defaultWindowOptions,
    ...(getWindowPosition(height, width)),
    ...(process.platform === 'darwin'
      ? {
          titleBarStyle: 'hiddenInset',
        }
      : {}),
    autoHideMenuBar: true,
    height,
    minHeight: 500,
    minWidth: 500,
    show: false,
    transparent: true,
    width,
  }

  const window = new BrowserWindow(windowOptions)

  window.name = 'MainWindow'

  const url = getDefaultUrl()

  window.loadURL(url)

  window.on('close', terminateAllTheThings)

  window.on('ready-to-show', () => {
    window.show()
    setImmediate(() => {
      window.focus()
    })
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show()
  }
})

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']
  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log) // eslint-disable-line
}

app.setAsDefaultProtocolClient('ledgerhq')

app.on('ready', async () => {
  if (__DEV__) {
    await installExtensions()
  }

  Menu.setApplicationMenu(menu)

  mainWindow = await createMainWindow()
})
