import { runTranscription } from './transcribe.js'
import { upload } from './upload.js'

export async function transcribeAudio(
  ...uploadArgs: Parameters<typeof upload>
): ReturnType<typeof runTranscription> {
  const uploadUrl = await upload(...uploadArgs)
  const transcription = await runTranscription(uploadUrl)

  return transcription
}
