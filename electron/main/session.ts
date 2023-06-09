import { session } from 'electron'

export function setupSession() {
  session.defaultSession.setProxy({
    mode: 'auto_detect',
  })
  session.defaultSession.webRequest.onHeadersReceived(
    { urls: ['https://*/*', 'http://*/*'] },
    (details, callback) => {
      let { responseHeaders, url } = details

      // Bypass CORS for github releases, for 3rd party plugins.
      const hasOrigin = Object.keys(responseHeaders).some(
        key => key.toLowerCase() === 'access-control-allow-origin',
      )
      if (!hasOrigin && (/^https?:\/\/[^\/]*(github)/.test(url))) {
        responseHeaders['Access-Control-Allow-Origin'] = ['*']
      }

      callback({ responseHeaders })
    })
}
