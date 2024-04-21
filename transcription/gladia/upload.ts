import { client } from './client.js'
import { FormData } from 'formdata-node'
import { fileFromPath } from 'formdata-node/file-from-path'
import type { Options } from 'ky'

export { upload }

type UploadResponse = { audio_url: string }

async function upload(file: Options['body'] | string): Promise<URL> {
  const audio = typeof file === 'string' ? await fileFromPath(file) : file
  const body = new FormData()
  body.set('audio', audio)
  const response = await client.post('upload', { body }).json<UploadResponse>()
  const { audio_url } = response
  return new URL(audio_url)
}
