const fetch = require("node-fetch");

const handler = async function (event) {
  try {
    const matchId = event.queryStringParameters.matchId;
    const gameId = event.queryStringParameters.gameId; // Current game ID if available
    
    if (!matchId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Match ID is required" }),
      };
    }

    // Fetch live player stats from PandaScore
    const endpoint = gameId 
      ? `https://api.pandascore.co/games/${gameId}/players`
      : `https://api.pandascore.co/matches/${matchId}/players`;
      
    const response = await fetch(endpoint, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${process.env.API_PANDASCORE_TOKEN}`,
      }
    });

    if (!response.ok) {
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ error: response.statusText })
      };
    }

    const playerStats = await response.json();

    // Also fetch current game info to get game-specific details
    let currentGame = null;
    if (gameId) {
      const gameResponse = await fetch(
        `https://api.pandascore.co/games/${gameId}`,
        {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${process.env.API_PANDASCORE_TOKEN}`,
          }
        }
      );
      
      if (gameResponse.ok) {
        currentGame = await gameResponse.json();
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        playerStats,
        currentGame,
        timestamp: new Date().toISOString()
      }),
    };
  } catch (error) {
    console.log("Error fetching live player stats:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports = { handler };