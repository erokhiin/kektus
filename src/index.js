require('dotenv').config()

const telegramBot = require('./telegramBot')

const app = telegramBot({
  token: process.env.TOKEN,
})
console.log('🚀🚀🚀🚀')
