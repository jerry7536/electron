import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { app } from 'electron'

export function getAppAsarPath(name: string) {
  return join(dirname(app.getAppPath()), `${name}.asar`)
}

export function getElectronVersion() {
  return app.getVersion()
}

export function getAppVersion(name: string) {
  return readFileSync(join(getAppAsarPath(name), 'version'), 'utf-8').trim()
}

export function requireNative<T>(packageName: string): T {
  const path = app.isPackaged
    ? join(app.getAppPath(), 'node_modules', packageName)
    : packageName
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(path)
}
