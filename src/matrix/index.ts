import { startClients } from './client.js'
import { receiveMessages, sendMessage } from './messages.js'
import type { TranscribeAudio } from '../transcription/types.js'

export async function runMatrixTranscriber(
  transcribeAudio: TranscribeAudio,
) {
  const { userClient, botClient, channelId } = await startClients()

  if (!userClient || !channelId) {
    return
  }

  receiveMessages(userClient, async (blob, sender) => {
    try {
      const {summarization, transcription} = await transcribeAudio(blob)
      console.log(summarization)
      console.log('--------------------')
      console.log(transcription)

      let transcribed = ''

      if (
        summarization
      ) {
        transcribed += `Summary:\n${summarization}\n\n`
      }
      transcribed += transcription

      const message = `From: ${sender}\n\n${transcribed}`

      await sendMessage(botClient, channelId, message)
    } catch (error) {
      console.error(error)
    }
  })
}
