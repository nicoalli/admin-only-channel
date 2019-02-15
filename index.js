const express                   = require('express')
const request                   = require('request')
const { RTMClient, WebClient }  = require('@slack/client')

const adminUsers                = process.env.ADMIN_USERS
const adminChannels             = process.env.ADMIN_CHANNELS
const botToken                  = process.env.BOT_TOKEN
const oauthToken                = process.env.OAUTH_TOKEN

const rtm                       = new RTMClient(botToken)
const web                       = new WebClient(oauthToken)

const host                      = '0.0.0.0'
const port                      = process.env.PORT || 3000
const app                       = express()

let adminUsersList = adminUsers.split(',')
let adminChannelList = adminChannels.split(',')

rtm.start();

app.get('/', function(req, res) {
  res.send('Homepage!');
});
app.listen(port, host)

// RTM Authentication
rtm.on('authenticated', (connectData) => {
  console.log('RTM client authenticated!');
});

// RTM Init
rtm.on('connected', () => {
  try {
    console.log('RTM connection openend...')
  } catch(e) {
    console.log('Bot not found, please verify that bot user exist in slack, exiting... ', e);
    process.exit(-1);
  }
});

// Catch messages then delete those not from admins
rtm.on('message', (message) => {
  if (message.type === 'message' && message.text) {

    // check if message is coming from a whitelisted channel
    if (adminChannelList.includes(message.channel)) {

      // check if user is a whitelisted (admin) user
      if (!adminUsersList.includes(message.user)
        && message.subtype != 'bot_message') {

        rtm.sendMessage('Sorry, you are unauthorized to post in this channel. Deleting message...', message.channel)
           .then((msg) => {
             web.chat.delete({ts: message.ts, channel: message.channel})
                     .then((res) => {})
                     .catch((err) => { console.log(err) });
           })
           .catch((err) => { console.log(err) });

      }

    }
  }
});
