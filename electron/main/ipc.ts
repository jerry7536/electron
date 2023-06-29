import { generateTypesafeIPC } from 'typesafe-electron-ipc'
import { ipc } from '../ipc'

export const { main } = generateTypesafeIPC(ipc, 'main')
