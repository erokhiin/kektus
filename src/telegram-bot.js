const TelegramBot = require('node-telegram-bot-api')

const ACTIONS = Object.freeze({
  BUSHES_LIST: 'BUSHES_LIST',
  ADD_BUSH: 'ADD_BUSH',
})

const INPUT_STATES = Object.freeze({
  NEW_BUSH_NAME: 'NEW_BUSH_NAME',
  NEW_BUSH_SCHEDULE: 'NEW_PLANT_SCHEDULE',
})

const MAIN_MENU = [
  [
    {
      text: 'Список цветов',
      callback_data: ACTIONS.BUSHES_LIST,
    },
  ],
  [
    {
      text: 'Добавить цветок',
      callback_data: ACTIONS.ADD_BUSH,
    },
  ],
]

const SCHEDULES = Object.freeze({
  EACH_3_DAYS: 'EACH_3_DAYS',
  EACH_WEEK: 'EACH_WEEK',
})

const SCHEDULE_TIMES = {
  [SCHEDULES.EACH_3_DAYS]: '*/30 12 */3 * *',
  [SCHEDULES.EACH_WEEK]: '*/30 12 */7 * *',
}

const SCHEDULER_MENU = [
  [
    {
      callback_data: SCHEDULES.EACH_3_DAYS,
      text: 'Каждые 3 дня',
    },
  ],
  [
    {
      callback_data: SCHEDULES.EACH_WEEK,
      text: 'Каждую неделю',
    },
  ],
]
module.exports = startTelegramBot = ({ token, db }) => {
  // Bot
  const bot = new TelegramBot(token, { polling: true })
  const cron = require('node-cron')

  // Db helpers
  const findRoom = id => db.get('GROW_ROOMS').find({ id })
  const findRoomValue = id => findRoom(id).value()
  const getCurrRoom = id => {
    const room = findRoomValue(id)
    if (!room) {
      db.get('GROW_ROOMS')
        .push({ id })
        .write()
      return findRoomValue(id)
    } else {
      return room
    }
  }

  // Error Handling
  bot.on('polling_error', err => console.error(err))

  // Callback Data Handling
  bot.onText(/\/m$/, msg => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Меню:', {
      reply_markup: {
        inline_keyboard: MAIN_MENU,
      },
    })
  })

  // Listen for any kind of message. There are different kinds of

  bot.on('callback_query', query => {
    console.log('\n---\n')
    console.log(query)

    const { data } = query
    const currRoomId = query.message.chat.id
    const currRoom = getCurrRoom(currRoomId)
    console.log(currRoomId)

    const createSchedule = (bushHame, schedule) => {
      return cron.schedule(SCHEDULE_TIMES[schedule], () => {
        bot.sendMessage(currRoomId, '👀 Время поливать цветок: ' + bushHame)
      })
    }

    switch (data) {
      case ACTIONS.BUSHES_LIST:
        const bushes = db
          .get('BUSHES')
          .filter({ growRoomId: currRoomId })
          .value()
        const bushesView = bushes.map(BUSH => `🌱    ${BUSH.name}`).join('\n')
        const bushesListMessageText = `Список цветов:\n${bushesView}`
        bot.sendMessage(currRoomId, bushesListMessageText)
        break

      case ACTIONS.ADD_BUSH:
        db.get('GROW_ROOMS')
          .find({ id: currRoomId })
          .assign({ inputState: INPUT_STATES.NEW_BUSH_NAME })
          .write()
        bot.sendMessage(currRoomId, 'Напиши название:')
        break

      case SCHEDULES.EACH_3_DAYS:
        db.get('BUSHES')
          .filter({ growRoomId: currRoomId })
          .find({ name: currRoom.processingBushName })
          .assign({ schedule: SCHEDULES.EACH_3_DAYS })
          .write()

        createSchedule(currRoom.processingBushName, SCHEDULES.EACH_3_DAYS)

        db.get('GROW_ROOMS')
          .find({ id: currRoomId })
          .assign({ processingBushName: undefined })
          .write()

        bot.sendMessage(currRoomId, '🌳 Растение добавлено!')
        break

      case SCHEDULES.EACH_WEEK:
        db.get('BUSHES')
          .filter({ growRoomId: currRoomId })
          .find({ name: currRoom.processingBushName })
          .assign({ schedule: SCHEDULES.EACH_WEEK })
          .write()

        createSchedule(currRoom.processingBushName, SCHEDULES.EACH_WEEK)

        db.get('GROW_ROOMS')
          .find({ id: currRoomId })
          .assign({ processingBushName: undefined })
          .write()

        bot.sendMessage(currRoomId, '🌳 Растение добавлено!')
        break
    }
  })

  // Messages Handling
  bot.on('message', msg => {
    const currRoomId = msg.chat.id
    const currRoom = getCurrRoom(currRoomId)

    switch (currRoom.inputState) {
      case INPUT_STATES.NEW_BUSH_NAME:
        const inputBush = { name: msg.text, growRoomId: currRoomId }
        const existing = db
          .get('BUSHES')
          .find(inputBush)
          .value()
        if (!existing) {
          db.get('BUSHES')
            .push(inputBush)
            .write()
          bot.sendMessage(
            currRoomId,
            '💦 Выбери как часто его нужно поливать',
            {
              reply_markup: {
                inline_keyboard: SCHEDULER_MENU,
              },
            },
          )
          db.get('GROW_ROOMS')
            .find({ id: currRoomId })
            .assign({ inputState: INPUT_STATES.NEW_PLANT_SCHEDULE })
            .assign({ processingBushName: inputBush.name })
            .write()
        } else {
          bot.sendMessage(currRoomId, '✋ Такое растение уже есть!')
        }
        break
    }
    if (currRoom.inputState) {
      db.get('GROW_ROOMS')
        .find({ id: currRoomId })
        .assign({ inputState: undefined })
        .write()
    }
  })
}
