import { getReleaseCdnLink, initApp } from 'electron-incremental-update'
import { name, repository } from '../package.json'

const SIGNATURE_PUB = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAoPQzPWFFt5aoNBZ87p76/qnPV4rfoNBX7FQ7J+h5OI5llCGsXxzU
Jt3oEIY1kb+kmf6iLWsFKHNVpb0x4NJB2mHN/F1WtZK/slqMsfGOq9dvdAZa+ZI1
FDXfBcHb0NauaVatOQejKttkamvwCBW79ZOhMOJLEdScHIedDoDrGBhpIeigP0vA
0NkHzkG3FI3V/JxD21QXQmBwrTbe0w7hs2KHAaDAsKfFRyBMMbjss4Rgzo+QGW1s
7bVgLryMlVIRxQHPK5JbzbKuHQr/FQ03mRqaHccml5AT7jeynMSLtosA6cFn6fyF
fLBusN8h1CaLDWNjZ0B3yEuwq8aOLQCGXQIDAQAB
-----END RSA PUBLIC KEY-----
`
const { url } = getReleaseCdnLink(`${repository}/download/latest/${name}.asar.gz`)[0]
initApp(name, {
  SIGNATURE_PUB,
  repository,
  updateJsonURL: `https://cdn.jsdelivr.net/gh/${repository.replace('https://github.com', '')}/version.json`,
  releaseAsarURL: url,
})
