const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function (event, context) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: process.env.DEV ? process.env.CHROME_EXECUTABLE_PATH : await chromium.executablePath,
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto('https://br.1xbet.com/line/esports/2626542-cs2-cct-online-finals/193182184-g2-esports-fluxo');
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
} 