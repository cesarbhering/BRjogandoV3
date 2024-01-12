const { createClient } = require("@supabase/supabase-js");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/**
 * Faz uma busca no site da 1xBet e retorna as odds de cada jogo ao vivo
 * @returns {Array<Object>} Array de objetos com as odds de cada jogo ao vivo. 
 * Exemplo: { time0: { team: 'Time 1', odds: '1.5' }, time1: { team: 'Time 2', odds: '2.5' }, linkPartida: 'https://www.1xbet.com/pt/live/eSports/...'
 */
const fetchOdds1xBetLive = async () => {
  // Inicia o browser
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.DEV === "true"
        ? process.env.CHROME_EXECUTABLE_PATH
        : await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  try {
    const page = await browser.newPage();
    await page.goto("https://br.1xbet.com/live/esports", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("#games_content");

    const jogosAoVivoOdds = await page.$$eval(
      ".c-events-scoreboard__wrap",
      (jogosAoVivo) => {
        return jogosAoVivo.map((element) => {
          const nomesTimes = element.querySelectorAll(".c-events__team");
          const timesPartida = Array.from(nomesTimes).map((time) => ({
            nome: time.textContent.trim(),
            odds: null, // Initialize odds to null
          }));
          const linkPartida = element
            .querySelector(".c-events__name")
            .getAttribute("href");

          // Use a conditional check to handle cases where the element may not exist
          const oddsTime1Element = element.querySelector('span[title="V1"]');
          const oddsTime1 = oddsTime1Element
            ? oddsTime1Element.textContent.trim()
            : null;

          // Adjust selector if needed for oddsTime2
          const oddsTime2Element = element.querySelector('span[title="V2"]');
          const oddsTime2 = oddsTime2Element
            ? oddsTime2Element.textContent.trim()
            : null;

          // Assign odds to the corresponding team in timesPartida
          if (timesPartida.length >= 2) {
            timesPartida[0].odds = oddsTime1;
            timesPartida[1].odds = oddsTime2;
          }

          return {
            time0: timesPartida[0],
            time1: timesPartida[1],
            linkPartida,
            ocorrencia: "live",
          };
        });
      }
    );

    return jogosAoVivoOdds;
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
};

/**
 * Faz uma busca no site da 1xBet e retorna as odds de cada jogo que ainda vai acontecer
 * @returns {Array<Object>} Array de objetos com as odds de cada jogo que ainda vai acontecer. 
 * Exemplo: { time0: { team: 'Time 1', odds: '1.5' }, time1: { team: 'Time 2', odds: '2.5' }, linkPartida: 'https://www.1xbet.com/pt/live/eSports/...'
 */
const fetchOdds1xBetUpcoming = async () => {
  // Inicia o browser
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.DEV === "true"
        ? process.env.CHROME_EXECUTABLE_PATH
        : await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  try {
    const page = await browser.newPage();
    await page.goto("https://br.1xbet.com/line/esports", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("#games_content");

    const jogosProximosOdds = await page.$$eval(
      ".c-events__item_game",
      (jogosProximos) => {
        return jogosProximos.map((element) => {
          const nomesTimes = element.querySelectorAll(".c-events__team");
          const timesPartida = Array.from(nomesTimes).map((time) => ({
            nome: time.textContent.trim(),
            odds: null, // Initialize odds to null
          }));
          const linkPartida = element
            .querySelector(".c-events__name")
            .getAttribute("href");

          // Use a conditional check to handle cases where the element may not exist
          const oddsTime1Element = element.querySelector('span[title="V1"]');
          const oddsTime1 = oddsTime1Element
            ? oddsTime1Element.textContent.trim()
            : null;

          // Adjust selector if needed for oddsTime2
          const oddsTime2Element = element.querySelector('span[title="V2"]');
          const oddsTime2 = oddsTime2Element
            ? oddsTime2Element.textContent.trim()
            : null;

          // Assign odds to the corresponding team in timesPartida
          if (timesPartida.length >= 2) {
            timesPartida[0].odds = oddsTime1;
            timesPartida[1].odds = oddsTime2;
          }
          if (timesPartida[0] && timesPartida[1] && linkPartida) {
            return {
              time0: timesPartida[0],
              time1: timesPartida[1],
              linkPartida,
              ocorrencia: "upcoming",
            };
          } else {
            return;
          }
        });
      }
    );
    return jogosProximosOdds.filter(Boolean);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
};

/**
 * Faz o update das odds no supabase na tabela infos-adicionais-odds
 * @param {Object} oddsPartida1xbet Objeto 
 * Exemplo: 
 * {
    time0: { nome: 'DRX', odds: '1.488' },
    time1: { nome: 'NS RedForce', odds: '2.705' },
    linkPartida: '/line/esports/1852928-league-of-legends-lck-spring/197570758-drx-ns-redforce',
    ocorrencia: 'upcoming'
  }
 */
const updateOdds1xBet = async (oddsPartida1xbet) => {
  const { time0, time1, linkPartida, ocorrencia } = oddsPartida1xbet;
  try {
    await supabase
      .from("infos-adicionais-odds")
      .upsert(
        [
          {
            link: linkPartida,
            time0: time0.nome,
            time1: time1.nome,
            odds0: time0.odds,
            odds1: time1.odds,
            ocorrencia,
          },
        ],
        { onConflict: ["link"] }
      )
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        }
      });
  } catch (error) {
    console.error(error);
  }
};

exports.handler = async (req, context) => {
  try {
    // Busca as odds dos jogos ao vivo
    const liveInfos = await fetchOdds1xBetLive();
    // Atualiza as odds dos jogos ao vivo no supabase
    for (const info of liveInfos) {
      await updateOdds1xBet(info);
    }

    // Busca as odds dos jogos que ainda vão acontecer
    const upcomingInfos = await fetchOdds1xBetUpcoming();
    upcomingInfos.forEach(async (info) => {
      await updateOdds1xBet(info);
    });
    // Atualiza as odds dos jogos que ainda vão acontecer no supabase
    for (const info of upcomingInfos) {
      await updateOdds1xBet(info);
    }
  } catch (error) {
    console.error(error);
  }
};
