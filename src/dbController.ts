import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

import { Bush } from './models/Bush'

type GrowRoom = {
  id: number
  currentBushName?: string
  state?: string
}

type Schema = {
  BUSHES: Bush[]
  GROW_ROOMS: GrowRoom[]
}

// prepare
const adapter = new FileSync<Schema>('db.json')
const db = low(adapter)
db.defaults({ BUSHES: [], GROW_ROOMS: [] }).write()

// methods
export const findRoomValue = (id: number) =>
  db.get('GROW_ROOMS').find({ id }).value()

export const addGrowRoom = (id: number) =>
  db.get('GROW_ROOMS').push({ id }).write()

export const changeGrowRoomState = (growRoomId: number, state: string) =>
  db.get('GROW_ROOMS').find({ id: growRoomId }).assign({ state }).write()

export const changeGrowRoomCurrentBushName = (
  growRoomId: number,
  name: string,
) =>
  db
    .get('GROW_ROOMS')
    .find({ id: growRoomId })
    .assign({ currentBushName: name })
    .write()

export const isExistingName = (growRoomId: number, bushName: string) =>
  !!db.get('BUSHES').filter({ growRoomId }).find({ name: bushName }).value()

export const getBush = (bushId: string) =>
  db.get('BUSHES').find({ id: bushId }).value()

export const getGrowRoomBushesSize = (growRoomId: number) =>
  db.get('BUSHES').filter({ growRoomId }).size().value()

export const markWatering = (bushId: string, lastWatering: Date) =>
  db.get('BUSHES').find({ id: bushId }).assign({ lastWatering }).write()

export const updateLastNotification = (
  bushId: string,
  notificationTime: Date,
) =>
  db
    .get('BUSHES')
    .find({ id: bushId })
    .assign({ lastNotification: notificationTime })
    .write()
export const getBushByName = (growRoomId: number, bushName: string) =>
  db.get('BUSHES').filter({ growRoomId }).find({ name: bushName }).value()

export const getBushes = () => db.get('BUSHES').value()

export const getGrowRoomBushes = (growRoomId: number) =>
  db.get('BUSHES').filter({ growRoomId: growRoomId }).value()

export const addBush = (bush: Bush) => db.get('BUSHES').push(bush).write()

export const updateBush = (bushId: string, data: Partial<Omit<Bush, 'id'>>) => {
  const bushDB = db.get('BUSHES').find({ id: bushId })
  bushDB.assign({ ...bushDB.value(), ...data }).write()
}

export const changeCommandState = (growRoomId: number, state: string) =>
  db
    .get('GROW_ROOMS')
    .find({ id: growRoomId })
    .assign({ inputState: state })
    .write()
