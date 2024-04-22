import 'dotenv/config'
import { transcribeAudio } from './transcription/gladia/index.js'
import { runMatrixTranscriber } from './matrix/index.js'

async function runForever() {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

async function main() {
  await runMatrixTranscriber(transcribeAudio)

  await runForever()
}
main()
