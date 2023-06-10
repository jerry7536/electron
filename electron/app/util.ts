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
  return app.isPackaged
    ? readFileSync(join(getAppAsarPath(name), 'version'), 'utf-8').trim()
    : getElectronVersion()
}

export function requireNative<T>(packageName: string): T {
  const path = app.isPackaged
    ? join(app.getAppPath(), 'node_modules', packageName)
    : packageName
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(path)
}

export function getReleaseDnsPrefix() {
  const hub = 'https://github.com'
  return [
    { urlprefix: `https://gh.gh2233.ml/${hub}`, maintainer: '@X.I.U/XIU2' },
    { urlprefix: `https://ghproxy.com/${hub}`, maintainer: 'gh-proxy' },
    { urlprefix: `https://gh.ddlc.top/${hub}`, maintainer: '@mtr-static-official' },
    { urlprefix: `https://ghdl.feizhuqwq.cf/${hub}`, maintainer: 'feizhuqwq.com' },
    { urlprefix: `https://slink.ltd/${hub}`, maintainer: '知了小站' },
    { urlprefix: `https://git.xfj0.cn/${hub}`, maintainer: 'anonymous1' },
    { urlprefix: `https://gh.con.sh/${hub}`, maintainer: 'anonymous2' },
    { urlprefix: `https://ghps.cc/${hub}`, maintainer: 'anonymous3' },
    { urlprefix: 'https://cors.isteed.cc/github.com', maintainer: 'Lufs\'s' },
    { urlprefix: `https://hub.gitmirror.com/${hub}`, maintainer: 'GitMirror' },
    { urlprefix: `https://js.xxooo.ml/${hub}`, maintainer: '饭太硬' },
    { urlprefix: `https://proxy.freecdn.ml/?url=${hub}`, maintainer: 'anonymous4' },
    { urlprefix: 'https://download.njuu.cf', maintainer: 'LibraryCloud-njuu' },
    { urlprefix: 'https://download.yzuu.cf', maintainer: 'LibraryCloud-yzuu' },
    { urlprefix: 'https://download.nuaa.cf', maintainer: 'LibraryCloud-nuaa' },
  ]
}
