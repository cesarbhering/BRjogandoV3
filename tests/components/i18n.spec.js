import { describe, it, expect, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import i18nConfig from "~/i18n.config.js";

const i18n = () => useNuxtApp().$i18n;

// Every key path in a messages object, e.g. "home.liveMatches"
const keyPaths = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([key, value]) =>
    typeof value === "object" ? keyPaths(value, `${prefix}${key}.`) : [`${prefix}${key}`]
  );

describe("i18n setup", () => {
  afterEach(async () => {
    await i18n().setLocale("en");
  });

  it("starts in English", () => {
    expect(i18n().locale.value).toBe("en");
    expect(i18n().t("home.liveMatches")).toBe("Live matches");
  });

  it("switches to Portuguese", async () => {
    await i18n().setLocale("pt-BR");
    expect(i18n().t("home.liveMatches")).toBe("Partidas ao vivo");
  });

  it("has the same keys in English and Portuguese", () => {
    const { en, "pt-BR": pt } = i18nConfig().messages;
    expect(keyPaths(pt).sort()).toEqual(keyPaths(en).sort());
  });
});

describe("useFormatDate", () => {
  afterEach(async () => {
    await i18n().setLocale("en");
  });

  // Built from the local time zone, like the cards show it
  const date = new Date("2026-10-23T21:05:00Z");
  const pad = (n) => String(n).padStart(2, "0");
  const [dd, mm, hh, min] = [date.getDate(), date.getMonth() + 1, date.getHours(), date.getMinutes()].map(pad);

  const format = async () => {
    let result;
    await mountSuspended({
      setup() {
        result = useFormatDate().formatDate(date.toISOString());
        return () => null;
      },
    });
    return result;
  };

  it("uses month/day in English", async () => {
    expect(await format()).toBe(`${mm}/${dd} ${hh}:${min}`);
  });

  it("uses day/month in Portuguese", async () => {
    await i18n().setLocale("pt-BR");
    expect(await format()).toBe(`${dd}/${mm} ${hh}:${min}`);
  });
});
