import { defineVitestConfig } from "@nuxt/test-utils/config";

// Component tests always run in mock mode (same as `npm run dev:mock`)
process.env.MOCK_DATA = "true";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    testTimeout: 20_000,
    include: ["tests/components/**/*.spec.js"],
    setupFiles: ["tests/setup.js"],
    environmentOptions: {
      // Desktop screen: Vuetify treats anything below 1280px as mobile
      happyDom: { width: 1400, height: 1000 },
      nuxt: {
        domEnvironment: "happy-dom",
        overrides: {
          runtimeConfig: { public: { mockData: true } },
        },
      },
    },
  },
});
