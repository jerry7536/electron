import { mainSendIpcFn, rendererSendIpcFn } from 'typesafe-electron-ipc'

export const ipc = {
  msg: mainSendIpcFn<string>(),
  check: rendererSendIpcFn(),
  restore: rendererSendIpcFn(),
}

export type IPC = typeof ipc
