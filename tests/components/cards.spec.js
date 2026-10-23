import { describe, it, expect, vi, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import CardsSmall from "~/components/cards/Small.vue";
import CardsMedium from "~/components/cards/Medium.vue";
import CardsBig from "~/components/cards/Big.vue";
import runningMock from "~/mocks/running.json";
import upcomingMock from "~/mocks/upcoming.json";
import pastMock from "~/mocks/past.json";

// O modal tem testes próprios na navegação; aqui só interessa o cartão
const mountCard = (component, matchInfo) =>
  mountSuspended(component, {
    props: { matchInfo },
    global: { stubs: { VDialog: true } },
  });

const byName = (list, name) => structuredClone(list.find((m) => m.name === name));
const running = (name) => byName(runningMock.data, name);
const upcoming = (name) => byName(upcomingMock.data, name);
const past = (name) => byName(pastMock, name);

describe("CardsSmall (últimas partidas)", () => {
  it("mostra o jogo, as siglas e o placar", async () => {
    const wrapper = await mountCard(CardsSmall, past("Round 1: HLE vs TES"));
    expect(wrapper.text()).toContain("LoL");
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["HLE", "TES"]);
    expect(wrapper.findAll(".score").map((el) => el.text())).toEqual(["1", "0"]);
  });

  it("usa o nome do time quando não tem sigla", async () => {
    const wrapper = await mountCard(CardsSmall, past("Quarterfinal match 1: GRIN vs Meant 2 Be"));
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["GRIN", "Meant 2 Be"]);
  });

  it("mostra a bandeira quando o time não tem logo", async () => {
    const wrapper = await mountCard(CardsSmall, past("Quarterfinal match 1: GRIN vs Meant 2 Be"));
    const [grinLogo, meant2BeFlag] = wrapper.findAll("img").map((img) => img.attributes("src"));
    expect(grinLogo).toContain("thumb_214px_grin_esports_allmode.png");
    expect(meant2BeFlag).toBe("/mocks/flags/us.webp");
  });
});

describe("CardsMedium (partidas ao vivo)", () => {
  it("mostra liga, formato da série e placar", async () => {
    const wrapper = await mountCard(CardsMedium, running("Grand Final: NEM vs VP"));
    expect(wrapper.text()).toContain("Counter-Strike");
    expect(wrapper.text()).toContain("CIS LAN Championship");
    expect(wrapper.text()).toContain("Md 5");
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["NEM", "VP"]);
    expect(wrapper.findAll(".score").map((el) => el.text())).toEqual(["2", "2"]);
  });

  it("corta o nome em 10 letras quando não tem sigla", async () => {
    const wrapper = await mountCard(CardsMedium, running("Upper Bracket Quarterfinal Match 4: KRÜ vs Gen.G GC"));
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["KRÜ", "Gen.G GC"]);
  });

  it("não mostra logo quando o time não tem imagem nem país", async () => {
    const match = running("ICxI vs HULIGANI");
    match.opponents[1].opponent.image_url = null;
    match.opponents[1].opponent.location = "";
    const wrapper = await mountCard(CardsMedium, match);
    expect(wrapper.findAll(".team-logo")).toHaveLength(1);
  });

  it("mostra o selo de ao vivo", async () => {
    const wrapper = await mountCard(CardsMedium, running("Round 1: AL vs KC"));
    expect(wrapper.find(".live img").attributes("alt")).toBe("Live game");
  });
});

describe("CardsMedium: cor da linha do topo por jogo", () => {
  const upperLineColor = async (match) => {
    const wrapper = await mountCard(CardsMedium, match);
    // happy-dom mantém o hex como foi escrito no componente
    return wrapper.find(".upper-line").element.style.background.toLowerCase();
  };

  it("Dota 2 usa o verde da bandeira", async () => {
    expect(await upperLineColor(running("ICxI vs HULIGANI"))).toBe("#009c3b");
  });

  it("Valorant usa o verde alternativo", async () => {
    expect(await upperLineColor(running("Upper Bracket Quarterfinal Match 4: KRÜ vs Gen.G GC")))
      .toBe("#04ff63");
  });

  // A PandaScore manda "LoL" e "Counter-Strike", que caem no azul padrão
  it("LoL e Counter-Strike usam o azul da bandeira", async () => {
    expect(await upperLineColor(running("Round 1: AL vs KC"))).toBe("#002776");
    expect(await upperLineColor(running("Grand Final: NEM vs VP"))).toBe("#002776");
  });
});

describe("CardsBig (próximas partidas)", () => {
  it("mostra a liga e as siglas dos times", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Round 1: G2 vs DK"));
    expect(wrapper.text()).toContain("Worlds");
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["G2", "DK"]);
    expect(wrapper.find(".game-image-big").attributes("alt")).toBe("LoL");
  });

  it("destaca quartas de final", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Quarterfinal 1: LOUD vs FURIA"));
    expect(wrapper.find(".special-match-name").text()).toBe("Quartas de Final");
  });

  it("destaca semifinal", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Upper Bracket Semifinal 2: paiN vs IMP"));
    expect(wrapper.find(".special-match-name").text()).toBe("Semifinal");
  });

  it("não destaca partida comum", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Round 1: G2 vs DK"));
    expect(wrapper.find(".final-alert-big").exists()).toBe(false);
  });

  it("destaca a grande final como 'Final'", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Grand final: CGN vs SGE"));
    expect(wrapper.find(".final-alert-big").exists()).toBe(true);
    expect(wrapper.find(".special-match-name").text()).toBe("Final");
  });

  // BUG: o template testa `name.includes('final')` sem ignorar maiúsculas,
  // então "Upper/Lower Bracket Final" ficam sem a faixa. Remover o .fails quando corrigir.
  it.fails("destaca 'Upper Bracket Final' como 'Final'", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Upper Bracket Final: DNT vs Quintessence"));
    expect(wrapper.find(".special-match-name").text()).toBe("Final");
  });

  it("corta o nome em 6 letras quando não tem sigla", async () => {
    const wrapper = await mountCard(CardsBig, upcoming("Noir Verse vs Ryvex"));
    expect(wrapper.findAll(".acronym").map((el) => el.text())).toEqual(["Noir V", "Ryvex"]);
  });
});

describe("CardsBig: contagem regressiva da faixa de playoff", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const mountAt = async (match, msBeforeStart) => {
    // Só o Date é falso: o setInterval do cartão roda no timer real do ambiente Nuxt
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(match.begin_at).getTime() - msBeforeStart);
    return mountCard(CardsBig, match);
  };

  it("mostra quanto falta para começar em HH:MM:SS", async () => {
    const match = upcoming("Quarterfinal 1: LOUD vs FURIA");
    const wrapper = await mountAt(match, ((1 * 60 + 30) * 60 + 15) * 1000);
    expect(wrapper.find(".special-match-countdown").text()).toBe("01:30:15");
  });

  // A contagem andando a cada segundo é testada no navegador (tests/e2e/styles.spec.js)

  // BUG: minutos e segundos saem da fração de horas em ponto flutuante e
  // alguns segundos exatos arredondam para baixo. Remover o .fails quando corrigir.
  it.fails("mostra 01:01:01 com 1h 1min 1s para começar", async () => {
    const wrapper = await mountAt(upcoming("Quarterfinal 1: LOUD vs FURIA"), 3661 * 1000);
    expect(wrapper.find(".special-match-countdown").text()).toBe("01:01:01");
  });

  it.fails("mostra 00:00:59 com 59s para começar", async () => {
    const wrapper = await mountAt(upcoming("Quarterfinal 1: LOUD vs FURIA"), 59 * 1000);
    expect(wrapper.find(".special-match-countdown").text()).toBe("00:00:59");
  });

  it("passa de 24 horas sem virar dias", async () => {
    const match = upcoming("Grand final: CGN vs SGE");
    const wrapper = await mountAt(match, 26 * 60 * 60 * 1000);
    expect(wrapper.find(".special-match-countdown").text()).toBe("26:00:00");
  });
});
