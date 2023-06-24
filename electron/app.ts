import { initApp } from 'electron-incremental-update'
import { name, repository } from '../package.json'

const SIGNATURE_CERT = `-----BEGIN CERTIFICATE-----
MIIDkTCCAnkCEBduMyRPkEk8ruuxXhaj24MwDQYJKoZIhvcNAQELBQAwgYIxDjAM
BgNVBAYTBXpoLUNOMQswCQYDVQQIDAJ6ajELMAkGA1UEBwwCaHoxDTALBgNVBAoM
BHRlc3QxEjAQBgNVBAsMCXRlc3QgdW5pdDESMBAGA1UEAwwJdGVzdC50ZXN0MR8w
HQYJKoZIhvcNAQkBFhB0ZXN0QGV4YW1wbGUuY29tMCYYDzIwMjMwNjIxMTMzMzU5
WhgTMjAyNDA2MjAxMzMzNTkuOTgwWjCBgjEOMAwGA1UEBhMFemgtQ04xCzAJBgNV
BAgMAnpqMQswCQYDVQQHDAJoejENMAsGA1UECgwEdGVzdDESMBAGA1UECwwJdGVz
dCB1bml0MRIwEAYDVQQDDAl0ZXN0LnRlc3QxHzAdBgkqhkiG9w0BCQEWEHRlc3RA
ZXhhbXBsZS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDrcElv
PE6ym94cAqIPYylyPRGzwmqA7Oku5IGgdJ+FXNxSsD+tVtSJ6SJcbp/DR/TuYLKL
Bb7eVlPZHa2bFlFzoKufDJ7Qosq0w1LJl9u9PeHrG6CD1R2DOfuBBWCAIRCab3Ax
ZE5tnCWycSd7Hz5MXQOMJ2n+p/7wQ15Jv/XrHoC8o/TATIc7MdqfkT12XgCtV/it
6t0OYpQYoXgr0uGjYneFvUY8Jf1jztELvKAy0GHPfjZwrHBYflmnJXxuQege6a+h
f7ATFzYnC8itTgZbAVMib+xCL76ipFTTfOscJ03K9X3/SWPbbTPtsK27VOPk//4f
bPBZ45UevRuLhqxpAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAFBbV3WMxoRiBEVa
36PY6w02zt3fFvNLiNuKFfaR4SjVCp3+e+USj46jE+02LJFAhKmpGUXI+Qtyn3S5
tMJWC08dM06grhSm8X228nYm001ZrKqnOFlk+HOyBbOfnkrXFEz079VCjOtYo2il
FUifvG4ehcWfxCPAIiO5djA49OIOvxaFjl/mIl4nVKounmjERguBEzRH0bboEXpm
CapMVP9fYpMBnZVndgPmfSymL4tqk99jP40upeWUxGbJ0INB0EU/l71oi61N7LcV
oROKxUZqSQpibVwh5nkSnVhGWQ7vMtpaxY71KnQ7URkJ2ABabY+kheLD3+zu7CZW
+mpJU1Y=
-----END CERTIFICATE-----`

initApp({ name }, { SIGNATURE_CERT, repository, debug: true })

// const { cdnPrefix } = getGithubReleaseCdnGroup()[0]
// const updater = createUpdater({
//   SIGNATURE_CERT,
//   productName: name,
//   repository,
//   updateJsonURL: parseGithubCdnURL(repository, 'fastly.jsdelivr.net/gh', 'version.json'),
//   releaseAsarURL: parseGithubCdnURL(repository, cdnPrefix, `download/latest/${name}.asar.gz`),
//   debug: true,
// })
// initApp({ name }).setUpdater(updater)
