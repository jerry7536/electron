import { dialog } from 'electron'
import type { Updater } from 'electron-incremental-update'
import { getEntryVersion, getProductAsarPath, getProductVersion } from 'electron-incremental-update'
import { main } from '.'

export function setupUpdater(name: string, updater: Updater) {
  console.log('\ncurrent:')
  console.log(`\tasar path: ${getProductAsarPath(name)}`)
  console.log(`\tentry:     ${getEntryVersion()}`)
  console.log(`\tapp:       ${getProductVersion(name)}`)
  let size = 0
  updater.on('downloading', (progress) => {
    console.log(`${(progress / size).toFixed(2)}%`)
  })
  updater.on('debug', data => console.log('[updater]:', data))
  main.check(async () => {
    const result = await updater.checkUpdate()
    if (result === undefined) {
      console.log('Update Unavailable')
    } else if (result instanceof Error) {
      console.error(result)
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
      console.log(await updater.downloadAndInstall())
    }
  })
}
