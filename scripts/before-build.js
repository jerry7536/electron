const { existsSync } = require('node:fs')
const { readFile, writeFile } = require('node:fs/promises')
const { generateKeyPairSync } = require('node:crypto')
const { isCI } = require('ci-info')
const { build } = require('esbuild')

const privateKeyPath = 'scripts/private.pem'
const publicKeyPath = 'scripts/public.pem'

async function generateKey() {
  const pair = generateKeyPairSync('rsa', { modulusLength: 4096 })
  const privateKey = pair.privateKey.export({ type: 'pkcs1', format: 'pem' })
  const publicKey = pair.publicKey.export({ type: 'pkcs1', format: 'pem' })

  await writeFile(privateKeyPath, privateKey)
  await writeFile(publicKeyPath, publicKey)
}

async function writePublicKeyToMain(updatePath) {
  const file = await readFile(updatePath, 'utf-8')
  const key = await readFile(publicKeyPath, 'utf-8')
  const replaced = file.replace(
    /const SIGNATURE_PUB = ['`][\s\S]*?['`]/,
    `const SIGNATURE_PUB = \`${key}\``,
  )
  await writeFile(updatePath, replaced)
}

(async () => {
  if (!isCI) {
    !existsSync(privateKeyPath) && await generateKey()
    await writePublicKeyToMain('electron/app/update.ts')
  }
  await build({
    entryPoints: ['electron/app/index.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'app.js',
    external: ['electron'],
  })
})()
