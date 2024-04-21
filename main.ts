import 'dotenv/config'
import { transcribeAudio } from './transcription/gladia/index.js'
import { startClient } from './matrix/client.js'
import { receiveMessages } from './matrix/messages.js'

async function runMatrixListener() {
  const client = await startClient()
  receiveMessages(client, async (blob) => {
    try {
      const transcription = await transcribeAudio(blob)
      console.log(transcription.full_transcript)
      // const transcription = await transcribeAudio('./test_files/ugly.mp3')
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
