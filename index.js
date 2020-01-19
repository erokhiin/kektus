require('dotenv').config()
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ BUSHES: [], GROW_ROOMS: [] }).write()

const TelegramBot = require('./src/telegram-bot.js')

const app = TelegramBot({
  db,
  token: process.env.TELEGRAM_BOT_TOKEN,
})
