import { defineVitestConfig } from "@nuxt/test-utils/config";

// Os testes de componente sempre rodam no modo mock (mesmo que `npm run dev:mock`)
process.env.MOCK_DATA = "true";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    testTimeout: 20_000,
    include: ["tests/components/**/*.spec.js"],
    setupFiles: ["tests/setup.js"],
    environmentOptions: {
      // Tela de desktop: o Vuetify considera mobile abaixo de 1280px
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
