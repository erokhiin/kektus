const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ BUSHES: [], GROW_ROOMS: [] }).write()

const findRoom = id => db.get('GROW_ROOMS').find({ id })
exports.findRoomValue = id => findRoom(id).value()
exports.addGrowRoom = id =>
  db
    .get('GROW_ROOMS')
    .push({ id })
    .write()

exports.changeInputState = (growRoomId, inputState) =>
  db
    .get('GROW_ROOMS')
    .find({ id: growRoomId })
    .assign({ inputState })
    .write()

exports.changeBushSchedule = (bushId, schedule) =>
  db
    .get('BUSHES')
    .find({ id: bushId })
    .assign({ schedule })
    .write()

exports.isExistingName = (growRoomId, bushName) =>
  !!db
    .get('BUSHES')
    .filter({ growRoomId })
    .find({ name: bushName })
    .value()
exports.getGrowRoomBushes = growRoomId =>
  db
    .get('BUSHES')
    .filter({ growRoomId: growRoomId })
    .value()

exports.getGrowRoomBushesSize = growRoomId =>
  db
    .get('BUSHES')
    .filter({ growRoomId })
    .size()
    .value()
exports.addBush = bush =>
  db
    .get('BUSHES')
    .push(bush)
    .write()

exports.changeCommandState = (growRoomId, state) =>
  db
    .get('GROW_ROOMS')
    .find({ id: growRoomId })
    .assign({ inputState: state })
    .write()

exports.changeProcessingBushId = (growRoomId, bushId) =>
  db
    .get('GROW_ROOMS')
    .find({ id: growRoomId })
    .assign({ processingBushId: bushId })
    .write()
