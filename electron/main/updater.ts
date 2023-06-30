import { existsSync } from 'node:fs'
import { BrowserWindow, dialog } from 'electron'
import type { Updater } from 'electron-incremental-update'
import { getEntryVersion, getProductAsarPath, getProductVersion, unzipFile } from 'electron-incremental-update/utils'
import { main } from './ipc'

export function setupUpdater(name: string, updater: Updater) {
  console.log('\ncurrent:')
  const sourcePath = getProductAsarPath(name)
  const backPath = `${sourcePath}.bak.gz`
  console.log(`\tasar path:         ${sourcePath}`)
  console.log(`\tentry version:     ${getEntryVersion()}`)
  console.log(`\tproduct version:   ${getProductVersion(name)}`)
  let size = 0
  updater.on('downloading', (progress) => {
    console.log(`${+((progress / size).toFixed(2)) * 100}%`)
  })
  updater.on('debug', data => console.log('[updater]:', data))
  main.check(async () => {
    const result = await updater.checkUpdate()
    if (result === undefined) {
      console.log('Update Unavailable')
      main.msg(BrowserWindow.getAllWindows()[0], 'Update Unavailable')
    } else if (result instanceof Error) {
      console.error(result)
      main.msg(BrowserWindow.getAllWindows()[0], 'Update Fail')
    } else {
      size = result.size
      console.log('new version: ', result.version)
      const { response } = await dialog.showMessageBox({
        type: 'info',
        buttons: ['Download', 'Later'],
        message: 'Application update available!',
      })
      if (response !== 0) {
        return
      }
      try {
        console.log('backup')
        // await zipFile(sourcePath, backPath)
      } catch (e) {
        console.error('error when backup', e)
      }
      console.log(await updater.downloadAndInstall())
    }
  })
  main.restore(async () => {
    console.log('restore')
    existsSync(backPath) && await unzipFile(backPath, sourcePath)
  })
}
