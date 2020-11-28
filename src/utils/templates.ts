import { Action, ACTIONS, SCHEDULES } from './enums'
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

export const MAIN_MENU = [
  [
    {
      text: '🌱 Plant list',
      callback_data: ACTIONS.BUSHES_LIST,
    },
  ],
  [
    {
      text: '➕ Add plant',
      callback_data: ACTIONS.ADD_BUSH,
    },
  ],
]

export const NOTIFICATION_MENU = (id: string) => [
  [
    {
      text: '💦 I watered the plant 💦',
      callback_data: `${ACTIONS.MARK_WATERING}/${id}`,
    },
  ],
]

export const CONFIRMATION_MENU = (
  confirmAction: Action,
  cancelAction: Action,
  data: string,
) => [
  [
    {
      text: 'Confirm',
      callback_data: `${confirmAction}/${data}`,
    },
  ],
  [
    {
      text: 'Cancel',
      callback_data: cancelAction,
    },
  ],
]
