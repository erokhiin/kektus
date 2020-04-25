export const ACTIONS = Object.freeze({
  BUSHES_LIST: 'BUSHES_LIST',
  ADD_BUSH: 'ADD_BUSH',
})

export const INPUT_STATES = Object.freeze({
  NEW_BUSH_NAME: 'NEW_BUSH_NAME',
  NEW_BUSH_SCHEDULE: 'NEW_BUSH_SCHEDULE',
})
export const SCHEDULES = Object.freeze({
  EACH_3_DAYS: 'EACH_3_DAYS',
  EACH_WEEK: 'EACH_WEEK',
})
export const SCHEDULE_TIMES = {
  [SCHEDULES.EACH_3_DAYS]: '*/30 12 */3 * *',
  [SCHEDULES.EACH_WEEK]: '*/30 12 */7 * *',
}
