import { defineConfig } from '@playwright/test';

const basePath = `${(process.env.ASTRO_BASE || '/').replace(/\/$/, '')}/`;
const previewURL = `http://127.0.0.1:4322${basePath}`;

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  use: {
    baseURL: previewURL,
    viewport: { width: 1440, height: 900 },
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4322',
    url: previewURL,
    reuseExistingServer: false,
  },
});
