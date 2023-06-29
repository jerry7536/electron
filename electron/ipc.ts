import { mainSendOnceIpcFn, rendererSendOnceIpcFn } from 'typesafe-electron-ipc'

export const ipc = {
  msg: mainSendOnceIpcFn<string>(),
  check: rendererSendOnceIpcFn(),
  restore: rendererSendOnceIpcFn(),
}

export type IPC = typeof ipc
