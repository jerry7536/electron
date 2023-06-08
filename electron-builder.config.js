const { name } = require('./package.json')

const target = `${name}.asar`
const targetURL = `release/${target}`
/* eslint-disable no-template-curly-in-string */
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: 'YourAppID',
  productName: name,
  files: [
    'app.js',
    '!**/{.eslintignore,.eslintrc.cjs,.editorconfig,.prettierignore,.prettierrc.yaml,dev-app-update.yml,LICENSE,.nvmrc,.npmrc}',
    '!**/{tsconfig.json,tsconfig.node.json,tsconfig.web.json}',
    '!**/*debug*.*',
    '!**/*.{md,zip,map}',
    '!**/*.{c,cpp,h,hpp,cc,hh,cxx,hxx,gypi,gyp,sh}',
    '!**/.{github,vscode}',
    '!node_modules/**/better-sqlite3/deps/**',
  ],
  asarUnpack: [
    '**/*.{node,dll}',
  ],
  directories: {
    output: 'release',
  },
  extraResources: [
    { from: targetURL, to: target },
  ],
  win: {
    target: [
      // 'nsis',
      '7z',
    ],
    legalTrademarks: 'subframe7536',
  },
  // nsis: {
  //   artifactName: '${productName}-${version}-setup.${ext}',
  //   shortcutName: '${productName}',
  //   uninstallDisplayName: '${productName}',
  //   createDesktopShortcut: true,
  //   oneClick: true,
  // },
  mac: {
    entitlementsInherit: 'build/entitlements.mac.plist',
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64', 'universal'],
      },
    ],
    artifactName: '${productName}-${os}-${version}-${arch}.${ext}',
    category: 'public.app-category.music',
    darkModeSupport: true,
  },
  dmg: {
    artifactName: '${productName}-${version}.${ext}',
  },
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64'],
      },
      {
        target: 'tar.gz',
        arch: ['x64', 'arm64'],
      },
      {
        target: 'deb',
        arch: ['x64', 'armv7l', 'arm64'],
      },
      {
        target: 'rpm',
        arch: ['x64'],
      },
      {
        target: 'snap',
        arch: ['x64'],
      },
      {
        target: 'pacman',
        arch: ['x64'],
      },
    ],
    category: 'Music',
    maintainer: 'subframe7536',
  },
  appImage: {
    artifactName: '${productName}-${version}.${ext}',
  },
  beforePack: 'scripts/before-pack.js',
}
