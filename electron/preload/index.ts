import { exposeIPC, generateTypesafeIPC } from 'typesafe-electron-ipc'
import { ipc } from '../ipc'
import { domReady, useLoading } from './useLoading'

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)

exposeIPC(generateTypesafeIPC(ipc, 'renderer'))
