import { Buffer } from 'node:buffer'
import { createVerify } from 'node:crypto'
import { createGunzip } from 'node:zlib'
import { createReadStream, createWriteStream, existsSync } from 'node:fs'
import { rm, writeFile } from 'node:fs/promises'
import https from 'node:https'
import { EventEmitter } from 'node:events'
import { app } from 'electron'
import { name, repository } from '../../package.json'
import type { TypesafeEventEmitter } from './type'

type UpdateJSON = {
  signature: string
  version: string
  downloadUrl: string
  size: number
}

export type CheckResult = {
  success: 'success'
  fail: 'fail'
  unavailable: 'unavailable'
}
type CheckResultType = CheckResult[keyof CheckResult]
export type Updater = TypesafeEventEmitter<UpdateEvents>
export type UpdateEvents = {
  check: null
  checkResult: [data: CheckResultType, err?: Error]
  downloadStart: [size: number]
  downloading: [current: number]
  downloadEnd: [success: boolean]
  donwnloadError: [error: unknown]
}
export const productName = name

const updateJSONUrl = `${repository.replace('github.com', 'raw.githubusercontent.com')}/master/version.json`

console.log(`updateJSONUrl: ${updateJSONUrl}`)

export const updater = new EventEmitter() as Updater

export const SIGNATURE_PUB = `-----BEGIN RSA PUBLIC KEY-----
MIICCgKCAgEA21QMN0+Nh7HZr55noAgrCHOzEMAZq2nIJLYSZiNXHtAFNvTzPIMV
JkOfgdwNxuhEQVVhobyBBRKYVTcM73d+8TL0+1O3ykB70EnEnQ+hEVG36bbbT0JJ
nG7oIkHspdqFNc9vzSzpn5Hr/0QA4jN8kDmllsxautTf7RtBNA2VyegyEWZjMIQZ
EcDoI2Q4MTtyEkeVx/JP2do5U+KvwJ4gkvuB2Bs2dXCRA/4MGYp+mKj84OYFyaqG
taLV/F7+w9fpo0Ki1xI92HaO9XSP8qM/s8tuVRqvmyOM6kinjcNqoKRbY8aqad6S
YPmYHfdFy9nhd0EK+A+0Tu7c+RC6Rw/a3HZdFRpO0zjLV6jJx5HLbhE47e/wQCFq
Y0yWH5CyZvnT7ztIhx/rG8eUorG9LoGFdYA9mfUPErC9P6O789eH7MYlzhIngrqK
nS8ESxxTiwbotQPI1rV1KC3l1SraNzfSt1WWaofFd3/6YHvpXkISxtm8ZrG0mu5J
aCtWPO2XTTSPtQzu8smOtnbervl8VBtyN+7pyeKyrIgZiElku99eeSCPUMA4r2Dm
pVZZzK0QmmJ7G8QDwzftUlmdtazrRhhRwl3tRoQshgEPHUYBmxVwOwii1NTf1bQc
Au2nQ9DNQnGgRaTWj54d/xTa3Tc0pgb039sHWhvC+8JoyJlEPh8RRsUCAwEAAQ==
-----END RSA PUBLIC KEY-----
`

updater.on('check', async () => {
  try {
    const result = await checkUpdate()
    updater.emit('checkResult', result)
  } catch (error) {
    updater.emit('checkResult', 'fail', error)
  }
})

async function download<T>(
  url: string,
  format: 'json',
): Promise<T>
async function download(
  url: string,
  format: 'buffer',
): Promise<Buffer>
async function download<T>(
  url: string,
  format: 'json' | 'buffer',
): Promise<T | Buffer> {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36'

  return await new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (format === 'json') {
        let data = ''
        res.setEncoding('utf8')
        res.headers = {
          Accept: 'application/json',
          UserAgent: ua,
        }
        res.on('data', chunk => (data += chunk))
        res.on('end', () => {
          resolve(JSON.parse(data))
        })
      } else if (format === 'buffer') {
        let data = []
        res.headers = {
          Accept: 'application/octet-stream',
          UserAgent: ua,
        }
        res.on('data', (chunk) => {
          updater.emit('downloading', chunk.length)
          data.push(chunk)
        })
        res.on('end', () => {
          updater.emit('downloadEnd', true)
          resolve(Buffer.concat(data))
        })
      }
    }).on('error', (e) => {
      e && updater.emit('donwnloadError', e)
      reject(e)
    })
  })
}
async function extractFile(gzipFilePath: string) {
  if (!gzipFilePath.endsWith('.asar.gz') || !existsSync(gzipFilePath)) {
    return
  }
  gzipFilePath = gzipFilePath.replace('.asar.gz', '.tmp.gz')
  return new Promise((resolve, reject) => {
    const gunzip = createGunzip()
    const input = createReadStream(gzipFilePath)
    const outputFilePath = gzipFilePath.replace('.tmp.gz', '.asar')
    const output = createWriteStream(outputFilePath)

    input
      .pipe(gunzip)
      .pipe(output)
      .on('finish', async () => {
        await rm(gzipFilePath)
        resolve(outputFilePath)
      })
      .on('error', async (err) => {
        await rm(gzipFilePath)
        output.destroy(err)
        reject(err)
      })
  })
}

function verify(buffer: Buffer, signature: string): boolean {
  return createVerify('RSA-SHA256')
    .update(buffer)
    .verify(SIGNATURE_PUB, signature, 'base64')
}

function needUpdate(version: string) {
  const parseVersion = (version: string) => {
    const [major, minor, patch] = version.split('.')
    return ~~major * 100 + ~~minor * 10 + ~~patch
  }
  return app.isPackaged
    && parseVersion(app.getVersion()) < parseVersion(version)
}

export async function checkUpdate(): Promise<CheckResultType> {
  const gzipPath = `../${productName}.asar.gz`
  const tmpFile = gzipPath.replace('.asar.gz', '.tmp.gz')

  // remove temp file
  if (existsSync(tmpFile)) {
    await rm(tmpFile)
  }

  // fetch update json
  const json = await download<UpdateJSON>(updateJSONUrl, 'json')

  if (!json) {
    throw new Error('fetch update json failed')
  }

  const {
    downloadUrl,
    signature,
    version,
    size,
  } = json

  console.log(version, size, downloadUrl, signature)

  // if not need update, return
  if (!needUpdate(version)) {
    return 'unavailable'
  }

  updater.emit('downloadStart', size)
  // download update file buffer
  const buffer = await download(downloadUrl, 'buffer')

  // verify update file
  if (!verify(buffer, signature)) {
    throw new Error('file broken, invalid signature!')
  }

  // replace old file with new file
  await writeFile(gzipPath, buffer)
  await extractFile(gzipPath)

  return 'success'
}
