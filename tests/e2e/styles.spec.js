import { test, expect, gotoHome, styles, expectStyles, mocks } from "./fixtures.js";

const BLUE_FLAG = "rgb(0, 39, 118)";
const GREEN_FLAG = "rgb(0, 156, 59)";
const YELLOW_FLAG = "rgb(255, 223, 0)";
const WHITE = "rgb(255, 255, 255)";
const DEFAULT_TEXT = "rgba(0, 0, 0, 0.87)"; // cor padrão de texto do Vuetify

const enableDarkMode = async (page) => {
  await page.locator(".theme-switch input").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
};

test.describe("estilos no modo claro (desktop)", () => {
  test.beforeEach(async ({ page }) => {
    // Sem dark mode salvo e sem preferência do sistema
    await page.emulateMedia({ colorScheme: "light" });
    await gotoHome(page);
  });

  test("fonte Poppins carregada", async ({ page }) => {
    await expect.poll(() => page.evaluate(() => document.fonts.check("bold 16px Poppins"))).toBe(true);
    expect((await styles(page.locator(".container-title").first(), "font-family"))["font-family"])
      .toContain("Poppins");
  });

  test("header azul escuro com a linha verde e amarela", async ({ page }) => {
    const header = page.locator(".header");
    expect(await styles(header, "background-color", "height")).toEqual({
      "background-color": "rgb(4, 12, 45)",
      height: "80px",
    });
    const line = await styles(page.locator(".nation-colors-line"), "background-image", "height");
    expect(line.height).toBe("2px");
    expect(line["background-image"]).toBe(`linear-gradient(to right, ${YELLOW_FLAG}, ${GREEN_FLAG})`);
  });

  test("títulos das seções em azul da bandeira", async ({ page }) => {
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

  test("cartão ao vivo: tamanho, borda e cores", async ({ page }) => {
    const card = page.locator(".medium-card").first();
    const box = await card.boundingBox();
    expect(box.width).toBe(288);
    expect(box.height).toBe(211);
    expect((await styles(card, "border-radius"))["border-radius"]).toBe("8px");

    const acronym = await styles(card.locator(".acronym").first(), "color", "font-size", "font-weight");
    expect(acronym).toEqual({ color: DEFAULT_TEXT, "font-size": "25px", "font-weight": "700" });
    const score = await styles(card.locator(".score").first(), "color", "font-size");
    expect(score).toEqual({ color: BLUE_FLAG, "font-size": "20px" });
    await expect(card.locator(".live img")).toBeVisible();
  });

  test("linha do topo do cartão ao vivo muda com o jogo", async ({ page }) => {
    const line = (text) => page.locator(".medium-card", { hasText: text }).locator(".upper-line");
    expect(await styles(line("HULIGANI"), "background-color", "height")).toEqual({
      "background-color": GREEN_FLAG, // Dota 2
      height: "4px",
    });
    expect((await styles(line("Gen.G GC"), "background-color"))["background-color"])
      .toBe("rgb(4, 255, 99)"); // Valorant
    expect((await styles(line("NEM"), "background-color"))["background-color"])
      .toBe(BLUE_FLAG); // Counter-Strike cai no padrão
  });

  test("cartão de próxima partida: borda, altura e faixa de playoff", async ({ page }) => {
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

  test("cartão de última partida: tamanho e placar", async ({ page }) => {
    const card = page.locator(".v-card:has(> .title-card)").first();
    const box = await card.boundingBox();
    expect(box.width).toBe(250);
    expect(box.height).toBe(145);
    expect(await styles(card.locator(".score").first(), "color", "font-size"))
      .toEqual({ color: BLUE_FLAG, "font-size": "20px" });
    expect((await styles(card.locator("img").first(), "width")).width).toBe("24px");
  });

  test("logos e bandeiras carregam do /mocks e aparecem na tela", async ({ page }) => {
    // v-img só carrega quando aparece na tela: passa por todos os cartões
    for (const card of await page.locator(".big-card").all()) {
      await card.scrollIntoViewIfNeeded();
    }
    await page.waitForLoadState("networkidle");

    const images = page.locator(".medium-card img, .v-card:has(> .title-card) img, .big-card .team-logo img");
    const info = await images.evaluateAll((imgs) =>
      imgs
        .filter((img) => !img.src.includes("aovivo"))
        // v-img define o src como propriedade, não como atributo
        .map((img) => {
          const src = img.currentSrc || img.src || img.getAttribute("src") || "";
          return {
            src: src && new URL(src, location.href).pathname,
            ok: img.complete && img.naturalWidth > 0,
            card: img.closest(".v-card").innerText,
          };
        })
    );
    // 6 ao vivo + 4 últimas + 50 próximas, dois times cada
    expect(info.length).toBe((6 + 4 + 50) * 2);
    for (const { src, ok, card } of info) {
      if (!src) {
        // ENRAGE não tem logo nem país; o CardsSmall renderiza o <img> vazio
        expect(card, "imagem sem src").toContain("ENRAGE");
        continue;
      }
      expect(src, "logo fora do /mocks").toMatch(/^\/mocks\/(images|flags)\//);
      expect(ok, `imagem não carregou: ${src}`).toBe(true);
    }

    const logo = page.locator(".medium-card .team-logo img").first();
    const box = await logo.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.width).toBeLessThanOrEqual(36);
    expect(box.height).toBeLessThanOrEqual(41);
  });
});

test.describe("faixa de playoff (final-alert-big)", () => {
  // LOUD x FURIA começa 2026-10-23T21:00:00Z; o relógio fica 1h30 antes
  const NOW = new Date("2026-10-23T19:30:00Z");

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    // Relógio parado: a contagem só anda quando o teste mandar
    await page.clock.setFixedTime(NOW);
    await gotoHome(page);
  });

  test("mostra a contagem regressiva e atualiza", async ({ page }) => {
    const countdown = page.locator(".big-card", { hasText: "LOUD" }).locator(".special-match-countdown");
    await expect(countdown).toHaveText("01:30:00");
    await page.clock.setFixedTime(new Date(NOW.getTime() + 5000));
    await expect(countdown).toHaveText("01:29:55");
  });

  test("estilo da contagem: cinza, 17px, peso 900", async ({ page }) => {
    const countdown = page.locator(".big-card", { hasText: "LOUD" }).locator(".special-match-countdown");
    await expectStyles(countdown, {
      color: "rgb(102, 102, 102)",
      "font-size": "17px",
      "font-weight": "900",
    });
  });

  test("fica na base da imagem do jogo, na largura toda do cartão", async ({ page }) => {
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

  test("grande final aparece como 'Final'", async ({ page }) => {
    const card = page.locator(".big-card", { hasText: "CGN" });
    await expect(card.locator(".special-match-name")).toHaveText("Final");
    await expectStyles(card.locator(".final-alert-big"), { "background-color": YELLOW_FLAG });
  });

  test("só as partidas de playoff com 'final' no nome têm a faixa", async ({ page }) => {
    const expected = mocks.upcoming.filter((m) => m.name.includes("final")).length;
    await expect(page.locator(".big-card .final-alert-big")).toHaveCount(expected);
  });

  test("no dark mode vira um degradê escuro com texto branco", async ({ page }) => {
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

  test("troca as cores da página e dos cartões", async ({ page }) => {
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

  test("continua ligado depois de recarregar e desliga de novo", async ({ page }) => {
    await enableDarkMode(page);
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.locator(".theme-switch input").click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
    await expectStyles(page.locator(".container-title").first(), { color: BLUE_FLAG });
  });

  test("segue o tema do sistema quando não há escolha salva", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("estilos no mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator(".medium-card").first()).toBeVisible();
  });

  test("usa o header mobile", async ({ page }) => {
    await expect(page.locator(".mobile-header")).toBeVisible();
    await expect(page.locator(".v-toolbar.header:not(.mobile-header)")).toHaveCount(0);
  });

  test("cartão ao vivo encolhe para 180x120", async ({ page }) => {
    const box = await page.locator(".medium-card").first().boundingBox();
    expect(box.width).toBe(180);
    expect(box.height).toBe(120);
    const acronym = await styles(page.locator(".medium-card .acronym").first(), "font-size");
    expect(acronym["font-size"]).toBe("18px");
    await expect(page.locator(".medium-card .live")).toHaveCount(0);
  });

  test("mostra todas as últimas partidas no fim da página", async ({ page }) => {
    const pastCards = page.locator(".v-card:has(> .title-card)");
    await expect(pastCards).toHaveCount(5);
    expect((await styles(pastCards.first().locator(".score").first(), "font-size"))["font-size"])
      .toBe("14px");
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
