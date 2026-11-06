export const LOCALE_STORAGE_KEY = "brjogando-locale";

/**
 * Toggles between English (default) and Brazilian Portuguese and remembers the choice.
 */
export const useLocaleSwitch = () => {
  const { locale, setLocale } = useI18n();

  const nextLocale = computed(() => (locale.value === "en" ? "pt-BR" : "en"));
  const nextLocaleLabel = computed(() => (nextLocale.value === "en" ? "EN" : "PT"));

  const toggleLocale = async () => {
    const code = nextLocale.value;
    await setLocale(code);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code);
    } catch (e) {
      // Storage can be unavailable (private mode); the switch still works for this visit.
    }
  };

  return { locale, nextLocaleLabel, toggleLocale };
};
