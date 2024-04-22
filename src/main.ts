import 'dotenv/config'
import { transcribeAudio } from './transcription/gladia/index.js'
import { startClients } from './matrix/client.js'
import { receiveMessages, sendMessage } from './matrix/messages.js'

async function runMatrixListener() {
  const {
    MATRIX_USER_ID,
    MATRIX_USER_ACCESS_TOKEN,
    MATRIX_BOT_ID,
    MATRIX_BOT_ACCESS_TOKEN,
    MATRIX_CHANNEL_ID,
  } = process.env
  if (
    !MATRIX_USER_ID ||
    !MATRIX_USER_ACCESS_TOKEN ||
    !MATRIX_BOT_ID ||
    !MATRIX_BOT_ACCESS_TOKEN
  ) {
    throw new Error(
      'MATRIX_USER_ID, MATRIX_ACCESS_TOKEN, MATRIX_BOT_ID or MATRIX_BOT_ACCESS_TOKEN is not set',
    )
  }

  const { userClient, botClient } = await startClients({
    user: { userId: MATRIX_USER_ID, accessToken: MATRIX_USER_ACCESS_TOKEN },
    bot: { userId: MATRIX_BOT_ID, accessToken: MATRIX_BOT_ACCESS_TOKEN },
  })

  if (!MATRIX_CHANNEL_ID || !userClient) {
    return
  }

  receiveMessages(userClient, async (blob, sender) => {
    try {
      const { transcription, summarization } = await transcribeAudio(blob)

      console.log(summarization.results)
      console.log('--------------------')
      console.log(transcription.full_transcript)

      let message = `${sender}:\n\n`

      if (summarization.results) {
        message += `SUMMARY:\n${summarization.results}\n\n`
      }
      message += transcription.full_transcript
      sendMessage(botClient, MATRIX_CHANNEL_ID, message)
    } catch (error) {
      console.error(error)
    }
  })
}

async function runForever() {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

async function main() {
  await runMatrixListener()

  await runForever()
}
main()
