import { test, expect, mocks, hasBrazilianConnection, gotoHome } from "./fixtures.js";

test.describe("home", () => {
  test("shows the live, upcoming and recent matches from the mock", async ({ page }) => {
    await gotoHome(page);
    await expect(page).toHaveTitle("BRjogando");

    await expect(page.locator(".medium-card").first()).toContainText("NEM");
    await expect(page.locator(".big-card").first()).toContainText("LOUD");
    // On desktop the home page hides the first recent match (slice(1))
    const pastCards = page.locator(".v-card:has(> .title-card)");
    await expect(pastCards).toHaveCount(mocks.past.length - 1);
    await expect(pastCards.first()).toContainText("GRIN");
  });

  test("'Brazilians only' filter turns on and off", async ({ page }) => {
    await gotoHome(page);
    const button = page.locator(".filter-button");

    await button.click();
    await expect(button).toHaveText("All matches");
    await expect(page.locator(".medium-card"))
      .toHaveCount(mocks.running.filter(hasBrazilianConnection).length);
    await expect(page.locator(".medium-card").first()).toContainText("BST.A");
    await expect(page.locator(".big-card"))
      .toHaveCount(mocks.upcoming.filter(hasBrazilianConnection).length);
    await expect(page.locator(".big-card", { hasText: "G2" })).toHaveCount(0);

    await button.click();
    await expect(button).toHaveText("Brazilians only");
    await expect(page.locator(".medium-card")).toHaveCount(mocks.running.length);
  });

  test("live carousel moves with the arrow", async ({ page }) => {
    await gotoHome(page);
    const content = page.locator(".v-slide-group__content");
    const before = await content.evaluate((el) => el.style.transform);
    await page.locator(".v-slide-group__next").click();
    await expect.poll(() => content.evaluate((el) => el.style.transform)).not.toBe(before);
  });
});

test.describe("language", () => {
  const sectionTitles = (page) => page.locator(".container-title");

  test("starts in English", async ({ page }) => {
    await gotoHome(page);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(sectionTitles(page)).toHaveText(["Live matches", "Upcoming matches"]);
    await expect(page.locator(".last-matches")).toHaveText("Recent matches");
    await expect(page.locator(".filter-button")).toHaveText("Brazilians only");
    await expect(page.locator(".medium-card .live-badge").first()).toHaveText("Live");
    await expect(page.locator(".footer-creators")).toHaveText("BR Jogando © 2023. All rights reserved.");
    await expect(page.locator('meta[name="description"]'))
      .toHaveAttribute("content", "The games that matter, when they matter.");
    await expect(page.locator(".lang-switch")).toHaveText("PT");
  });

  test("ignores a Portuguese browser and still starts in English", async ({ browser }) => {
    const context = await browser.newContext({ locale: "pt-BR" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(sectionTitles(page).first()).toHaveText("Live matches");
    await context.close();
  });

  test("switches to Portuguese, keeps it after a reload and switches back", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".lang-switch").click();

    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(sectionTitles(page)).toHaveText(["Partidas ao vivo", "Próximas partidas"]);
    await expect(page.locator(".last-matches")).toHaveText("Últimas partidas");
    await expect(page.locator(".filter-button")).toHaveText("Apenas brasileiros");
    await expect(page.locator(".medium-card .live-badge").first()).toHaveText("Ao vivo");
    await expect(page.locator(".footer-infos-links")).toContainText("Política de Privacidade");
    await expect(page.locator('meta[name="description"]'))
      .toHaveAttribute("content", "Jogos que importam, na hora que importam.");
    await expect(page.locator(".lang-switch")).toHaveText("EN");

    await page.reload();
    await expect(sectionTitles(page).first()).toHaveText("Partidas ao vivo");

    await page.locator(".lang-switch").click();
    await expect(sectionTitles(page).first()).toHaveText("Live matches");
    await page.reload();
    await expect(sectionTitles(page).first()).toHaveText("Live matches");
  });

  test("dates follow the language: month/day in English, day/month in Portuguese", async ({ page }) => {
    await gotoHome(page);
    const match = mocks.upcoming.find((m) => m.name === "Quarterfinal 1: LOUD vs FURIA");
    // The page shows the date in the browser's time zone, the same one used here
    const parts = await page.evaluate((iso) => {
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, "0");
      return { dd: pad(d.getDate()), mm: pad(d.getMonth() + 1), time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
    }, match.begin_at);
    const card = page.locator(".big-card", { hasText: "LOUD" }).locator(".match-info-big");

    await expect(card).toContainText(`${parts.mm}/${parts.dd} ${parts.time}`);
    await page.locator(".lang-switch").click();
    await expect(card).toContainText(`${parts.dd}/${parts.mm} ${parts.time}`);
  });

  test("the language switch works on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator(".mobile-header .lang-switch").click();
    await expect(page.locator(".container-title").first()).toHaveText("Partidas ao vivo");
  });
});

test.describe("match modal", () => {
  test("opens a live match and closes on the X", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".medium-card", { hasText: "NEM" }).click();

    const modal = page.locator(".modal-card");
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("CIS LAN Championship");
    await expect(modal).toContainText("Team Nemesis");
    await expect(modal).toContainText("Virtus.pro");
    await expect(modal).toContainText("BO5");
    await expect(modal).toContainText("2x2");
    await expect(modal).toContainText("Team rosters");
    await expect(modal).toContainText("Relevant links");
    await expect(modal.locator(".game-icon-inline svg, svg.game-icon-inline").first()).toBeVisible();

    await modal.locator(".close-button").click();
    await expect(modal).toHaveCount(0);
  });

  test("opens an upcoming match and closes when clicking outside", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".big-card", { hasText: "LOUD" }).click();

    const modal = page.locator(".modal-card");
    await expect(modal).toContainText("LOUD");
    await expect(modal).toContainText("FURIA Esports");
    await expect(modal).toContainText('Search "LOUD" on Liquipedia');

    await page.locator(".modal-backdrop").click({ position: { x: 10, y: 10 } });
    await expect(modal).toHaveCount(0);
  });

  test("shows the modal in Portuguese", async ({ page }) => {
    await gotoHome(page);
    await page.locator(".lang-switch").click();
    await page.locator(".big-card", { hasText: "LOUD" }).click();

    const modal = page.locator(".modal-card");
    await expect(modal).toContainText("Integrantes do time");
    await expect(modal).toContainText("Links relevantes");
    await expect(modal).toContainText('Buscar "LOUD" na Liquipedia');
  });
});

test.describe("footer", () => {
  const links = [
    ["About", "/institutional/about"],
    ["Contact", "/institutional/contact"],
    ["Terms of Use", "/institutional/terms"],
    ["Games", "/institutional/games"],
    ["Profile", "/institutional/profile"],
    ["FAQ", "/institutional/questions"],
    ["Privacy Policy", "/institutional/privacy"],
  ];

  for (const [label, path] of links) {
    test(`'${label}' goes to ${path} and back to the home page`, async ({ page }) => {
      await gotoHome(page);
      await page.locator(".footer-infos-links").getByRole("link", { name: label, exact: true }).click();

      await expect(page).toHaveURL(path);
      await expect(page.locator("h1")).toHaveText(label);
      await expect(page.locator(".v-main, .v-application").first()).toContainText("Coming soon.");
      // Header and footer stay on the page
      await expect(page.locator(".header")).toBeVisible();
      await expect(page.locator(".footer-infos-links")).toBeVisible();

      await page.goBack();
      await expect(page).toHaveURL("/");
      await expect(page.locator(".medium-card")).toHaveCount(mocks.running.length);
    });
  }

  test("social media icons go to the info pages", async ({ page }) => {
    await gotoHome(page);
    const social = page.locator(".footer-infos-social-media a");
    await expect(social).toHaveCount(3);

    await social.nth(0).click();
    await expect(page).toHaveURL("/institutional/cronogram");
    await expect(page.locator("h1")).toHaveText("Schedule");
    await page.goBack();
    await social.nth(2).click();
    await expect(page).toHaveURL("/institutional/support");
    await expect(page.locator("h1")).toHaveText("Support");
  });

  test("the betting pages no longer exist", async ({ page }) => {
    await gotoHome(page);
    await expect(page.locator('a[href*="bet"]')).toHaveCount(0);
  });
});

test.describe("direct routes", () => {
  test("esport page shows the game from the URL", async ({ page }) => {
    await page.goto("/esports/Dota_2");
    await expect(page.locator("body")).toContainText("Dota_2");
    await expect(page.locator(".header")).toBeVisible();
  });

  test("info page opens straight from the URL, in the saved language", async ({ page }) => {
    await page.goto("/institutional/support");
    await expect(page.locator("h1")).toHaveText("Support");
    await page.locator(".lang-switch").click();
    await expect(page.locator("h1")).toHaveText("Suporte");
    await page.reload();
    await expect(page.locator("h1")).toHaveText("Suporte");
  });
});
