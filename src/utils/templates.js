const { ACTIONS, SCHEDULES } = require('./enums.js')
exports.SCHEDULER_MENU = [
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

exports.MAIN_MENU = [
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
