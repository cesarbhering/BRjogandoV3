import { defineConfig } from "@playwright/test";

// The browser tests run against the dev server in mock mode (`npm run dev:mock`)
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 120_000,
  // On slow machines (CI, emulated Docker) the dev server takes a while to compile each page:
  // give the expects more time and use a single worker so they do not compete for CPU
  expect: { timeout: 30_000 },
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: "http://localhost:3000",
    channel: "chrome",
    viewport: { width: 1400, height: 1000 },
  },
  webServer: {
    command: "npm run dev:mock",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
