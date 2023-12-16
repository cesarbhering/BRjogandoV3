/* const { schedule } = require('@netlify/functions')
 */
const handler = async function (event, context) {
  // call populateSupabaseSchedule-background function
  try {
    fetch('http://localhost:8888/.netlify/functions/populateSupabaseSchedule-background');
    return {
      statusCode: 200,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};

// module.exports.handler = schedule("*/10 * * * *", handler);
module.exports = { handler };