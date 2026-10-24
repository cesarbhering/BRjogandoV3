import { defineConfig } from "@playwright/test";

// Os testes de navegação rodam contra o servidor em modo mock (`npm run dev:mock`)
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 120_000,
  // Em máquinas lentas (CI, Docker emulado) o dev server demora para compilar cada página:
  // mais tempo para os expects e um worker só, para não disputar CPU
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
