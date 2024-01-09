// Connect to our database
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event, context) => {
  const pandaScoreSerieId = event.queryStringParameters.pandaScoreSerieId;

  const teamNames = event.queryStringParameters.teamNames;
  const team0 = teamNames.split(",")[0].substring(0, 6);
  const team1 = teamNames.split(",")[1].substring(0, 6);
  try {
    // supabase query to get the match data from the infos-adicionais-odds table
    // get te first match where column time0 is equal to team0 and column time1 is equal to team1
    // or vice versa
    const matchData = await supabase
      .from("infos-adicionais-odds")
      .select("*")
      .ilike("time0", `%${team0}%`)
      .ilike("time1", `%${team1}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .then((response) => {
        // Handle the first query response here
        if (response.data.length === 0) {
          // If the first query returns nothing, perform the inverted query
          return supabase
            .from("infos-adicionais-odds")
            .select("*")
            .ilike("time0", `%${team1}%`)
            .ilike("time1", `%${team0}%`)
            .order("created_at", { ascending: false })
            .limit(1);
        } else {
          // If the first query returns data, return the data
          return response;
        }
      });

    const serieData = await supabase
      .from("infos-adicionais-series")
      .select("*")
      .eq("serie_pandascore_id", pandaScoreSerieId);

    const data = [...matchData.data, ...serieData.data];
    return {
      statusCode: 200,
      body: JSON.stringify({
        data,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
