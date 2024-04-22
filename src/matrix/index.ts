import { startClients } from './client.js'
import { receiveMessages, sendMessage } from './messages.js'

export async function runMatrixTranscriber(
  transcribeAudio: (blob: Blob) => Promise<string>,
) {
  const { userClient, botClient, channelId } = await startClients()

  if (!userClient || !channelId) {
    return
  }

  receiveMessages(userClient, async (blob, sender) => {
    try {
      const transcribed = await transcribeAudio(blob)
      const message = `From: ${sender}\n\n${transcribed}`
      await sendMessage(botClient, channelId, message)
    } catch (error) {
      console.error(error)
    }
  })
}
