const fetch = require("node-fetch");
const fs = require("fs");

const fileTeamsWithBrs = "./helpers/teams_ids.txt";

const fileBrPlayers = "./helpers/player_ids.txt";

const constructArrayWithRelevantIds = (fileTeamsWithBrs) => {
  let idsArray = [];

  fs.readFileSync(fileTeamsWithBrs)
    .toString()
    .split("\n")
    .forEach((line) => {
      idsArray.push(parseInt(line));
    });

  return idsArray;
};

const playerProcessor = (game, array) => {
  if (
    array.includes(
      game.opponents[0].opponent.id || game.opponents[1].opponent.id
    )
  ) {
    return game;
  }
};

const handler = async function (event, ) {
  try {
    console.log(event)
    console.log(event.queryStringParameters)
    const response = await fetch(
      "https://api.pandascore.co/matches/upcoming?filter[opponents_filled]=true",
      {
        headers: {
          accept: "application/json",
          authorization:
            "Bearer REDACTED_PANDASCORE_TOKEN",
        },
        params: {
          "filter[opponents_filled]": true,
        },
      }
    );
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    const teamsArray = constructArrayWithRelevantIds(fileTeamsWithBrs);
    const playersArray = constructArrayWithRelevantIds(fileBrPlayers);

    const gamesWithBrs = [];
    data.forEach((game) => {
      game.opponents[0].type === "Team"
        ? gamesWithBrs.push(playerProcessor(game, teamsArray))
        : gamesWithBrs.push(playerProcessor(game, playersArray));
    });


    return {
      statusCode: 200,
      body: JSON.stringify({ data: gamesWithBrs.filter( Boolean ) }),
    };
  } catch (error) {
    // output to netlify function log
    console.log(error);
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    };
  }
};

module.exports = { handler };
