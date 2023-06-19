import { release } from 'node:os'
import { join } from 'node:path'
import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron'
import type { Updater } from 'electron-incremental-update'
import { getAppAsarPath, getAppVersion, getEntryVersion } from 'electron-incremental-update'
import { name } from '../../package.json'
import { setupSession } from './session'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ROOT = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ROOT, 'renderer')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ROOT, '../public')
  : process.env.DIST

export default function (updater: Updater) {
  // Disable GPU Acceleration for Windows 7
  if (release().startsWith('6.1')) { app.disableHardwareAcceleration() }

  // Set application name for Windows 10+ notifications
  if (process.platform === 'win32') { app.setAppUserModelId(app.getName()) }

  if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
  }

  console.log('\ncurrent:')
  console.log(`\tasar path: ${getAppAsarPath(name)}`)
  console.log(`\tentry:     ${getEntryVersion()}`)
  console.log(`\tapp:       ${getAppVersion(name)}`)

  updater.checkUpdate()
  updater.on('checkResult', async (result, err) => {
    switch (result) {
      case 'success':
        await dialog.showMessageBox({
          type: 'info',
          buttons: ['Restart', 'Later'],
          message: 'Application successfully updated!',
        }).then(({ response }) => {
          if (response === 0) {
            app.relaunch()
            app.quit()
          }
        })
        break
      case 'unavailable':
        console.log('Update Unavailable')
        break
      case 'fail':
        console.error(err)
        break
    }
  })
  updater.on('downloadStart', console.log)
  updater.on('downloading', console.log)
  updater.on('downloadEnd', console.log)
  updater.on('donwnloadError', console.error)

  // Remove electron security warnings
  // This warning only shows in development mode
  // Read more on https://www.electronjs.org/docs/latest/tutorial/security
  // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

  let win: BrowserWindow | null = null
  // Here, you can also use other preload
  const preload = join(__dirname, '../preload/index.js')
  const url = process.env.VITE_DEV_SERVER_URL
  const indexHtml = join(process.env.DIST, 'index.html')

  async function createWindow() {
    win = new BrowserWindow({
      title: 'Main window',
      // icon: join(process.env.PUBLIC, 'favicon.ico'),
      webPreferences: {
        preload,
        // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
        // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // nodeIntegration: true,
      // contextIsolation: false,
      },
    })

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
      win.loadURL(url)
      // Open devTool if the app is not packaged
    } else {
      win.loadFile(indexHtml)
    }

    win.webContents.openDevTools()

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
      win?.webContents.send('test', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) { shell.openExternal(url) }
      return { action: 'deny' }
    })

    setupSession()

  // win.webContents.on('will-navigate', (event, url) => { }) #344
  }

  app.whenReady().then(createWindow).then(() => import('./db'))

  app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') { app.quit() }
  })

  app.on('second-instance', () => {
    if (win) {
    // Focus on the main window if the user tried to open another
      if (win.isMinimized()) { win.restore() }
      win.focus()
    }
  })

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
      allWindows[0].focus()
    } else {
      createWindow()
    }
  })

  // New window example arg: new windows url
  ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
      webPreferences: {
        preload,
        nodeIntegration: true,
        contextIsolation: false,
      },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
      childWindow.loadURL(`${url}#${arg}`)
    } else {
      childWindow.loadFile(indexHtml, { hash: arg })
    }
  })
}
