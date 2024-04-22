import * as sdk from 'matrix-js-sdk'
import { logger } from 'matrix-js-sdk/lib/logger.js'
import { autoJoinRooms } from './messages.js'
import { envs } from './env.js'

export { startClients }

logger.disableAll()

type Auth = {
  userId: string
  accessToken: string
}

async function startClients() {
  const {
    MATRIX_HOST,
    MATRIX_BOT_ACCESS_TOKEN,
    MATRIX_BOT_ID,
    MATRIX_USER_ACCESS_TOKEN,
    MATRIX_USER_ID,
    MATRIX_CHANNEL_ID,
  } = envs
  const botClient = sdk.createClient({
    baseUrl: MATRIX_HOST,
    userId: MATRIX_BOT_ID,
    accessToken: MATRIX_BOT_ACCESS_TOKEN,
  })
  await botClient.startClient()
  console.log('Matrix bot client started')

  if (!MATRIX_CHANNEL_ID) {
    console.log(
      'MATRIX_CHANNEL_ID is not set. Waiting for the first message to join a room. You need to observe these logs to get it and then restart the bot after fillling in MATRIX_CHANNEL_ID in your .env file.',
    )
    autoJoinRooms(botClient)
    return { userClient: null, botClient }
  }

  const userClient = sdk.createClient({
    baseUrl: MATRIX_HOST,
    userId: MATRIX_USER_ID,
    accessToken: MATRIX_USER_ACCESS_TOKEN,
  })
  await userClient.startClient()
  console.log('Matrix user client started')

  return { userClient, botClient, channelId: MATRIX_CHANNEL_ID }
}
