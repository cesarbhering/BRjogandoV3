import { describe, it, expect, afterEach } from "vitest";
import { h } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { VLayout } from "vuetify/components";
import AppFooter from "~/components/AppFooter.vue";

// v-footer needs a layout around it, like the page's v-app
const mountFooter = () => mountSuspended({ render: () => h(VLayout, () => h(AppFooter)) });

const footerLinks = (wrapper) =>
  Object.fromEntries(
    wrapper.findAll(".footer-infos-links a").map((a) => [a.text(), a.attributes("href")])
  );

describe("AppFooter", () => {
  afterEach(async () => {
    await useNuxtApp().$i18n.setLocale("en");
  });

  it("links to the info pages, in English by default", async () => {
    const wrapper = await mountFooter();
    expect(footerLinks(wrapper)).toEqual({
      About: "/institutional/about",
      Contact: "/institutional/contact",
      "Terms of Use": "/institutional/terms",
      Games: "/institutional/games",
      Profile: "/institutional/profile",
      FAQ: "/institutional/questions",
      "Privacy Policy": "/institutional/privacy",
    });
    expect(wrapper.find(".footer-creators").text()).toBe("BR Jogando © 2023. All rights reserved.");
  });

  it("shows the same links in Portuguese", async () => {
    await useNuxtApp().$i18n.setLocale("pt-BR");
    const wrapper = await mountFooter();
    expect(footerLinks(wrapper)).toEqual({
      Sobre: "/institutional/about",
      Contato: "/institutional/contact",
      "Termos de Uso": "/institutional/terms",
      Jogos: "/institutional/games",
      Perfil: "/institutional/profile",
      "Perguntas Frequentes": "/institutional/questions",
      "Política de Privacidade": "/institutional/privacy",
    });
    expect(wrapper.find(".footer-creators").text()).toBe("BR Jogando © 2023. Todos os direitos reservados.");
  });

  it("has no links to betting pages", async () => {
    const wrapper = await mountFooter();
    const hrefs = wrapper.findAll("a").map((a) => a.attributes("href"));
    expect(hrefs.some((href) => /bet/.test(href))).toBe(false);
  });
});
