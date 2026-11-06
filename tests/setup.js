import { config } from "@vue/test-utils";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// mountSuspended in this version of @nuxt/test-utils only passes RouterLink as a global
// component, so the Vuetify plugin components never reach the wrapper
config.global.components = { ...config.global.components, ...components };
config.global.directives = { ...config.global.directives, ...directives };

// The same goes for the i18n plugin: install the app's own instance (read at mount time,
// when the Nuxt app exists) so useI18n() and $t work in mounted components
config.global.plugins = [
  ...(config.global.plugins || []),
  { install: (app) => useNuxtApp().vueApp.__VUE_I18N__.install(app) },
];
