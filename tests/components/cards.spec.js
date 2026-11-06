import { describe, it, expect, vi, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import CardsSmall from "~/components/cards/Small.vue";
import CardsMedium from "~/components/cards/Medium.vue";
import CardsBig from "~/components/cards/Big.vue";
import runningMock from "~/mocks/running.json";
import upcomingMock from "~/mocks/upcoming.json";
import pastMock from "~/mocks/past.json";

// The match modal has its own browser tests; here we only care about the card
const mountCard = (component, matchInfo) =>
  mountSuspended(component, {
    props: { matchInfo },
    global: { stubs: { VDialog: true } },
  });

const byName = (list, name) => structuredClone(list.find((m) => m.name === name));
const running = (name) => byName(runningMock.data, name);
const upcoming = (name) => byName(upcomingMock.data, name);
const past = (name) => byName(pastMock, name);

const setLocale = (code) => useNuxtApp().$i18n.setLocale(code);

// English is the default; tests that switch to Portuguese put it back
afterEach(async () => {
  await setLocale("en");
});

describe("CardsSmall (recent matches)", () => {
  it("shows the game, the acronyms and the score", async () => {
    const wrapper = await mountCard(CardsSmall, past("Round 1: HLE vs TES"));
    expect(wrapper.text()).toContain("LoL");
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["HLE", "TES"]);
    expect(wrapper.findAll(".score").map((el) => el.text())).toEqual(["1", "0"]);
  });

  it("uses the team name when there is no acronym", async () => {
    const wrapper = await mountCard(CardsSmall, past("Quarterfinal match 1: GRIN vs Meant 2 Be"));
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["GRIN", "Meant 2 Be"]);
  });

  it("shows the flag when the team has no logo", async () => {
    const wrapper = await mountCard(CardsSmall, past("Quarterfinal match 1: GRIN vs Meant 2 Be"));
    const [grinLogo, meant2BeFlag] = wrapper.findAll("img").map((img) => img.attributes("src"));
    expect(grinLogo).toContain("thumb_214px_grin_esports_allmode.png");
    expect(meant2BeFlag).toBe("/mocks/flags/us.webp");
  });
});

describe("CardsMedium (live matches)", () => {
  it("shows the league, the series format and the score", async () => {
    const wrapper = await mountCard(CardsMedium, running("Grand Final: NEM vs VP"));
    expect(wrapper.text()).toContain("Counter-Strike");
    expect(wrapper.text()).toContain("CIS LAN Championship");
    expect(wrapper.text()).toContain("Bo5");
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["NEM", "VP"]);
    expect(wrapper.findAll(".score").map((el) => el.text())).toEqual(["2", "2"]);
  });

  it("cuts the name to 10 letters when there is no acronym", async () => {
    const wrapper = await mountCard(CardsMedium, running("Upper Bracket Quarterfinal Match 4: KRÜ vs Gen.G GC"));
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["KRÜ", "Gen.G GC"]);
  });

  it("shows no logo when the team has neither an image nor a country", async () => {
    const match = running("ICxI vs HULIGANI");
    match.opponents[1].opponent.image_url = null;
    match.opponents[1].opponent.location = "";
    const wrapper = await mountCard(CardsMedium, match);
    expect(wrapper.findAll(".team-logo")).toHaveLength(1);
  });

  it("shows the live badge", async () => {
    const wrapper = await mountCard(CardsMedium, running("Round 1: AL vs KC"));
    expect(wrapper.find(".live-badge").text()).toBe("Live");
  });

  it("shows the series format and the live badge in Portuguese", async () => {
    await setLocale("pt-BR");
    const wrapper = await mountCard(CardsMedium, running("Grand Final: NEM vs VP"));
    expect(wrapper.text()).toContain("Md5");
    expect(wrapper.find(".live-badge").text()).toBe("Ao vivo");
  });
});

describe("CardsMedium: top line color by game", () => {
  const upperLineColor = async (match) => {
    const wrapper = await mountCard(CardsMedium, match);
    // happy-dom keeps the hex value as written in the component
    return wrapper.find(".upper-line").element.style.background.toLowerCase();
  };

  it("Dota 2 uses the flag green", async () => {
    expect(await upperLineColor(running("ICxI vs HULIGANI"))).toBe("#009c3b");
  });

  it("Valorant uses the alternate green", async () => {
    expect(await upperLineColor(running("Upper Bracket Quarterfinal Match 4: KRÜ vs Gen.G GC")))
      .toBe("#04ff63");
  });

  // PandaScore sends "LoL" and "Counter-Strike", which fall back to the default blue
  it("LoL and Counter-Strike use the flag blue", async () => {
    expect(await upperLineColor(running("Round 1: AL vs KC"))).toBe("#002776");
    expect(await upperLineColor(running("Grand Final: NEM vs VP"))).toBe("#002776");
  });
});

describe("CardsBig (upcoming matches)", () => {
  it("shows the league and the team acronyms", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Round 1: G2 vs DK"));
    expect(wrapper.text()).toContain("Worlds");
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["G2", "DK"]);
    expect(wrapper.find(".game-image-big").attributes("alt")).toBe("LoL");
  });

  it("highlights quarterfinals", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Quarterfinal 1: LOUD vs FURIA"));
    expect(wrapper.find(".special-match-name").text()).toBe("Quarterfinal");
  });

  it("highlights quarterfinals in Portuguese", async () => {
    await setLocale("pt-BR");
    const wrapper = await mountCard(CardsBig, upcoming("Quarterfinal 1: LOUD vs FURIA"));
    expect(wrapper.find(".special-match-name").text()).toBe("Quartas de final");
  });

  it("highlights semifinals", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Upper Bracket Semifinal 2: paiN vs IMP"));
    expect(wrapper.find(".special-match-name").text()).toBe("Semifinal");
  });

  it("does not highlight a regular match", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Round 1: G2 vs DK"));
    expect(wrapper.find(".final-alert-big").exists()).toBe(false);
  });

  it("highlights the grand final as 'Final'", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Grand final: CGN vs SGE"));
    expect(wrapper.find(".final-alert-big").exists()).toBe(true);
    expect(wrapper.find(".special-match-name").text()).toBe("Final");
  });

  // BUG: the template checks `name.includes('final')` without ignoring case,
  // so "Upper/Lower Bracket Final" get no banner. Remove .fails once it is fixed.
  it.fails("highlights 'Upper Bracket Final' as 'Final'", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Upper Bracket Final: DNT vs Quintessence"));
    expect(wrapper.find(".special-match-name").text()).toBe("Final");
  });

  it("cuts the name to 6 letters when there is no acronym", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Noir Verse vs Ryvex"));
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["Noir V", "Ryvex"]);
  });
});

describe("CardsBig: playoff banner countdown", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const mountAt = async (match, msBeforeStart) => {
    // Only Date is faked: the card's setInterval runs on the real timer of the Nuxt environment
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(match.begin_at).getTime() - msBeforeStart);
    return mountCard(CardsBig, match);
  };

  it("shows the time left before the start as HH:MM:SS", async () => {
    const match = upcoming("Quarterfinal 1: LOUD vs FURIA");
    const wrapper = await mountAt(match, ((1 * 60 + 30) * 60 + 15) * 1000);
    expect(wrapper.find(".special-match-countdown").text()).toBe("01:30:15");
  });

  // The countdown ticking every second is tested in the browser (tests/e2e/styles.spec.js)

  // BUG: minutes and seconds come from a floating-point fraction of hours, so
  // some exact seconds round down. Remove .fails once it is fixed.
  it.fails("shows 01:01:01 with 1h 1min 1s to go", async () => {
    const wrapper = await mountAt(upcoming("Quarterfinal 1: LOUD vs FURIA"), 3661 * 1000);
    expect(wrapper.find(".special-match-countdown").text()).toBe("01:01:01");
  });

  it.fails("shows 00:00:59 with 59s to go", async () => {
    const wrapper = await mountAt(upcoming("Quarterfinal 1: LOUD vs FURIA"), 59 * 1000);
    expect(wrapper.find(".special-match-countdown").text()).toBe("00:00:59");
  });

  it("goes past 24 hours without turning into days", async () => {
    const match = upcoming("Grand final: CGN vs SGE");
    const wrapper = await mountAt(match, 26 * 60 * 60 * 1000);
    expect(wrapper.find(".special-match-countdown").text()).toBe("26:00:00");
  });
});
