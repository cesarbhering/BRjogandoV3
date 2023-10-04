const fetch = require("node-fetch");
const fs = require("fs");

const fileTeamsWithBrs = "./helpers/teams_ids.txt";

const fileBrPlayers = "./helpers/player_ids.txt";

const constructArrayWithRelevantIds = (fileTeamsWithBrs) => {
  // Read the contents of the .txt file
  return fs.readFileSync(fileTeamsWithBrs, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    // Split the file content into an array of lines
    const lines = data.split("\n");

    // Remove any empty lines or whitespace
    const idsArray = lines.filter((line) => line.trim() !== "");

    return idsArray;
  });
};

const playerProcessor = (game, array) => {
  if (array.includes(game.opponents[0].id || game.opponents[1].id)) {
    return game;
  }
};

const handler = async function () {
  try {
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

    const gamesWithBrs = [];

    const teamsArray = constructArrayWithRelevantIds(fileTeamsWithBrs);
    const playersArray = constructArrayWithRelevantIds(fileBrPlayers);


    data.forEach((game) => {
      game.opponents[0].type === "Team"
        ? gamesWithBrs.push(playerProcessor(game, teamsArray))
        : gamesWithBrs.push(playerProcessor(game, playersArray));
    });

    console.log(gamesWithBrs);

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
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
