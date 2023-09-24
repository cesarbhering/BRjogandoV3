// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  head: {
    // Maps to the inner-text value of the <title> element.
    title: "nuxt-firebase",
  },

  modules: ["@nuxtjs/i18n"],

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
});
