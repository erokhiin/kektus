import TelegramBot from 'node-telegram-bot-api'
import {
  findRoomValue,
  addGrowRoom,
  addBush,
  changeInputState,
  changeBushSchedule,
  isExistingName,
  getGrowRoomBushes,
  getGrowRoomBushesSize,
  changeCommandState,
  changeProcessingBushId,
} from './dbController'
import { MAIN_MENU, SCHEDULER_MENU } from './utils/templates'
import { ACTIONS, INPUT_STATES, SCHEDULES } from './utils/enums'
import { Bush } from './models/Bush'

export const telegramBot = ({ token }: { token: string }) => {
  const bot = new TelegramBot(token, { polling: true })

  // const cron = require('node-cron')
  // const createSchedule = (bushHame, schedule, growRoomId) => {
  //   return cron.schedule(SCHEDULE_TIMES[schedule], () => {
  //     bot.sendMessage(growRoomId, '👀 Время поливать цветок: ' + bushHame)
  //   })
  // }

  // Db helpers
  const getCurrRoom = (id: number) => {
    const room = findRoomValue(id)
    if (room) return room
    addGrowRoom(id)
    return findRoomValue(id)
  }

  // Error Handling
  bot.on('polling_error', (err) => console.error(err))

  // Callback Data Handling
  bot.onText(/\/m$/, (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Меню:', {
      reply_markup: {
        inline_keyboard: MAIN_MENU,
      },
    })
  })

  // Listen for any kind of message. There are different kinds of

  bot.on('callback_query', (query) => {
    const { data } = query
    console.log(query)
    if (!query.message) return
    const growRoomId = query.message.chat.id
    const currRoom = getCurrRoom(growRoomId)

    switch (data) {
      case ACTIONS.BUSHES_LIST:
        const bushes = getGrowRoomBushes(growRoomId)
        const bushesView = bushes.map((BUSH) => `🌱${BUSH.name}`).join('\n')
        const bushesListMessageText = `Список цветов:\n${bushesView}`
        bot.sendMessage(growRoomId, bushesListMessageText)
        break

      case ACTIONS.ADD_BUSH:
        changeInputState(growRoomId, INPUT_STATES.NEW_BUSH_NAME)
        bot.sendMessage(growRoomId, 'Напиши название:')
        break

      case SCHEDULES.EACH_3_DAYS:
        if (!currRoom.processingBushId) return
        changeBushSchedule(currRoom.processingBushId, SCHEDULES.EACH_3_DAYS)
        // createSchedule(
        //   currRoom.processingBushId,
        //   SCHEDULES.EACH_3_DAYS,
        //   growRoomId,
        // )

        changeProcessingBushId(growRoomId)

        bot.sendMessage(growRoomId, '🌳 Растение добавлено!')
        break

      case SCHEDULES.EACH_WEEK:
        if (!currRoom.processingBushId) return
        changeBushSchedule(currRoom.processingBushId, SCHEDULES.EACH_WEEK)

        // createSchedule(
        //   currRoom.processingBushId,
        //   SCHEDULES.EACH_WEEK,
        //   growRoomId,
        // )

        changeProcessingBushId(growRoomId)

        bot.sendMessage(growRoomId, '🌳 Растение добавлено!')
        break
    }
  })

  // Messages Handling
  bot.on('message', (msg) => {
    console.log(msg)
    const growRoomId = msg.chat.id
    if (!msg.text) return
    const currRoom = getCurrRoom(growRoomId)
    switch (currRoom.inputState) {
      case INPUT_STATES.NEW_BUSH_NAME:
        if (isExistingName(growRoomId, msg.text))
          return bot.sendMessage(growRoomId, '✋ Такое растение уже есть!')
        const id = getGrowRoomBushesSize(growRoomId) + 1
        const inputBush: Bush = { id, name: msg.text, growRoomId: growRoomId }
        addBush(inputBush)
        changeCommandState(growRoomId, INPUT_STATES.NEW_BUSH_SCHEDULE)
        changeProcessingBushId(growRoomId, id)
        bot.sendMessage(growRoomId, '💦 Выбери как часто его нужно поливать', {
          reply_markup: {
            inline_keyboard: SCHEDULER_MENU,
          },
        })
        break
    }
    if (currRoom.inputState) {
      changeInputState(growRoomId, '')
    }
  })
}