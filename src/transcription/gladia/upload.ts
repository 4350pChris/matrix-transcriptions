import { client } from './client.js'
import { FormData } from 'formdata-node'
import { fileFromPath } from 'formdata-node/file-from-path'

export { upload }

type UploadResponse = { audio_url: string }

async function upload(blob: Blob): Promise<URL> {
  const body = new FormData()
  body.set('audio', blob)
  const response = await client.post('upload', { body: body as BodyInit }).json<UploadResponse>()
  const { audio_url } = response
  return new URL(audio_url)
}
