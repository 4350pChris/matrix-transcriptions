import { client } from './client.js'
import type { Transcription } from './types/transcription.js'

export { runTranscription, downloadTranscription }

type TranscriptionResponse = {
  id: string
  result_url: string
}

type TranscriptionResultMetadata = {
  audio_duration: number
  number_of_distinct_channels: number
  billing_time: number
  transcription_time: number
}

type TranscriptionResult = {
  metadata: TranscriptionResultMetadata
  transcription: Transcription
}

type FetchTranscriptionResponse = {
  id: string
  request_id: string
  kind: 'pre-recorded' | 'live'
  created_at: Date
  completed_at?: Date
  status: 'queued' | 'processing' | 'done' | 'error'
  file?: File
  request_params: RequestParams
  error_code?: number
  result?: TranscriptionResult
}

type File = {
  id: string
  filename: string
  source: string
  audio_duration: number
  number_of_channels: number
}

type RequestParams = {
  audio_url: string
  subtitles: boolean
  diarization: boolean
  translation: boolean
  summarization: boolean
  sentences: boolean
  moderation: boolean
  audio_enhancer: boolean
  detect_language: boolean
  enable_code_switching: boolean
}

async function startTranscribing(audioUrl: URL) {
  const json: Partial<RequestParams> = {
    audio_url: audioUrl.toString(),
  }
  const response = await client
    .post('transcription', { json })
    .json<TranscriptionResponse>()

  return response
}

async function fetchTranscription(resultUrl: URL) {
  const response = await client
    .get(resultUrl)
    .json<FetchTranscriptionResponse>()

  return response
}

async function downloadTranscription(transcriptionId: string) {
  const response = await client
    .get(`transcription/${transcriptionId}/file`)
    .blob()

  return response
}

async function runTranscription(audioUrl: URL): Promise<TranscriptionResult> {
  const { result_url } = await startTranscribing(audioUrl)
  const resultUrl = new URL(result_url)

  let transcription = await fetchTranscription(resultUrl)

  while (transcription.status !== 'done') {
    switch (transcription.status) {
      case 'error':
        throw new Error('Transcription failed')
      case 'processing':
        console.log('Transcription in progress...')
        break
      case 'queued':
        console.log('Transcription queued...')
        break
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    transcription = await fetchTranscription(resultUrl)
  }

  const result = transcription.result

  if (!result) {
    throw new Error('Transcription failed')
  }

  return result
}
