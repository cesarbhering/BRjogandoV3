const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


export default async (req, context) => {
  try {
    let { data, error } = await supabase
    .from('infos-adicionais-jogos')
    .select('url_1xbet')

    console.log(data);
  } catch (err) {
    console.log(err);
  }

  console.log("populateSupabaseSchedule-background Done");
};
