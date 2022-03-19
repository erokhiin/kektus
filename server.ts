import next from 'next'
import { createServer } from 'http'
import { parse } from 'url'
import { telegramBot } from './modules/telegramBot'
import { demon } from './modules/demon'
import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'

dotenv.config()

const app = next({ dev: true, port: 3000 })
const handle = app.getRequestHandler()


const token = process.env.TOKEN
export const bot = new TelegramBot(token as string, { polling: true })

app.prepare().then(() => {
  try {
    if (token) {
      telegramBot(bot)
      demon()
      console.log('🌱 Server Started 🌱')
    } else {
      console.log('Cannot Start Server Without Token')
    }
  } catch (e) {
    console.log(e)
  }
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(3000)
})
