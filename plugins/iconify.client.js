import { Icon, addCollection } from '@iconify/vue'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component('Icon', Icon)

  // No modo mock os ícones vêm de mocks/icons.json, sem chamar a API do Iconify
  if (useRuntimeConfig().public.mockData) {
    const collections = (await import('~/mocks/icons.json')).default
    collections.forEach((collection) => addCollection(collection))
  }
})