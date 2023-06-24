import { loadIPC } from 'typesafe-electron-ipc/renderer'
import type { IPC } from '../../electron/ipc'

const { renderer } = loadIPC<IPC>()
renderer.test((_, data) => console.log(data))
