import { ACTIONS, SCHEDULES } from './enums'
export const SCHEDULER_MENU = [
  [
    {
      callback_data: SCHEDULES.EACH_DAY,
      text: 'Each day',
    },
  ],
  [
    {
      callback_data: SCHEDULES.EACH_4_DAYS,
      text: 'Each four days',
    },
  ],
  [
    {
      callback_data: SCHEDULES.EACH_5_DAYS,
      text: 'Each five days',
    },
  ],
  [
    {
      callback_data: SCHEDULES.EACH_WEEK,
      text: 'Each week',
    },
  ],
]


export const EDIT_MENU = [
  [
    {
      callback_data: ACTIONS.EDIT,
      text: 'Edit',
    },
  ],
  [
    {
      callback_data: ACTIONS.CANCEL,
      text: 'Cancel',
    },
  ],
]

export const MAIN_MENU = [
  [
    {
      text: 'Plant list',
      callback_data: ACTIONS.BUSHES_LIST,
    },
  ],
  [
    {
      text: 'Add plant',
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
