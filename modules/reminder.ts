import { bot } from '../server'
import { getBush, updateLastNotification } from '../utils/dbController'
import { NOTIFICATION_MENU } from '../utils/templates'

export const sendNotification = (bushId: string) => {
  const bush = getBush(bushId)
  const notificationText = `👀 It's time to water ${bush.name}`
  bot
    .sendMessage(bush.growRoomId, notificationText, {
      reply_markup: {
        inline_keyboard: NOTIFICATION_MENU(bushId),
      },
    })
    .then(() => updateLastNotification(bushId, new Date()))
}
