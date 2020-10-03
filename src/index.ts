require('dotenv').config()
import { demon } from './demon'
import { telegramBot } from './telegramBot'

const token = process.env.TOKEN
if (token) {
  telegramBot({ token })
  demon()
  console.log('🌱 Server Started 🌱')
} else {
  console.log('Cannot Start Server Without Token')
}
