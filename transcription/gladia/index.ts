import { runTranscription } from './transcribe.js'
import { uploadFile } from './upload.js'
import type { Transcription } from './types/transcription.js'

export async function transcribeAudio(path: string): Promise<Transcription> {
  const uploadUrl = await uploadFile(path)
  const transcriptionResult = await runTranscription(uploadUrl)

  return transcriptionResult.transcription
}
