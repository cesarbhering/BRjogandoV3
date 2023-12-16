const fetch = require("node-fetch");
const fs = require("fs");

/**
 * Função para processar o documento de texto com os Ids relevantes da nacionalidade.
 * @param {String} fileWithIds Caminho para o ocumento de texto com os ids que você quer filtrar, um em cada linha.
 * @returns {Array} Array com os ids contidos no arquivo informado.
 */
const constructArrayWithRelevantIds = (fileWithIds) => {
  let idsArray = [];
  if (process.env.DEV === 'true') { // Necessário para que faça a chamada tanto no ambiente de desenvolvimento quanto em produção.
    fs.readFileSync(fileWithIds)
      .toString()
      .split("\n")
      .forEach((line) => {
        idsArray.push(parseInt(line));
      });
  } else {
    fs.readFileSync(require.resolve(fileWithIds))
      .toString()
      .split("\n")
      .forEach((line) => {
        idsArray.push(parseInt(line));
      });
  }
  return idsArray;
};

/**
 * Recebe o jogo e o array com os Ids a filtrar, retorna apenas jogos que tenham os Ids de oponente que queremos.
 * @param {Object} game Jogo a analisar se temos interesse em mostrar na tela.
 * @param {Array} array Array gerado em constructArrayWithRelevantIds.
 * @returns {Object} objeto do jogo que nos interessa.
 */
const playerProcessor = (game, arrayWithIds) => {
  if (
    arrayWithIds.includes(
      game.opponents[0].opponent.id || game.opponents[1].opponent.id
    )
  ) {
    return game;
  }
};

const handler = async function (event) {
  try {
    // usar filter[opponents_filled]=true ?
    const matchOccurrence = event.queryStringParameters.matchOccurrence;
    const response = await fetch(
      `https://api.pandascore.co/teams?${matchOccurrence}`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.API_PANDASCORE_TOKEN}`,
        },
      }
    );
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    const teamsArray = constructArrayWithRelevantIds("./helpers/teams_ids.txt");
    const playersArray = constructArrayWithRelevantIds(
      "./helpers/player_ids.txt"
    );

    const gamesWithBrs = [];
    data.forEach((game) => {
      if (game.opponents[0]?.type) {
        game.opponents[0].type === "Team"
          ? gamesWithBrs.push(playerProcessor(game, teamsArray))
          : gamesWithBrs.push(playerProcessor(game, playersArray));
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ data/* : gamesWithBrs.filter(Boolean) */ }),
    };
  } catch (error) {
    // Printa o erro no log da netlify, não no browser do usuário.
    console.log(error);
    return {
      // Erro que vai para o usuário.
      statusCode: 500,
      body: JSON.stringify({ msg: error.message }),
    };
  }
};

module.exports = { handler };
