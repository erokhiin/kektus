import TelegramBot from 'node-telegram-bot-api'
import { nanoid } from 'nanoid'
import {
  findRoomValue,
  addGrowRoom,
  addBush,
  changeGrowRoomState,
  isExistingName,
  getGrowRoomBushes,
  changeGrowRoomCurrentBushName,
  getBushByName,
  updateBush,
  markWatering,
} from './utils/dbController'
import { MAIN_MENU, SCHEDULER_MENU } from './utils/templates'
import { ACTIONS, INPUT_STATES, SCHEDULES, SCHEDULE_TIMES } from './utils/enums'
import { Bush } from './models/Bush'

export const telegramBot = (bot: TelegramBot) => {
  // Db helpers
  const getcurrentRoom = (id: number) => {
    const room = findRoomValue(id)
    if (room) return room
    addGrowRoom(id)
    return findRoomValue(id)
  }

  // Error Handling
  bot.on('polling_error', console.error)

  // Callback Data Handling
  bot.onText(/\/m$/, (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Menu:', {
      reply_markup: {
        inline_keyboard: MAIN_MENU,
      },
    })
  })

  bot.on('callback_query', (query: TelegramBot.CallbackQuery) => {
    const { data, message, id: callbackQueryId } = query
    if (!(message && data)) return
    const growRoomId = message.chat.id
    const bushes = getGrowRoomBushes(growRoomId)
    const currentRoom = getcurrentRoom(growRoomId)

    const createBush = async (name: string, wateringInterval: number) => {
      const getExistingBushId = getBushByName(growRoomId, name)?.id
      if (getExistingBushId) {
        updateBush(getExistingBushId, { name, wateringInterval })
      } else {
        const Bush: Bush = {
          id: nanoid(),
          name,
          growRoomId,
          wateringInterval,
          lastWatering: new Date(),
          lastNotification: new Date(),
        }
        await addBush(Bush)
      }
      if (currentRoom.currentBushName) {
        await changeGrowRoomCurrentBushName(growRoomId, '')
      }
      if (currentRoom.state) {
        await changeGrowRoomState(growRoomId, '')
      }
    }
    const action = data.split('/')[0]
    const actionData = data.split('/')[1]

    const sendPlantAddedNotification = () =>
      bot.answerCallbackQuery(callbackQueryId, { text: '☘️ Plant added!' })

    switch (action) {
      case ACTIONS.BUSHES_LIST:
        const bushesView = bushes
          .map((bush, i) => `   ${i + 1}. ${bush.name}`)
          .join('\n')
        const bushesListMessageText = `🗿 Plant list:\n${bushesView}`
        bot
          .sendMessage(growRoomId, bushesListMessageText)
          .then(() => bot.answerCallbackQuery(callbackQueryId))
        break

      case ACTIONS.ADD_BUSH:
        changeGrowRoomState(growRoomId, INPUT_STATES.NEW_BUSH_NAME)
        bot
          .sendMessage(growRoomId, '🌿 Insert plant name:')
          .then(() => bot.answerCallbackQuery(callbackQueryId))
        break

      case ACTIONS.EDIT:
        bot
          .sendMessage(growRoomId, '💦 Choose watering interval', {
            reply_markup: {
              inline_keyboard: SCHEDULER_MENU,
            },
          })
          .then(() => bot.answerCallbackQuery(callbackQueryId))
        break

      case ACTIONS.MARK_WATERING:
        const currentDate = new Date()
        markWatering(actionData, currentDate).then(() =>
          bot.answerCallbackQuery(callbackQueryId, { text: '💚 Excellent!' }),
        )
        bot.deleteMessage(message.chat.id, message.message_id.toString())
        break

      case SCHEDULES.EACH_DAY:
        if (!currentRoom.currentBushName) break
        createBush(currentRoom.currentBushName, SCHEDULE_TIMES.EACH_DAY).then(
          sendPlantAddedNotification,
        )
        break

      case SCHEDULES.EACH_4_DAYS:
        if (!currentRoom.currentBushName) break
        createBush(
          currentRoom.currentBushName,
          SCHEDULE_TIMES.EACH_4_DAYS,
        ).then(sendPlantAddedNotification)
        break

      case SCHEDULES.EACH_5_DAYS:
        if (!currentRoom.currentBushName) break
        createBush(
          currentRoom.currentBushName,
          SCHEDULE_TIMES.EACH_5_DAYS,
        ).then(sendPlantAddedNotification)
        break

      case SCHEDULES.EACH_WEEK:
        if (!currentRoom.currentBushName) break
        createBush(currentRoom.currentBushName, SCHEDULE_TIMES.EACH_WEEK).then(
          sendPlantAddedNotification,
        )
        break
    }
  })

  // Messages Handling
  bot.on('message', (msg) => {
    console.log(msg)
    const growRoomId = msg.chat.id
    if (!msg.text) return
    const currentRoom = getcurrentRoom(growRoomId)
    switch (currentRoom.state) {
      case INPUT_STATES.NEW_BUSH_NAME:
        changeGrowRoomCurrentBushName(growRoomId, msg.text)

        if (isExistingName(growRoomId, msg.text)) {
          bot.sendMessage(growRoomId, '✋ The plant is already there')
          return
        } else {
          changeGrowRoomCurrentBushName(growRoomId, msg.text)
          bot.sendMessage(growRoomId, '💦 Choose watering interval', {
            reply_markup: {
              inline_keyboard: SCHEDULER_MENU,
            },
          })
        }
        changeGrowRoomState(growRoomId, '')
        break
    }
  })
}
