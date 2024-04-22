import * as sdk from 'matrix-js-sdk'
import { logger } from 'matrix-js-sdk/lib/logger.js'
import { autoJoinRooms } from './messages.js'

export { startClients }

logger.disableAll()

type Auth = {
  userId: string
  accessToken: string
}

function createAuthClient({ userId, accessToken }: Auth) {
  const baseUrl = process.env.MATRIX_HOST

  if (!baseUrl) {
    throw new Error('MATRIX_HOST is not set')
  }

  return sdk.createClient({
    baseUrl,
    userId,
    accessToken,
  })
}

async function startClients({ user, bot }: { user: Auth; bot: Auth }) {

  const botClient = createAuthClient(bot)
  await botClient.startClient()
  console.log('Matrix bot client started')

  if (!process.env.MATRIX_CHANNEL_ID) {
    console.log(
      'MATRIX_CHANNEL_ID is not set. Waiting for the first message to join a room. You need to observe these logs to get it and then restart the bot after fillling in MATRIX_CHANNEL_ID in your .env file.',
    )
    autoJoinRooms(botClient)
    return { userClient: null, botClient }
  }

  const userClient = createAuthClient(user)
  await userClient.startClient()
  console.log('Matrix user client started')

  return { userClient, botClient }
}
