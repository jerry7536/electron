const { constants, createSign } = require('node:crypto')
const { createReadStream, createWriteStream } = require('node:fs')
const { readFile, rename, writeFile } = require('node:fs/promises')
const zlib = require('node:zlib')
const asar = require('asar')
const { isCI } = require('ci-info')
const { name, version, repository } = require('../package.json')

function gzipFile(filePath) {
  return new Promise((resolve, reject) => {
    const gzip = zlib.createGzip()
    const input = createReadStream(filePath)
    const output = createWriteStream(`${filePath}.gz`)

    input
      .pipe(gzip)
      .pipe(output)
      .on('finish', () => resolve(null))
      .on('error', err => reject(err))
  })
}
function generateSignature(buffer, privateKey) {
  return createSign('RSA-SHA256')
    .update(buffer)
    .sign({
      key: privateKey,
      padding: constants.RSA_PKCS1_PADDING,
      saltLength: constants.RSA_PSS_SALTLEN_DIGEST,
    }, 'base64')
}
(async () => {
  const targetURL = `release/${name}.asar`
  const privateKeyPath = 'scripts/private.pem'

  await rename('dist', 'dist-electron/renderer')
  await writeFile('dist-electron/version', version)
  await asar.createPackage('dist-electron', targetURL)
  await gzipFile(targetURL)
  if (isCI) {
    return
  }
  const buffer = await readFile(`${targetURL}.gz`)
  const signature = generateSignature(buffer, await readFile(privateKeyPath, 'utf-8'))
  await writeFile('version.json', JSON.stringify({
    signature,
    version,
    size: buffer.length,
    downloadUrl: `${repository}/releases/download/v${version}/${name}.asar.gz`,
  }, null, 2))
})()
