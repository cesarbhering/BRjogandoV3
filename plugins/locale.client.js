import { LOCALE_STORAGE_KEY } from "~/composables/useLocaleSwitch";

// Restores the language the visitor picked before. English stays the default.
export default defineNuxtPlugin(async (nuxtApp) => {
  let saved = null;
  try {
    saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch (e) {
    return;
  }
  const i18n = nuxtApp.$i18n;
  if (saved && saved !== i18n.locale.value && i18n.localeCodes.value.includes(saved)) {
    await i18n.setLocale(saved);
  }
});
