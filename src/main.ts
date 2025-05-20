import 'dotenv/config'
import { transcribeAudio as gladia } from './transcription/gladia/index.js'
import {transcribeAudio as deepgram } from './transcription/deepgram/index.js'
import {transcribeAudio as falai } from './transcription/falai/index.js'
import { runMatrixTranscriber } from './matrix/index.js'
import { TranscribeAudio } from './transcription/types.js'

async function runForever() {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

async function main() {
  let fn: TranscribeAudio;

  switch (process.env.TRANSCRIBE_SERVICE) {
    case 'gladia':
      fn = gladia
      break
    case 'deepgram':
      fn = deepgram
      break
    case 'falai':
      fn = falai
      break
    default:
      throw new Error('TRANSCRIBE_SERVICE not set')
  }
  
  await runMatrixTranscriber(fn)

  await runForever()
}
main()
