import { Icon, addCollection } from '@iconify/vue'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component('Icon', Icon)

  // In mock mode the icons come from mocks/icons.json, without calling the Iconify API
  if (useRuntimeConfig().public.mockData) {
    const collections = (await import('~/mocks/icons.json')).default
    collections.forEach((collection) => addCollection(collection))
  }
})