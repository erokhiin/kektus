import { ACTIONS, SCHEDULES } from './enums'
export const SCHEDULER_MENU = [
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

export const MAIN_MENU = [
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
  // [
  //   {
  //     text: 'Test message ✉️',
  //     callback_data: ACTIONS.SEND_NOTIFICATION,
  //   },
  // ],
]

export const NOTIFICATION_MENU = [
  [
    {
      text: 'Отметить полив 💦',
      callback_data: ACTIONS.MARK_WATERING,
    },
  ],
  // [
  //   {
  //     text: 'Отложить 😴',
  //     callback_data: ACTIONS.TO_DELAY,
  //   },
  // ],
]
