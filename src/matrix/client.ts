import * as sdk from 'matrix-js-sdk'
import { logger } from 'matrix-js-sdk/lib/logger.js'
import { autoJoinRooms } from './messages.js'

export { startClient }

logger.disableAll()

async function startClient(userId: string, accessToken: string) {
  const baseUrl = process.env.MATRIX_HOST

  if (!baseUrl) {
    throw new Error('MATRIX_HOST is not set')
  }

  const client = sdk.createClient({
    baseUrl,
    userId,
    accessToken,
  })

  autoJoinRooms(client)

  await client.startClient()

  console.log('Matrix client started')

  return client
}
