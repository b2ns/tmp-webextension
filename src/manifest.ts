import fs from 'fs-extra';
import type PkgType from '../package.json';
import { isDev, port, r } from '../scripts/utils';

export async function getManifest() {
  const pkg = (await fs.readJSON(r('package.json'))) as typeof PkgType;

  const manifest: any = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    background: {
      service_worker: 'dist/background/index.js',
    },
    host_permissions: ['<all_urls>'],
    permissions: ['storage', 'activeTab', 'scripting', 'tabs'],
    action: {
      default_popup: 'dist/popup/index.html',
      default_icon: {
        '16': 'assets/icon-512.png',
        '32': 'assets/icon-512.png',
        '48': 'assets/icon-512.png',
        '128': 'assets/icon-512.png',
      },
    },
    icons: {
      '16': 'assets/icon-512.png',
      '32': 'assets/icon-512.png',
      '48': 'assets/icon-512.png',
      '128': 'assets/icon-512.png',
    },
    // options_page: 'dist/options/index.html',
    options_ui: {
      page: 'dist/options/index.html',
      open_in_tab: false,
    },
    content_scripts: [
      {
        matches: ['http://*/*', 'https://*/*'],
        js: ['dist/contentScripts/index.global.js'],
      },
    ],
    web_accessible_resources: [
      {
        resources: ['dist/contentScripts/index.global.css'],
        matches: ['<all_urls>'],
      },
    ],
    content_security_policy: {
      extension_pages: isDev
        ? `script-src 'self' http://localhost:${port}; object-src 'self' http://localhost:${port}`
        : "script-src 'self'; object-src 'self'",
    },
  };

  return manifest;
}
