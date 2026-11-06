import { test as base, expect } from "@playwright/test";
import runningMock from "../../mocks/running.json" with { type: "json" };
import upcomingMock from "../../mocks/upcoming.json" with { type: "json" };
import pastMock from "../../mocks/past.json" with { type: "json" };

export const mocks = {
  running: runningMock.data,
  upcoming: upcomingMock.data,
  past: pastMock,
};

// Same rule as the "Brazilians only" filter in pages/index.vue
export const hasBrazilianConnection = (match) =>
  match.opponents.some(({ opponent }) =>
    `${opponent.name} ${opponent.location || ""}`.toLowerCase().includes("br")
  );

/**
 * `page` that fails the test if any request leaves localhost:
 * in mock mode (`npm run dev:mock`) nothing may go to the internet.
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
    expect(external, "external requests in mock mode").toEqual([]);
  },
});

/** Opens the home page and waits for the three mock lists to show up. */
export const gotoHome = async (page) => {
  await page.goto("/");
  await expect(page.locator(".medium-card")).toHaveCount(mocks.running.length);
  await expect(page.locator(".big-card")).toHaveCount(mocks.upcoming.length);
};

/** Reads the computed styles of an element. */
export const styles = (locator, ...props) =>
  locator.evaluate(
    (el, props) => {
      const cs = getComputedStyle(el);
      return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)]));
    },
    props
  );

/** Waits for the computed styles to match (the colors have a transition). */
export const expectStyles = (locator, expected) =>
  expect.poll(() => styles(locator, ...Object.keys(expected))).toEqual(expected);

export { expect };
