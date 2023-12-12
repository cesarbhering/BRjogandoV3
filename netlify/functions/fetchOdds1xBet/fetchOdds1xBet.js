const chromium = require("@sparticuz/chromium");
const puppeteer = require('puppeteer-core');

exports.handler = async function (event, context) {

  try {
    const matchUrl = event.queryStringParameters.matchUrl1xBet;


    // Inicia o web scrapper
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.DEV === 'true' ?  process.env.CHROME_EXECUTABLE_PATH: await chromium.executablePath(),
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


    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: betGroupOdds
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    }
  }
} 