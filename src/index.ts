import TelegramBot from 'node-telegram-bot-api'
require('dotenv').config()

import { telegramBot } from './telegramBot'

const token = process.env.TOKEN
const bot = new TelegramBot(token as string, { polling: true })

if (token) {
  telegramBot(bot)
  console.log('🚀🚀🚀🚀')
} else {
  console.log('Не удалось запустить сервер, нет токена')
}
