import * as sdk from 'matrix-js-sdk'
import { logger } from 'matrix-js-sdk/lib/logger.js'

export { startClient }

logger.disableAll()

async function startClient() {
  const baseUrl = process.env.MATRIX_HOST

  if (!baseUrl) {
    throw new Error('MATRIX_HOST is not set')
  }

  const client = sdk.createClient({
    baseUrl,
    userId: process.env.MATRIX_USER_ID,
    accessToken: process.env.MATRIX_ACCESS_TOKEN,
  })

  await client.startClient()

  console.log('Matrix client started')

  return client
}

function closeClient(client: sdk.MatrixClient) {
  client.stopClient()
  console.log('Matrix client stopped')
}
