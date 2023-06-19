import { getGithubReleaseCdnGroup, initApp, parseGithubCdnURL } from 'electron-incremental-update'
import { name, repository } from '../package.json'

const SIGNATURE_PUB = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEA2FgFFZsGcMFvN2bj8RUF2ZmYB5qS/Q8XYVLoDBUF8wVvvJfIin8e
rAm7pPvtx0zvbdy2+a1wtat7xLxnMC8vFcNidR1vIr8nnnQLJ68iATXh63BvYg1W
Kufp0k4I1L33jUUsOLwbVRhtRJoB2ZRaI8thMGx7ruLXsTISm1Gt6PUU6wYZI3l8
oatnNK/snq6RgGf46kDMrCGlsHqdbKUu2rrYEW8tEB8YapRsZT4jw4Ws6lSLZ0zG
fQvAjqylBOA0bJZM9FDtvyqifOmP0KMj9LwfxO61b9Zp7E4kfkDjyqpFAKTG3bgi
uNwg7AFB+WY7uPGbgvh0fOQjRKiOPxRCMwIDAQAB
-----END RSA PUBLIC KEY-----
`

const { cdnPrefix } = getGithubReleaseCdnGroup()[0]
initApp(name, {
  SIGNATURE_PUB,
  repository,
  updateJsonURL: parseGithubCdnURL(repository, 'cdn.jsdelivr.net/gh', 'version.json'),
  releaseAsarURL: parseGithubCdnURL(repository, cdnPrefix, `download/latest/${name}.asar.gz`),
  debug: true,
})
