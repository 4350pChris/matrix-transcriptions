import { runTranscription } from './transcribe.js'
import { upload } from './upload.js'
import type { Transcription } from './types/transcription.js'

export async function transcribeAudio(
  ...uploadArgs: Parameters<typeof upload>
): Promise<Transcription> {
  const uploadUrl = await upload(...uploadArgs)
  const transcriptionResult = await runTranscription(uploadUrl)

  return transcriptionResult.transcription
}
