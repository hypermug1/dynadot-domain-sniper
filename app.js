const axios = require('axios');
const util = require('util');

// DYNADOT API SHIT 🔥
const API_KEY = 'DYNADOT_API_KEY';
const DOMAIN_NAME = 'DOMAIN_TO_SNIPE'

const DISCORD_ID = 'YOUR_DISCORD_ID'
// DISCORD SHIT 🔥
const discordWebhookUrl = 'DISCORD_WEBHOOK_URL;
const DISCORD_ID = 'YOUR_DISCORD_ID'
// DISCORD MESSAGE SENDER CONTRAPTION 🔥
const sendDiscordMessage = async (content) => {
  await axios.post(discordWebhookUrl, { content });
};

// CAN WE REGISTER? 🔥
const checkAndRegisterDomain = async () => {
  try {
    const searchResponse = await axios.get(`https://api.dynadot.com/api3.json?key=${API_KEY}&command=search&domain0=${DOMAIN_NAME}`);
    
    const result = searchResponse.data;
    const searchResult = result.SearchResponse.SearchResults[0];
    
    if (searchResult.Available === 'no') {
      console.log(`Domain ${DOMAIN_NAME} is not available :(`);
    } else {
      const registerResponse = await axios.get(`https://api.dynadot.com/api3.json?key=${API_KEY}&command=register&domain=${DOMAIN_NAME}&currency=EUR&duration=1`);
      const registerResult = registerResponse.data.RegisterResponse;
      
      if (registerResult.ResponseCode === '0' && registerResult.Status === 'success') {
        console.log(`Domain ${DOMAIN_NAME} registered successfully.`);
        await sendDiscordMessage(`Domain ${DOMAIN_NAME} registered :) <@${DISCORD_ID}>`);
        clearInterval(intervalId);
        process.exit(); 
      } else {
        console.log(`Failed to register domain ${DOMAIN_NAME}.`);
        await sendDiscordMessage(`Domain ${DOMAIN_NAME} FAILURE :(`);
      }
    }
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
};
// ARE WE UP?!?! 🔥
const serverHealthNotification = async () => {
  console.log('Server up and running');
};

// HUMP DYNADOT'S LEG EVERY 60 SECONDS 🔥
const intervalId = setInterval(checkAndRegisterDomain, 60 * 1000);

// CHECK IF WE UP 🔥
serverHealthNotification();
