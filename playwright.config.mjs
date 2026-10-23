import { defineConfig } from "@playwright/test";

// Os testes de navegação rodam contra o servidor em modo mock (`npm run dev:mock`)
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3000",
    channel: "chrome",
    viewport: { width: 1400, height: 1000 },
  },
  webServer: {
    command: "npm run dev:mock",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
