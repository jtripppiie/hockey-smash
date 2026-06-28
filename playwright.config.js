const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:8090',
  },
  webServer: {
    command: 'python3 -m http.server 8090',
    url: 'http://127.0.0.1:8090',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
});
