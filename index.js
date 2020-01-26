require('dotenv').config()

const telegramBot = require('./src/telegramBot.js')

const app = telegramBot({
  token: process.env.TOKEN,
})
console.log('app started 🥰')
