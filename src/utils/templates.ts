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
]
