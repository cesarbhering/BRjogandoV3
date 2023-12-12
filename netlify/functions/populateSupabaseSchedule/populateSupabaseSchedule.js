const { schedule } = require('@netlify/functions')

const handler = async function (event, context) {
  console.log("Received event:", event)
  // call populateSupabaseSchedule-background function
  try {
    fetch('/.netlify/functions/populateSupabaseSchedule-background');
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

module.exports.handler = schedule("*/10 * * * *", handler);