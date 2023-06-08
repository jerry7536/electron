/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'node:path'
import { app } from 'electron'
import { productName, updater } from './update'

const base = 'main/index.js'

const entry = app.isPackaged
  ? join(__dirname, `../${productName}.asar/${base}`)
  : `./dist-electron/${base}`

require(entry)(updater)
