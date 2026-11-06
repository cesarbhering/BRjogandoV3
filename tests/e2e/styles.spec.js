import { test, expect, gotoHome, styles, expectStyles, mocks } from "./fixtures.js";

const BLUE_FLAG = "rgb(0, 39, 118)";
const GREEN_FLAG = "rgb(0, 156, 59)";
const YELLOW_FLAG = "rgb(255, 223, 0)";
const WHITE = "rgb(255, 255, 255)";
const DEFAULT_TEXT = "rgba(0, 0, 0, 0.87)"; // Vuetify's default text color

const enableDarkMode = async (page) => {
  await page.locator(".theme-switch input").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
};

test.describe("styles in light mode (desktop)", () => {
  test.beforeEach(async ({ page }) => {
    // No saved dark mode and no system preference
    await page.emulateMedia({ colorScheme: "light" });
    await gotoHome(page);
  });

  test("Poppins font is loaded", async ({ page }) => {
    await expect.poll(() => page.evaluate(() => document.fonts.check("bold 16px Poppins"))).toBe(true);
    expect((await styles(page.locator(".container-title").first(), "font-family"))["font-family"])
      .toContain("Poppins");
  });

  test("dark blue header with the green and yellow line", async ({ page }) => {
    const header = page.locator(".header");
    expect(await styles(header, "background-color", "height")).toEqual({
      "background-color": "rgb(4, 12, 45)",
      height: "80px",
    });
    const line = await styles(page.locator(".nation-colors-line"), "background-image", "height");
    expect(line.height).toBe("2px");
    expect(line["background-image"]).toBe(`linear-gradient(to right, ${YELLOW_FLAG}, ${GREEN_FLAG})`);
  });

  test("section titles in the flag blue", async ({ page }) => {
    for (const title of await page.locator(".container-title").all()) {
      expect(await styles(title, "color", "font-weight", "text-align")).toEqual({
        color: BLUE_FLAG,
        "font-weight": "900",
        "text-align": "center",
      });
    }
    expect((await styles(page.locator(".home"), "background-color"))["background-color"])
      .toBe("rgb(228, 231, 236)");
  });

  test("live card: size, border and colors", async ({ page }) => {
    const card = page.locator(".medium-card").first();
    const box = await card.boundingBox();
    expect(box.width).toBe(288);
    expect(box.height).toBe(211);
    expect((await styles(card, "border-radius"))["border-radius"]).toBe("8px");

    const acronym = await styles(card.locator(".acronym").first(), "color", "font-size", "font-weight");
    expect(acronym).toEqual({ color: DEFAULT_TEXT, "font-size": "25px", "font-weight": "700" });
    const score = await styles(card.locator(".score").first(), "color", "font-size");
    expect(score).toEqual({ color: BLUE_FLAG, "font-size": "20px" });
    const badge = card.locator(".live-badge");
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText("Live");
    expect((await styles(badge, "color"))["color"]).toBe("rgb(255, 0, 0)");
  });

  test("top line of the live card changes with the game", async ({ page }) => {
    const line = (text) => page.locator(".medium-card", { hasText: text }).locator(".upper-line");
    expect(await styles(line("HULIGANI"), "background-color", "height")).toEqual({
      "background-color": GREEN_FLAG, // Dota 2
      height: "4px",
    });
    expect((await styles(line("Gen.G GC"), "background-color"))["background-color"])
      .toBe("rgb(4, 255, 99)"); // Valorant
    expect((await styles(line("NEM"), "background-color"))["background-color"])
      .toBe(BLUE_FLAG); // Counter-Strike falls back to the default
  });

  test("upcoming match card: border, height and playoff banner", async ({ page }) => {
    const card = page.locator(".big-card", { hasText: "LOUD" });
    expect((await card.boundingBox()).height).toBe(280);
    expect((await styles(card, "border-radius"))["border-radius"]).toBe("8px");

    const alert = card.locator(".final-alert-big");
    expect((await styles(alert, "background-color"))["background-color"]).toBe(YELLOW_FLAG);
    expect(await styles(card.locator(".special-match-name"), "color", "font-size", "font-weight"))
      .toEqual({ color: WHITE, "font-size": "20px", "font-weight": "700" });

    await expect(page.locator(".big-card", { hasText: "G2" }).locator(".final-alert-big")).toHaveCount(0);
    await expect(card.locator(".game-image-big")).toHaveAttribute("alt", "Rainbow 6 Siege");
  });

  test("recent match card: size and score", async ({ page }) => {
    const card = page.locator(".v-card:has(> .title-card)").first();
    const box = await card.boundingBox();
    expect(box.width).toBe(250);
    expect(box.height).toBe(145);
    expect(await styles(card.locator(".score").first(), "color", "font-size"))
      .toEqual({ color: BLUE_FLAG, "font-size": "20px" });
    expect((await styles(card.locator("img").first(), "width")).width).toBe("24px");
  });

  test("logos and flags load from /mocks and show on screen", async ({ page }) => {
    // v-img only loads once it is on screen: scroll through every card
    for (const card of await page.locator(".big-card").all()) {
      await card.scrollIntoViewIfNeeded();
    }
    await page.waitForLoadState("networkidle");

    const images = page.locator(".medium-card img, .v-card:has(> .title-card) img, .big-card .team-logo img");
    const info = await images.evaluateAll((imgs) =>
      imgs
        // v-img sets src as a property, not as an attribute
        .map((img) => {
          const src = img.currentSrc || img.src || img.getAttribute("src") || "";
          return {
            src: src && new URL(src, location.href).pathname,
            ok: img.complete && img.naturalWidth > 0,
            card: img.closest(".v-card").innerText,
          };
        })
    );
    // 6 live + 4 recent + 50 upcoming, two teams each
    expect(info.length).toBe((6 + 4 + 50) * 2);
    for (const { src, ok, card } of info) {
      if (!src) {
        // ENRAGE has neither a logo nor a country; CardsSmall renders an empty <img>
        expect(card, "image without src").toContain("ENRAGE");
        continue;
      }
      expect(src, "logo outside /mocks").toMatch(/^\/mocks\/(images|flags)\//);
      expect(ok, `image did not load: ${src}`).toBe(true);
    }

    const logo = page.locator(".medium-card .team-logo img").first();
    const box = await logo.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.width).toBeLessThanOrEqual(36);
    expect(box.height).toBeLessThanOrEqual(41);
  });
});

test.describe("playoff banner (final-alert-big)", () => {
  // LOUD x FURIA starts at 2026-10-23T21:00:00Z; the clock is set 1h30 earlier
  const NOW = new Date("2026-10-23T19:30:00Z");

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    // Frozen clock: the countdown only moves when the test says so
    await page.clock.setFixedTime(NOW);
    await gotoHome(page);
  });

  test("shows the countdown and updates it", async ({ page }) => {
    const countdown = page.locator(".big-card", { hasText: "LOUD" }).locator(".special-match-countdown");
    await expect(countdown).toHaveText("01:30:00");
    await page.clock.setFixedTime(new Date(NOW.getTime() + 5000));
    await expect(countdown).toHaveText("01:29:55");
  });

  test("countdown style: gray, 17px, weight 900", async ({ page }) => {
    const countdown = page.locator(".big-card", { hasText: "LOUD" }).locator(".special-match-countdown");
    await expectStyles(countdown, {
      color: "rgb(102, 102, 102)",
      "font-size": "17px",
      "font-weight": "900",
    });
  });

  test("sits at the bottom of the game image, across the full card width", async ({ page }) => {
    const card = page.locator(".big-card", { hasText: "LOUD" });
    const alert = card.locator(".final-alert-big");
    const title = card.locator(".v-card-title");
    expect(await styles(alert, "position", "top", "display")).toEqual({
      position: "absolute",
      top: "104px",
      display: "flex",
    });
    const [alertBox, titleBox] = [await alert.boundingBox(), await title.boundingBox()];
    expect(alertBox.width).toBe(titleBox.width);
    expect(alertBox.y - titleBox.y).toBe(104);
  });

  test("grand final shows as 'Final'", async ({ page }) => {
    const card = page.locator(".big-card", { hasText: "CGN" });
    await expect(card.locator(".special-match-name")).toHaveText("Final");
    await expectStyles(card.locator(".final-alert-big"), { "background-color": YELLOW_FLAG });
  });

  test("only playoff matches with 'final' in the name have the banner", async ({ page }) => {
    const expected = mocks.upcoming.filter((m) => m.name.includes("final")).length;
    await expect(page.locator(".big-card .final-alert-big")).toHaveCount(expected);
  });

  test("in dark mode it turns into a dark gradient with white text", async ({ page }) => {
    await enableDarkMode(page);
    const card = page.locator(".big-card", { hasText: "LOUD" });
    await expectStyles(card.locator(".final-alert-big"), {
      "background-image": "linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%)",
    });
    await expectStyles(card.locator(".special-match-countdown"), { color: WHITE, "font-weight": "800" });
    await expectStyles(card.locator(".special-match-name"), { color: WHITE });
  });
});

test.describe("dark mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await gotoHome(page);
  });

  test("changes the colors of the page and the cards", async ({ page }) => {
    await enableDarkMode(page);

    await expectStyles(page.locator("body"), { "background-color": "rgb(10, 10, 10)" });
    await expectStyles(page.locator(".home"), { "background-color": "rgb(10, 10, 10)" });
    await expectStyles(page.locator(".container-title").first(), { color: WHITE });

    const card = page.locator(".medium-card").first();
    await expectStyles(card, {
      "background-color": "rgb(26, 26, 26)",
      "border-top-color": "rgb(51, 51, 51)",
    });
    await expectStyles(card.locator(".acronym").first(), { color: WHITE });
    await expectStyles(card.locator(".score").first(), { color: WHITE });
    await expectStyles(page.locator(".big-card").first(), { "background-color": "rgb(26, 26, 26)" });
  });

  test("stays on after a reload and turns off again", async ({ page }) => {
    await enableDarkMode(page);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.locator(".theme-switch input").click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
    await expectStyles(page.locator(".container-title").first(), { color: BLUE_FLAG });
  });

  test("follows the system theme when nothing is saved", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("styles on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator(".medium-card").first()).toBeVisible();
  });

  test("uses the mobile header", async ({ page }) => {
    await expect(page.locator(".mobile-header")).toBeVisible();
    await expect(page.locator(".v-toolbar.header:not(.mobile-header)")).toHaveCount(0);
  });

  test("live card shrinks to 180x120", async ({ page }) => {
    const box = await page.locator(".medium-card").first().boundingBox();
    expect(box.width).toBe(180);
    expect(box.height).toBe(120);
    const acronym = await styles(page.locator(".medium-card .acronym").first(), "font-size");
    expect(acronym["font-size"]).toBe("18px");
    await expect(page.locator(".medium-card .live")).toHaveCount(0);
  });

  test("shows every recent match at the end of the page", async ({ page }) => {
    const pastCards = page.locator(".v-card:has(> .title-card)");
    await expect(pastCards).toHaveCount(5);
    expect((await styles(pastCards.first().locator(".score").first(), "font-size"))["font-size"])
      .toBe("14px");
  });

  test("has no horizontal scroll", async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
