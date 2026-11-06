const fetch = require("node-fetch");
const fs = require("fs");

/**
 * Reads the text file with the relevant team or player IDs.
 * @param {String} fileWithIds Path to the text file with the IDs to filter by, one per line.
 * @returns {Array} The IDs listed in the file.
 */
const constructArrayWithRelevantIds = (fileWithIds) => {
  let idsArray = [];
  if (process.env.DEV === 'true') { // Needed so the file resolves both in local development and in production.
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
 * Takes a match and the IDs to filter by, and returns the match only if one of its opponents is in the list.
 * @param {Object} game Match to check.
 * @param {Array} arrayWithIds Array built by constructArrayWithRelevantIds.
 * @returns {Object} The match, if it is relevant.
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
    // Only matches with both opponents filled in
    const matchOccurrence = event.queryStringParameters.matchOccurrence;
    const response = await fetch(
      `https://api.pandascore.co/matches/${matchOccurrence}?filter[opponents_filled]=true${matchOccurrence === 'past' ? '&page=1&per_page=5' : ''}`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.API_PANDASCORE_TOKEN}`,
        }
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
    // Logs the error in the Netlify log, not in the user's browser.
    console.log(error);
    return {
      // Error returned to the user.
      statusCode: 500,
      body: JSON.stringify({ msg: error.message }),
    };
  }
};

module.exports = { handler };
