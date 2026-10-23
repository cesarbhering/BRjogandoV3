import { test as base, expect } from "@playwright/test";
import runningMock from "../../mocks/running.json" with { type: "json" };
import upcomingMock from "../../mocks/upcoming.json" with { type: "json" };
import pastMock from "../../mocks/past.json" with { type: "json" };

export const mocks = {
  running: runningMock.data,
  upcoming: upcomingMock.data,
  past: pastMock,
};

// Mesma regra do filtro "Apenas brasileiros" em pages/index.vue
export const hasBrazilianConnection = (match) =>
  match.opponents.some(({ opponent }) =>
    `${opponent.name} ${opponent.location || ""}`.toLowerCase().includes("br")
  );

/**
 * `page` que falha o teste se qualquer requisição sair do localhost:
 * no modo mock (`npm run dev:mock`) nada pode ir para a internet.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const external = [];
    page.on("request", (request) => {
      const { protocol, hostname } = new URL(request.url());
      if (protocol.startsWith("http") && !["localhost", "127.0.0.1"].includes(hostname)) {
        external.push(request.url());
      }
    });
    await use(page);
    expect(external, "requisições externas no modo mock").toEqual([]);
  },
});

/** Abre a home e espera as três listas do mock aparecerem. */
export const gotoHome = async (page) => {
  await page.goto("/");
  await expect(page.locator(".medium-card")).toHaveCount(mocks.running.length);
  await expect(page.locator(".big-card")).toHaveCount(mocks.upcoming.length);
};

/** Lê estilos computados de um elemento. */
export const styles = (locator, ...props) =>
  locator.evaluate(
    (el, props) => {
      const cs = getComputedStyle(el);
      return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)]));
    },
    props
  );

/** Espera os estilos computados ficarem iguais (as cores têm transição). */
export const expectStyles = (locator, expected) =>
  expect.poll(() => styles(locator, ...Object.keys(expected))).toEqual(expected);

export { expect };
