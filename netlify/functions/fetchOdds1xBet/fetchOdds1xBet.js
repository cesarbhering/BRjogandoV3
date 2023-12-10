const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function (event, context) {

  try {
    const matchUrl = event.queryStringParameters.matchUrl1xBet;

    // Inicia o web scrapper
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: process.env.DEV ? process.env.CHROME_EXECUTABLE_PATH : await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(matchUrl1xBet, { "waitUntil": "domcontentloaded" });
    // Pega a primeira referencia de aposta na página, geralmente quem ganha o jogo
    const betGroupOdds = await page.$eval('.bet_group', (betGroup) => {
      const koeffLabels = betGroup.querySelectorAll('.koeff__label');
      return Array.from(koeffLabels).map((label) => label.textContent.trim());
    });

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        betGroupOdds
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