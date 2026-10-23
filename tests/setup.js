import { config } from "@vue/test-utils";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// O mountSuspended desta versão do @nuxt/test-utils só repassa o RouterLink como componente
// global, então os componentes do plugin do Vuetify não chegam no wrapper
config.global.components = { ...config.global.components, ...components };
config.global.directives = { ...config.global.directives, ...directives };
