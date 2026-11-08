const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: { baseURL: 'http://127.0.0.1:3100', browserName: 'chromium', headless: true, viewport: { width: 1440, height: 1000 }, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: [
    { command: 'node tests/browser-api.cjs', url: 'http://127.0.0.1:5101/api/health', timeout: 120000, reuseExistingServer: false },
    { command: 'node frontend/node_modules/next/dist/bin/next dev frontend --webpack --hostname 127.0.0.1 --port 3100', url: 'http://127.0.0.1:3100', env: { API_URL: 'http://127.0.0.1:5101' }, timeout: 120000, reuseExistingServer: false }
  ]
});
