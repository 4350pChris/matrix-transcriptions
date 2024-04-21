import { client } from './client.js'
import { FormData } from 'formdata-node'
import { fileFromPath } from 'formdata-node/file-from-path'

export { uploadFile }

type UploadResponse = { audio_url: string }

async function sendAudioStream(path: string): Promise<UploadResponse> {
  const file = await fileFromPath(path)
  const body = new FormData()
  body.set('audio', file)
  return client.post('upload', { body }).json<UploadResponse>()
}

async function uploadFile(path: string) {
  const response = await sendAudioStream(path)
  const { audio_url } = response
  return new URL(audio_url)
}
