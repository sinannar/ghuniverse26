import { defineConfig } from '@playwright/test';

const basePath = `${(process.env.ASTRO_BASE || '/').replace(/\/$/, '')}/`;
const devURL = `http://127.0.0.1:4323${basePath}`;

export default defineConfig({
  testDir: './tests/dev',
  use: {
    baseURL: devURL,
    viewport: { width: 1440, height: 900 },
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4323',
    url: devURL,
    reuseExistingServer: false,
  },
});
