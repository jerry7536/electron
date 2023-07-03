import { initApp } from 'electron-incremental-update'
import { getProductAsarPath } from 'electron-incremental-update/utils'
import { app } from 'electron'

// eslint-disable-next-line unicorn/prefer-node-protocol
import { cpSync } from 'original-fs'
import { name, repository } from '../package.json'

const SIGNATURE_CERT = `-----BEGIN CERTIFICATE-----
MIIDXDCCAkSgAwIBAgIJOucI2x6x0i0rMA0GCSqGSIb3DQEBCwUAMEoxITAfBgNV
BAMTGGVsZWN0cm9uLXZpdGUtbXVsdGktYXNhcjElMCMGA1UEChMcb3JnLmVsZWN0
cm9uLXZpdGUtbXVsdGktYXNhcjAeFw0yMzA3MDMxNDE0MzlaFw0yNDA3MDIxNDE0
MzlaMEoxITAfBgNVBAMTGGVsZWN0cm9uLXZpdGUtbXVsdGktYXNhcjElMCMGA1UE
ChMcb3JnLmVsZWN0cm9uLXZpdGUtbXVsdGktYXNhcjCCASIwDQYJKoZIhvcNAQEB
BQADggEPADCCAQoCggEBANwOZ7iPDA6ASuI3MKNmKbRaLD0dE8dCO6QbLk1b2Zht
iONigF4YP7+T7zFtOkJNcTKabksxh1qNAcNV87ZDoudIIyzVLgq2plM/df0JtsCr
Ius0lUHDZX6ogeE2+5d6l0lH9WvhVmSc0hy2jq7grItBe3bXeCK+gKQ6lx/oH1Mc
xHW/SNabQ6aiKKB2apeZiiyYcVyjG9V+JLDNlZvdLMHUZvs0RR3HZtRrAetyiTjP
1CvE+Z8ThU8d2CtSkNJavptTCeu4YctPb5BZHmhndFAGNS82CpdKqAlU4gViVE00
Na1Zj2bt/b77q9d+ctT0gz1NggBhiiWCWeox3v667QMCAwEAAaNFMEMwDAYDVR0T
BAUwAwEB/zALBgNVHQ8EBAMCAvQwJgYDVR0RBB8wHYYbaHR0cDovL2V4YW1wbGUu
b3JnL3dlYmlkI21lMA0GCSqGSIb3DQEBCwUAA4IBAQC0O62nHBUaiBBkvY8tOl2W
wrT6/3ecMSDvXpa1/oQPE6yizf86wb136H3KaybTp/1GLzQF+EpWpQ+4JStuFSyw
39sKZ8VyyKqLuJOaKqlJO05t8v/wClXMv6kXrjiZx5S0gU4iP21JW3PbBG/T38FI
rnmAjKubnJYMNuKmU8OpAQy3QLZ/2uXrsSYYQfxDHuEZpigvSdRf67ABtHnfHnH/
X6dBJ631YMvdiiyEs/5qwHYN22na7RgGr9C+cghlUh8hK34mnfXDxCNGaTMpm07R
3lbtDprmszCfJBGYvj33lL8ZDuUZqCYzow7g5TYC7UaeYXAoZJvmSjJxZoFoliVJ
-----END CERTIFICATE-----
`

app.isPackaged && cpSync(getProductAsarPath(name), `${getProductAsarPath(name)}.bak`)

initApp().setUpdater({ productName: name, SIGNATURE_CERT, repository, debug: true })

// const { cdnPrefix } = getGithubReleaseCdnGroup()[0]
// const updater = createUpdater({
//   SIGNATURE_CERT,
//   productName: name,
//   repository,
//   updateJsonURL: parseGithubCdnURL(repository, 'fastly.jsdelivr.net/gh', 'version.json'),
//   releaseAsarURL: parseGithubCdnURL(repository, cdnPrefix, `download/latest/${name}.asar.gz`),
//   debug: true,
// })
// initApp().setUpdater(updater)
