import { bot } from 'index'
import { getBush, updateLastNotification } from 'dbController'
import { NOTIFICATION_MENU } from 'utils/templates'

export const sendNotification = (growRoomId: number, bushId: string) => {
  const currentDate = new Date()
  const bush = getBush(bushId)
  const notificationText = `Время полить растение ${bush.name} 🌱`
  updateLastNotification(bushId, currentDate)
  bot.sendMessage(growRoomId, notificationText, {
    reply_markup: {
      inline_keyboard: NOTIFICATION_MENU,
    },
  })
}
