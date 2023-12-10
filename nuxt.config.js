// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false, 

  runtimeConfig: {
    public: {
      gtagId: 'G-24H7QSPX4G',
    }
  },

  modules: ["@nuxtjs/i18n", "@pinia/nuxt"],

  i18n: {
    vueI18n: "./i18n.config.js",
  },

  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "@/assets/style/main.scss",
  ],

  build: {
    transpile: ["vuetify"],
  },
  
  alias: {
    // Resolve bug do pinia ao ser instalado pelo NPM (Cannot start nuxt:  Cannot find module 'pinia/dist/pinia.mjs')
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  }

});
