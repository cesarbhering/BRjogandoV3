const fetch = require('node-fetch')

exports.handler = async (event, context) => {
  const querystring = event.queryStringParameters;
  const videoGameId = querystring.videoGameId;
  const opponentOneId = querystring.opponentOneId;
  const opponentTwoId = querystring.opponentTwoId;
  try {
    const response = await fetch(`https://api.pandascore.co/teams?filter[id]=${opponentOneId},${opponentTwoId}&filter[videogame_id]=${videoGameId}&sort=&page=1&per_page=50`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.API_PANDASCORE_TOKEN}`,
        },
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: { msg: error.message }
    }
  }
}