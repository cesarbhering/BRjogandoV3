// Connect to our database 
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async (event, context) => {
  const pandaScoreMatchId = event.queryStringParameters.pandaScoreMatchId;
  try {
  let { data, error } = await supabase
  .from('infos-adicionais-jogos')
  .select('*')
  .eq('id_pandascore', pandaScoreMatchId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      data
    })
  };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
}