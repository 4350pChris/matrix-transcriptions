import { runTranscription } from './transcribe.js'
import { upload } from './upload.js'

export async function transcribeAudio(
  ...uploadArgs: Parameters<typeof upload>
): Promise<string> {
  const uploadUrl = await upload(...uploadArgs)
  const { transcription, summarization } = await runTranscription(uploadUrl)

  console.log(summarization.results)
  console.log('--------------------')
  console.log(transcription.full_transcript)

  let message = ''

  if (
    summarization.success &&
    !summarization.is_empty &&
    summarization.results
  ) {
    message += `Summary:\n${summarization.results}\n\n`
  }
  message += transcription.full_transcript

  return message
}
