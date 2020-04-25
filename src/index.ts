require('dotenv').config()

import { telegramBot } from './telegramBot'
const token = process.env.TOKEN
if (token) {
  telegramBot({ token })
  console.log('🚀🚀🚀🚀')
} else {
  console.log('Не удалось запустить сервер, нет токена')
}
