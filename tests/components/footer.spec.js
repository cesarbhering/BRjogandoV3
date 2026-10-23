import { describe, it, expect } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { VLayout } from "vuetify/components";
import AppFooter from "~/components/AppFooter.vue";

describe("AppFooter", () => {
  it("tem os links para as páginas institucionais", async () => {
    // O v-footer precisa de um layout em volta, como o v-app da página
    const wrapper = await mountSuspended({ render: () => h(VLayout, () => h(AppFooter)) });
    const links = Object.fromEntries(
      wrapper.findAll(".footer-infos-links a").map((a) => [a.text(), a.attributes("href")])
    );
    expect(links).toEqual({
      Sobre: "/institutional/about",
      Contato: "/institutional/contact",
      "Termo de Uso": "/institutional/terms",
      Jogos: "/institutional/games",
      Apostas: "/institutional/bets",
      Perfil: "/institutional/profile",
      "Perguntas Frequentes": "/institutional/questions",
      "Política de Privacidade": "/institutional/privacy",
      "Casas de Apostas": "/institutional/betting",
    });
  });
});
