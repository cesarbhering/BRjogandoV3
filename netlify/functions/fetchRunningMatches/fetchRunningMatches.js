// samething as fetchUpcomingMatches, but using /matches/running endpoint instead

const fetch = require("node-fetch");

const handler = async function () {
  try {
    const response = await fetch("https://api.pandascore.co/matches/running", {
      headers: {
        Accept: "application/json",
        Authorization: "REDACTED_PANDASCORE_TOKEN",
      },
    });
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

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
