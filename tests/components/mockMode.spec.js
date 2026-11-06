import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGamesStore } from "~/store/games";
import runningMock from "~/mocks/running.json";

describe("mock mode", () => {
  it("is on in the tests", () => {
    expect(useRuntimeConfig().public.mockData).toBe(true);
  });
});

describe("useLogos", () => {
  const { teamLogoThumb } = useLogos();

  it("turns the logo into the thumb_ file in the same folder", () => {
    expect(teamLogoThumb("/mocks/images/team/image/3288/600px_virtus.pro_2019.png", "RU"))
      .toBe("/mocks/images/team/image/3288/thumb_600px_virtus.pro_2019.png");
  });

  it("uses the local flag when the team has no logo", () => {
    expect(teamLogoThumb(null, "BR")).toBe("/mocks/flags/br.webp");
  });

  it("returns nothing without a logo or a country", () => {
    expect(teamLogoThumb(null, null)).toBeUndefined();
  });
});

describe("games store in mock mode", () => {
  let fetchSpy;

  beforeEach(() => {
    setActivePinia(createPinia());
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  const waitForMatches = (store, key) =>
    vi.waitFor(() => expect(store[key].length).toBeGreaterThan(0));

  it("loads the live matches from the mock", async () => {
    const store = useGamesStore();
    store.fetchRunningMatches();
    await waitForMatches(store, "runningMatches");
    expect(store.runningMatches).toHaveLength(runningMock.data.length);
    expect(store.runningMatches[0].name).toBe("Grand Final: NEM vs VP");
  });

  it("loads the upcoming matches from the mock", async () => {
    const store = useGamesStore();
    store.fetchUpcomingMatches();
    await waitForMatches(store, "upcomingMatches");
    expect(store.upcomingMatches).toHaveLength(50);
    expect(store.upcomingMatches.every((m) => m.status === "not_started")).toBe(true);
  });

  it("loads the recent matches from the mock (plain array)", async () => {
    const store = useGamesStore();
    store.fetchPastMatches();
    await waitForMatches(store, "pastMatches");
    expect(store.pastMatches).toHaveLength(5);
    expect(store.pastMatches.every((m) => m.status === "finished")).toBe(true);
  });

  it("replaces the PandaScore logos with local files", async () => {
    const store = useGamesStore();
    store.fetchRunningMatches();
    store.fetchUpcomingMatches();
    store.fetchPastMatches();
    await waitForMatches(store, "runningMatches");
    await waitForMatches(store, "upcomingMatches");
    await waitForMatches(store, "pastMatches");

    const all = [...store.runningMatches, ...store.upcomingMatches, ...store.pastMatches];
    expect(JSON.stringify(all)).not.toContain("cdn-api.pandascore.co");
    expect(all[0].opponents[0].opponent.image_url).toMatch(/^\/mocks\/images\//);
  });

  it("makes no network calls", async () => {
    const store = useGamesStore();
    store.fetchRunningMatches();
    await waitForMatches(store, "runningMatches");
    const match = store.runningMatches[0];

    store.fetchGameRosters(match, "running");

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
