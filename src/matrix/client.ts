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
  const userClient = createAuthClient(user)
  const botClient = createAuthClient(bot)

  autoJoinRooms(botClient)

  await botClient.startClient()
  console.log('Matrix bot client started')
  await userClient.startClient()
  console.log('Matrix user client started')

  return { userClient, botClient }
}
