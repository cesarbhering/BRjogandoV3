// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  runtimeConfig: {
    public: {
      gtagId: 'G-54X94ZFNWQ',
      // Use the JSON files in /mocks instead of PandaScore: `npm run dev --mockdata` or `npm run dev:mock`
      mockData: process.env.npm_config_mockdata === 'true' || process.env.MOCK_DATA === 'true',
    }
  },

  modules: ["@nuxtjs/i18n", "@pinia/nuxt"],

  i18n: {
    vueI18n: "./i18n.config.js",
    strategy: "no_prefix",
    defaultLocale: "en",
    locales: [
      { code: "en", iso: "en-US", name: "English" },
      { code: "pt-BR", iso: "pt-BR", name: "Português" },
    ],
    // English is always the default; the visitor's choice is saved by plugins/locale.client.js
    detectBrowserLanguage: false,
  },

  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "@fortawesome/fontawesome-free/css/all.css",
    "@/assets/style/main.scss",
  ],

  build: {
    transpile: ["vuetify"],
  },
  
  alias: {
    // Works around a Pinia bug when installed with npm (Cannot start nuxt: Cannot find module 'pinia/dist/pinia.mjs')
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  }

});
