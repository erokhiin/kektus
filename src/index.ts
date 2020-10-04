import TelegramBot from 'node-telegram-bot-api'
require('dotenv').config()
import { demon } from './demon'
import { telegramBot } from './telegramBot'

const token = process.env.TOKEN
const bot = new TelegramBot(token as string, { polling: true })

if (token) {
  telegramBot(bot)
  demon()
  console.log('🌱 Server Started 🌱')
} else {
  console.log('Cannot Start Server Without Token')
}
