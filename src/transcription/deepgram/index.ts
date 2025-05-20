import { createClient } from '@deepgram/sdk'
import { TranscribeAudio } from '../types.js'

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY


export const transcribeAudio: TranscribeAudio = async (
  blob
): ReturnType<TranscribeAudio> => {
  const client = createClient(DEEPGRAM_API_KEY)
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { result, error } = await client.listen.prerecorded.transcribeFile(buffer, {
    model: 'nova-3',
    language: 'multi',
    smart_format: true,
    punctuate: true,
  })
  if (error) {
    throw new Error(`Deepgram error: ${error.message}`)
  }
  const alt = result.results.channels[0].alternatives[0]
  const transcription = alt.paragraphs?.transcript ?? alt.transcript
  const summarization = result.results.summary?.short

  return { transcription, summarization }
}
