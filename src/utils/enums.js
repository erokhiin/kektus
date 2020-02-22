const ACTIONS = Object.freeze({
  BUSHES_LIST: 'BUSHES_LIST',
  ADD_BUSH: 'ADD_BUSH',
})

const INPUT_STATES = Object.freeze({
  NEW_BUSH_NAME: 'NEW_BUSH_NAME',
  NEW_BUSH_SCHEDULE: 'NEW_BUSH_SCHEDULE',
})
const SCHEDULES = Object.freeze({
  EACH_3_DAYS: 'EACH_3_DAYS',
  EACH_WEEK: 'EACH_WEEK',
})
const SCHEDULE_TIMES = {
  [SCHEDULES.EACH_3_DAYS]: '*/30 12 */3 * *',
  [SCHEDULES.EACH_WEEK]: '*/30 12 */7 * *',
}

module.exports = {
  SCHEDULE_TIMES,
  SCHEDULES,
  ACTIONS,
  INPUT_STATES,
}
