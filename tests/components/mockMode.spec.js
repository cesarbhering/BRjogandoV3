import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useGamesStore } from "~/store/games";
import runningMock from "~/mocks/running.json";

describe("modo mock", () => {
  it("está ligado nos testes", () => {
    expect(useRuntimeConfig().public.mockData).toBe(true);
  });
});

describe("useLogos", () => {
  const { teamLogoThumb } = useLogos();

  it("transforma o logo no thumb_ do mesmo caminho", () => {
    expect(teamLogoThumb("/mocks/images/team/image/3288/600px_virtus.pro_2019.png", "RU"))
      .toBe("/mocks/images/team/image/3288/thumb_600px_virtus.pro_2019.png");
  });

  it("usa a bandeira local quando o time não tem logo", () => {
    expect(teamLogoThumb(null, "BR")).toBe("/mocks/flags/br.webp");
  });

  it("não retorna nada sem logo e sem país", () => {
    expect(teamLogoThumb(null, null)).toBeUndefined();
  });
});

describe("store de jogos no modo mock", () => {
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

  it("carrega as partidas ao vivo do mock", async () => {
    const store = useGamesStore();
    store.fetchRunningMatches();
    await waitForMatches(store, "runningMatches");
    expect(store.runningMatches).toHaveLength(runningMock.data.length);
    expect(store.runningMatches[0].name).toBe("Grand Final: NEM vs VP");
  });

  it("carrega as próximas partidas do mock", async () => {
    const store = useGamesStore();
    store.fetchUpcomingMatches();
    await waitForMatches(store, "upcomingMatches");
    expect(store.upcomingMatches).toHaveLength(50);
    expect(store.upcomingMatches.every((m) => m.status === "not_started")).toBe(true);
  });

  it("carrega as últimas partidas do mock (array puro)", async () => {
    const store = useGamesStore();
    store.fetchPastMatches();
    await waitForMatches(store, "pastMatches");
    expect(store.pastMatches).toHaveLength(5);
    expect(store.pastMatches.every((m) => m.status === "finished")).toBe(true);
  });

  it("troca os logos da PandaScore pelos arquivos locais", async () => {
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

  it("não faz nenhuma chamada de rede", async () => {
    const store = useGamesStore();
    store.fetchRunningMatches();
    await waitForMatches(store, "runningMatches");
    const match = store.runningMatches[0];

    await store.fetchSupabaseDataForMatch(match.id, "running", match.serie_id, "NEM,VP");
    store.fetchGameRosters(match, "running");
    store.fetchOdds1xBet("url", match.id, "running");

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
