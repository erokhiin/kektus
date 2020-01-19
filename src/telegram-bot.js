const TelegramBot = require('node-telegram-bot-api')

const ACTIONS = Object.freeze({
  BUSHES_LIST: 'BUSHES_LIST',
  ADD_BUSH: 'ADD_BUSH',
})

let MAIN_MENU = [
  [
    {
      text: 'Список цветов',
      callback_data: ACTIONS.ADD_BUSH,
    },
  ],
  [
    {
      text: 'Добавить цветок',
      callback_data: ACTIONS.BUSHES_LIST,
    },
  ],
]

module.exports = startTelegramBot = ({ token, db }) => {
  // replace the value below with the Telegram token you receive from @BotFather
  // const token = 'YOUR_TELEGRAM_BOT_TOKEN';
  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(token, { polling: true })

  // Matches "/echo [whatever]"
  bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id
    const resp = match[1] // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp)
  })

  // Listen for any kind of message. There are different kinds of

  bot.on('callback_query', query => {
    console.log('\n---\n')
    console.log(query)
    switch (query.data) {
      case ACTIONS.BUSHES_LIST:
        console.log(ACTIONS.BUSHES_LIST)
        break
      case ACTIONS.ADD_BUSH:
        console.log(ACTIONS.ADD_BUSH)
        break
    }
  })

  // messages.
  bot.on('message', msg => {
    const chatId = msg.chat.id
    console.log('\n---\n')
    console.log(msg)
    bot.sendMessage(chatId, '123', {
      //   chat_id: msg.chat.id,
      //   text: '123',
      reply_markup: {
        inline_keyboard: MAIN_MENU,
      },
    })
    // bot.editMessageReplyMarkup({ inline_keyboard: [[{ text: 'kekeke' }]] })
    // send a message to the chat acknowledging receipt of their message
    // bot.sendMessage(chatId, 'Received your message')
  })
}
