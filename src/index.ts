require('dotenv').config()
import { demon } from './demon'
import { telegramBot } from './telegramBot'

const token = process.env.TOKEN
if (token) {
  telegramBot({ token })
  demon()
  console.log('🚀🚀🚀🚀')
} else {
  console.log('Не удалось запустить сервер, нет токена')
}
