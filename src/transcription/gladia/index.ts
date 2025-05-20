import { TranscribeAudio } from '../types.js'
import { runTranscription } from './transcribe.js'
import { upload } from './upload.js'

export const transcribeAudio: TranscribeAudio = async (
  blob
): ReturnType<TranscribeAudio> => {
  const uploadUrl = await upload(blob)
  return runTranscription(uploadUrl)
}
