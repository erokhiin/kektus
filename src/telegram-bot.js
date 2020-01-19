const TelegramBot = require('node-telegram-bot-api')

const ACTIONS = Object.freeze({
  BUSHES_LIST: 'BUSHES_LIST',
  ADD_BUSH: 'ADD_BUSH',
})

let MAIN_MENU = [
  [
    {
      text: 'Добавить цветок',
      callback_data: ACTIONS.ADD_BUSH,
    },
  ],
  [
    {
      text: 'Список цветов',
      callback_data: ACTIONS.BUSHES_LIST,
    },
  ],
]

module.exports = startTelegramBot = ({ token, db }) => {
  const bot = new TelegramBot(token, { polling: true })

  bot.on('callback_query', query => {
    const chatId = query.message.chat.id

    switch (query.data) {
      case ACTIONS.BUSHES_LIST:
        const BUSHES = db.get('BUSHES').value()
        const bushesView = BUSHES.map(BUSH => `🌱    ${BUSH.name}`).join()
        const bushesListMessageText = `Список цветов:\n${bushesView}`
        bot.sendMessage(chatId, bushesListMessageText)
        break
      case ACTIONS.ADD_BUSH:
        break
    }
  })

  // messages.
  bot.onText(/\/menu$/, msg => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, 'Меню:', {
      reply_markup: {
        inline_keyboard: MAIN_MENU,
      },
    })
  })

  bot.on('polling_error', err => console.log(err))
}
