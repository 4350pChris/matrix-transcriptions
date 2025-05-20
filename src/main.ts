import 'dotenv/config'
import { transcribeAudio as gladia } from './transcription/gladia/index.js'
import {transcribeAudio as deepgram } from './transcription/deepgram/index.js'
import { runMatrixTranscriber } from './matrix/index.js'

async function runForever() {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

async function main() {
  const fn = deepgram;
  await runMatrixTranscriber(fn)

  await runForever()
}
main()
