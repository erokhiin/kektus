require('dotenv').config()

const telegramBot = require('./telegramBot')

telegramBot({
  token: process.env.TOKEN,
})
console.log('🚀🚀🚀🚀')
