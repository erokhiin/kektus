import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

import {Bush} from  './models/Bush'

type GrowRoom = {
  id: number
  processingBushName?: string
  processingBushId?: number
  inputState?: string
}


type Schema = {
  BUSHES: Bush[]
  GROW_ROOMS: GrowRoom[]
}

const adapter = new FileSync<Schema>('db.json')
const db = low(adapter)
db.defaults({ BUSHES: [], GROW_ROOMS: [] }).write()

const findRoom = (id: number) => db.get('GROW_ROOMS').find({ id })
export const findRoomValue = (id: number) => findRoom(id).value()
export const addGrowRoom = (id: number) =>
  db.get('GROW_ROOMS').push({ id }).write()

export const changeInputState = (growRoomId: number, inputState: string) =>
  db.get('GROW_ROOMS').find({ id: growRoomId }).assign({ inputState }).write()

export const changeBushSchedule = (bushId: number, schedule: string) =>
  db.get('BUSHES').find({ id: bushId }).assign({ schedule }).write()

export const isExistingName = (growRoomId: number, bushName: string) =>
  !!db.get('BUSHES').filter({ growRoomId }).find({ name: bushName }).value()
export const getGrowRoomBushes = (growRoomId: number) =>
  db.get('BUSHES').filter({ growRoomId: growRoomId }).value()

export const getGrowRoomBushesSize = (growRoomId: number) =>
  db.get('BUSHES').filter({ growRoomId }).size().value()
export const addBush = (bush: Bush) => db.get('BUSHES').push(bush).write()

export const changeCommandState = (growRoomId: number, state: string) =>
  db
    .get('GROW_ROOMS')
    .find({ id: growRoomId })
    .assign({ inputState: state })
    .write()

export const changeProcessingBushId = (growRoomId: number, bushId?: number) =>
  db
    .get('GROW_ROOMS')
    .find({ id: growRoomId })
    .assign({ processingBushId: bushId ?? undefined })
    .write()
