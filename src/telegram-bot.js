const TelegramBot = require('node-telegram-bot-api')

const ACTIONS = Object.freeze({
  BUSHES_LIST: 'BUSHES_LIST',
  ADD_BUSH: 'ADD_BUSH',
})

const INPUT_STATES = Object.freeze({
  NEW_PLANT_NAME: 'NEW_PLANT_NAME',
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

module.exports = startTelegramBot = ({ token, db }) => {
  // Bot
  const bot = new TelegramBot(token, { polling: true })

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
        // keyboard: MAIN_MENU,
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

    switch (data) {
      case ACTIONS.BUSHES_LIST:
        const bushes = db
          .get('BUSHES')
          .filter({ growRoomId: currRoomId })
          .value()
        const bushesView = bushes.map(BUSH => `🌱    ${BUSH.name}`).join()
        const bushesListMessageText = `Список цветов:\n${bushesView}`
        bot.sendMessage(currRoomId, bushesListMessageText)
        break
      case ACTIONS.ADD_BUSH:
        db.get('GROW_ROOMS')
          .find({ id: currRoomId })
          .assign({ inputState: INPUT_STATES.NEW_PLANT_NAME })
          .write()
        bot.sendMessage(currRoomId, 'Напиши название:')
        console.log()
        break
    }
  })

  // Messages Handling
  bot.on('message', msg => {
    const currRoomId = msg.chat.id
    const currRoom = getCurrRoom(currRoomId)

    console.log('\n---\n')
    console.log(currRoomId, currRoom, currRoom.inputState)

    switch (currRoom.inputState) {
      case INPUT_STATES.NEW_PLANT_NAME:
        const inputBush = { name: msg.text, growRoomId: currRoomId }
        const existing = db
          .get('BUSHES')
          .find(inputBush)
          .value()
        console.log(existing)
        if (!existing) {
          db.get('BUSHES')
            .push(inputBush)
            .write()
          bot.sendMessage(currRoomId, '🌳 Растение добавлено!')
          console.info(`Добавление цветка:`, inputBush)
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
