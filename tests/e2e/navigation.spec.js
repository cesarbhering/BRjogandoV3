import { test, expect, mocks, hasBrazilianConnection, gotoHome } from "./fixtures.js";

test.describe("home", () => {
  test("mostra as partidas ao vivo, próximas e últimas do mock", async ({ page }) => {
    await gotoHome(page);
    await expect(page).toHaveTitle("BRjogando");

    await expect(page.locator(".medium-card").first()).toContainText("NEM");
    await expect(page.locator(".big-card").first()).toContainText("LOUD");
    // No desktop a home esconde a primeira das últimas partidas (slice(1))
    const pastCards = page.locator(".v-card:has(> .title-card)");
    await expect(pastCards).toHaveCount(mocks.past.length - 1);
    await expect(pastCards.first()).toContainText("GRIN");
  });

  test("filtro 'Apenas brasileiros' liga e desliga", async ({ page }) => {
    await gotoHome(page);
    const button = page.locator(".filter-button");

    await button.click();
    await expect(button).toHaveText("Todas as partidas");
    await expect(page.locator(".medium-card"))
      .toHaveCount(mocks.running.filter(hasBrazilianConnection).length);
    await expect(page.locator(".medium-card").first()).toContainText("BST.A");
    await expect(page.locator(".big-card"))
      .toHaveCount(mocks.upcoming.filter(hasBrazilianConnection).length);
    await expect(page.locator(".big-card", { hasText: "G2" })).toHaveCount(0);

    await button.click();
    await expect(button).toHaveText("Apenas brasileiros");
    await expect(page.locator(".medium-card")).toHaveCount(mocks.running.length);
  });

  test("carrossel de ao vivo avança com a seta", async ({ page }) => {
    await gotoHome(page);
    const content = page.locator(".v-slide-group__content");
    const before = await content.evaluate((el) => el.style.transform);
    await page.locator(".v-slide-group__next").click();
    await expect.poll(() => content.evaluate((el) => el.style.transform)).not.toBe(before);
  });
});

test.describe("modal da partida", () => {
  test("abre a partida ao vivo e fecha no X", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".medium-card", { hasText: "NEM" }).click();

    const modal = page.locator(".modal-card");
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("CIS LAN Championship");
    await expect(modal).toContainText("Team Nemesis");
    await expect(modal).toContainText("Virtus.pro");
    await expect(modal).toContainText("BO5");
    await expect(modal).toContainText("2x2");
    await expect(modal.locator(".game-icon-inline svg, svg.game-icon-inline").first()).toBeVisible();

    await modal.locator(".close-button").click();
    await expect(modal).toHaveCount(0);
  });

  test("abre a próxima partida e fecha clicando fora", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".big-card", { hasText: "LOUD" }).click();

    const modal = page.locator(".modal-card");
    await expect(modal).toContainText("LOUD");
    await expect(modal).toContainText("FURIA Esports");
    await expect(modal).toContainText("Buscar na Liquipedia");

    await page.locator(".modal-backdrop").click({ position: { x: 10, y: 10 } });
    await expect(modal).toHaveCount(0);
  });
});

test.describe("rodapé", () => {
  const links = [
    ["Sobre", "/institutional/about", "sobre"],
    ["Contato", "/institutional/contact", "CRONOGRAMA"],
    ["Termo de Uso", "/institutional/terms", "CRONOGRAMA"],
    ["Jogos", "/institutional/games", "CRONOGRAMA"],
    ["Apostas", "/institutional/bets", "CRONOGRAMA"],
    ["Perfil", "/institutional/profile", "CRONOGRAMA"],
    ["Perguntas Frequentes", "/institutional/questions", "CRONOGRAMA"],
    ["Política de Privacidade", "/institutional/privacy", "CRONOGRAMA"],
    ["Casas de Apostas", "/institutional/betting", "CRONOGRAMA"],
  ];

  for (const [label, path, content] of links) {
    test(`'${label}' leva para ${path} e volta para a home`, async ({ page }) => {
      await gotoHome(page);
      await page.locator(".footer-infos-links").getByRole("link", { name: label, exact: true }).click();

      await expect(page).toHaveURL(path);
      await expect(page.locator(".v-main, .v-application").first()).toContainText(content);
      // Header e rodapé continuam na página
      await expect(page.locator(".header")).toBeVisible();
      await expect(page.locator(".footer-infos-links")).toBeVisible();

      await page.goBack();
      await expect(page).toHaveURL("/");
      await expect(page.locator(".medium-card")).toHaveCount(mocks.running.length);
    });
  }

  test("ícones das redes sociais levam para as páginas institucionais", async ({ page }) => {
    await gotoHome(page);
    const social = page.locator(".footer-infos-social-media a");
    await expect(social).toHaveCount(3);

    await social.nth(0).click();
    await expect(page).toHaveURL("/institutional/cronogram");
    await page.goBack();
    await social.nth(2).click();
    await expect(page).toHaveURL("/institutional/support");
    await expect(page.locator("body")).toContainText("SUPORTE");
  });
});

test.describe("rotas diretas", () => {
  test("página de esport mostra o jogo da URL", async ({ page }) => {
    await page.goto("/esports/Dota_2");
    await expect(page.locator("body")).toContainText("Dota_2");
    await expect(page.locator(".header")).toBeVisible();
  });

  test("página institucional abre direto pela URL", async ({ page }) => {
    await page.goto("/institutional/support");
    await expect(page.locator("body")).toContainText("SUPORTE");
  });
});
