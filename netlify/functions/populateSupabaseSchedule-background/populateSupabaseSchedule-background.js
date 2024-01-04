const { createClient } = require('@supabase/supabase-js');
const chromium = require("@sparticuz/chromium");
const puppeteer = require('puppeteer-core');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Faz o fetch das odds do jogo no site da 1xBet
 * @param {String} matchUrl url do jogo no site da 1xBet 
 * @returns 
 */
const fetchOdds1xBet = async (matchUrl) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.DEV === 'true' ? process.env.CHROME_EXECUTABLE_PATH : await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,

  });

  const page = await browser.newPage();
  await page.goto(matchUrl, { "waitUntil": "domcontentloaded" });

  await page.waitForSelector('.bet_group')

  // Pega a primeira referencia de aposta na página, geralmente quem ganha o jogo
  const betGroupOdds = await page.$eval('.bet_group', (betGroup) => {
    const koeffLabels = betGroup.querySelectorAll('.koeff__label');
    return Array.from(koeffLabels).map((label) => label.textContent.trim());
  });

  return { matchUrl, betGroupOdds }
}

/**
 * Faz o update das odds no supabase
 * @param {Object} liveInfos Objeto exemplo: { matchUrl: 'https://www.1xbet.com/pt/live/eSports/...', betGroupOdds: ['1.5', '2.5'] } 
 */
const updateOdds1xBet = async (liveInfos) => {
  const { matchUrl, betGroupOdds } = liveInfos;
  try {
    await supabase
      .from('infos-adicionais-jogos')
      .update({ odds_1xbet: betGroupOdds })
      .eq('url_1xbet', matchUrl)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        }
      })
  } catch (error) {
    console.error(error);
  }
}


exports.handler = async (req, context) => {
  try {
    // Faz o fetch das urls dos jogos
    let { data, errorGet } = await supabase
      .from('infos-adicionais-jogos')
      .select('url_1xbet')

    const urls1xBet = data.map((match) => match.url_1xbet);

    // Faz o fetch das odds de cada jogo
    const odds1xBet = await Promise.all(urls1xBet.map(async (url) => {
      return await fetchOdds1xBet(url);
    }));

    // Faz o update das odds no supabase
    odds1xBet.forEach((odd) => {
      updateOdds1xBet(odd);
    })

  } catch (error) {
    console.error(error);
  }
}
