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
} from './dbController'
import { EDIT_MENU, MAIN_MENU, SCHEDULER_MENU } from './utils/templates'
import { sendNotification } from 'modules/reminder'
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
  bot.on('polling_error', (err) => console.error(err))

  // Callback Data Handling
  bot.onText(/\/m$/, (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Menu:', {
      reply_markup: {
        inline_keyboard: MAIN_MENU,
      },
    })
  })

  // const toDelay = (roomId: number, bush: Bush) => {
  //   console.log('Напоминание отложено')
  // }

  // Listen for any kind of message. There are different kinds of

  bot.on('callback_query', (query) => {
    const { data } = query
    console.log(query)
    if (!query.message) return
    const growRoomId = query.message.chat.id
    const bushes = getGrowRoomBushes(growRoomId)
    const currentRoom = getcurrentRoom(growRoomId)

    const createBush = (name: string, wateringInterval: number) => {
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
        addBush(Bush)
        bot.sendMessage(growRoomId, '🌳 Plant added!')
      }
      if (currentRoom.currentBushName) {
        changeGrowRoomCurrentBushName(growRoomId, '')
      }
      if (currentRoom.state) {
        changeGrowRoomState(growRoomId, '')
      }
    }

    switch (data) {
      case ACTIONS.BUSHES_LIST:
        const bushesView = bushes.map((BUSH) => `🌱${BUSH.name}`).join('\n')
        const bushesListMessageText = `Plant list:\n${bushesView}`
        bot.sendMessage(growRoomId, bushesListMessageText)
        break

      case ACTIONS.ADD_BUSH:
        changeGrowRoomState(growRoomId, INPUT_STATES.NEW_BUSH_NAME)
        bot.sendMessage(growRoomId, '🌿 Insert plant name:')
        break
      case ACTIONS.EDIT:
        bot.sendMessage(growRoomId, '💦 Choose watering interval', {
          reply_markup: {
            inline_keyboard: SCHEDULER_MENU,
          },
        })
        break
      case ACTIONS.CANCEL:
        if (currentRoom.state) {
          changeGrowRoomState(growRoomId, '')
        }
        if (currentRoom.currentBushName) {
          changeGrowRoomCurrentBushName(growRoomId, '')
        }
        break

      // case ACTIONS.SEND_NOTIFICATION:
      //   sendNotification(growRoomId, bushes[0].id)
      //   break

      case ACTIONS.MARK_WATERING:
        const currentDate = new Date()
        markWatering(bushes[0].id, currentDate)
        bot.sendMessage(growRoomId, 'Отлично, я запомнил!')
        break

      // case ACTIONS.TO_DELAY:
      //   toDelay(growRoomId, bushes[0])
      //   bot.sendMessage(growRoomId, 'Окей, напоминание отложено 😴😴😴')
      //   break

      case SCHEDULES.EACH_DAY:
        if (!currentRoom.currentBushName) break
        createBush(currentRoom.currentBushName, SCHEDULE_TIMES.EACH_DAY)
        break

      case SCHEDULES.EACH_4_DAYS:
        if (!currentRoom.currentBushName) break
        createBush(currentRoom.currentBushName, SCHEDULE_TIMES.EACH_4_DAYS)
        break
      case SCHEDULES.EACH_5_DAYS:
        if (!currentRoom.currentBushName) break
        createBush(currentRoom.currentBushName, SCHEDULE_TIMES.EACH_5_DAYS)
        break
      case SCHEDULES.EACH_WEEK:
        if (!currentRoom.currentBushName) break
        createBush(currentRoom.currentBushName, SCHEDULE_TIMES.EACH_WEEK)
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
          bot.sendMessage(
            growRoomId,
            '✋ The plant is already there, want to edit?',
            {
              reply_markup: {
                inline_keyboard: EDIT_MENU,
              },
            },
          )
        } else {
          changeGrowRoomCurrentBushName(growRoomId, msg.text)
          bot.sendMessage(growRoomId, '💦 Choose watering interval', {
            reply_markup: {
              inline_keyboard: SCHEDULER_MENU,
            },
          })
        }
        break
    }
    if (currentRoom.state) {
      changeGrowRoomState(growRoomId, '')
    }
  })
}
