const axios = require('axios');
const twilio = require("twilio");
const xml2js = require('xml2js');
const util = require('util');

// Configuration for Dynadot
const API_KEY = 'YOUR_DYNADOT_API_KEY'
// Domain name to snipe e.g. ilovejazz.com
const DOMAIN_NAME = 'YOUR_DOMAIN_NAME'

// Configuration for Twilio
const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
const authToken = "YOUR_TWILIO_AUTH_TOKEN";
const client = new twilio(accountSid, authToken);

// Function to send message
const sendMessage = async (message) => {
  await client.messages.create({
    body: message,
    from: "whatsapp:SENDER_WHATSAPP_NUMBER",
    to: "whatsapp:RECEIVER_WHATSAPP_NUMBER",
  });
};

// Function to check and register domain
const checkAndRegisterDomain = async () => {
  try {
    const searchResponse = await axios.get(`https://api.dynadot.com/api3.json?key=${API_KEY}&command=search&domain0=${DOMAIN_NAME}`);
    
    const result = searchResponse.data;
    const searchResult = result.SearchResponse.SearchResults[0];
    
    if (searchResult.Available === 'no') {
      console.log(`Domain ${DOMAIN_NAME} is not available.`);
    } else {
      const registerResponse = await axios.get(`https://api.dynadot.com/api3.json?key=${API_KEY}&command=register&domain=${DOMAIN_NAME}&currency=EUR&duration=1`);
      const registerResult = registerResponse.data.RegisterResponse;
      
      if (registerResult.ResponseCode === '0' && registerResult.Status === 'success') {
        console.log(`Domain ${DOMAIN_NAME} registered successfully.`);
        await sendMessage(`Domain ${DOMAIN_NAME} registered 🧿🧿🧿`)
        clearInterval(intervalId);
        process.exit(); 
      } else {
        console.log(`Failed to register domain ${DOMAIN_NAME}.`);
        await sendMessage(`Domain ${DOMAIN_NAME} FAILURE`);
      }
    }
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
};

// Function to notify server health
const serverHealthNotification = async () => {
    console.log('Server up and running');
    sendMessage(`Server up and running, trying to snipe ${DOMAIN_NAME}`);
}

// Set interval to check and register domain every 10 seconds
const intervalId = setInterval(checkAndRegisterDomain, 10 * 1000);

// Call server health notification function
serverHealthNotification();