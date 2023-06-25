import { loadIPC } from 'typesafe-electron-ipc/renderer'
import type { IPC } from '../../electron/ipc'

export const { renderer: rendererFn } = loadIPC<IPC>()
