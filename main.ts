import 'dotenv/config'
import { transcribeAudio } from './transcription/gladia/index.js'

async function main() {
  try {
    const transcription = await transcribeAudio('./test_files/ugly.mp3')

    console.log(transcription.full_transcript)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
main()
