import { mainSendOnceIpcFn, rendererSendIpcFn } from 'typesafe-electron-ipc'

export const ipc = {
  msg: mainSendOnceIpcFn<string>(),
  check: rendererSendIpcFn(),
  restore: rendererSendIpcFn(),
}

export type IPC = typeof ipc
