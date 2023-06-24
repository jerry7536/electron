import { mainSendIpcFn } from 'typesafe-electron-ipc'

export const ipc = {
  test: mainSendIpcFn<string>(),
}

export type IPC = typeof ipc
