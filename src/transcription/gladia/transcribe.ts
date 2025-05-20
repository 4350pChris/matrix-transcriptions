import { TranscribeAudio } from '../types.js'
import { client } from './client.js'
import { getConfig, type RequestParams } from './config.js'
import type { Summarization, Transcription } from './types/transcription.js'

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
  summarization?: Summarization
}

type FetchTranscriptionResponse = {
  id: string
  request_id: string
  kind: 'pre-recorded' | 'live'
  created_at: string
  completed_at?: string
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

async function startTranscribing(
  audioUrl: URL,
  config: Partial<RequestParams> = {},
) {
  const json: Partial<RequestParams> = {
    audio_url: audioUrl.toString(),
    ...config,
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

async function runTranscription(audioUrl: URL): ReturnType<TranscribeAudio> {
  const config = getConfig()
  const { result_url } = await startTranscribing(audioUrl, config)
  const resultUrl = new URL(result_url)

  let res = await fetchTranscription(resultUrl)

  while (res.status !== 'done') {
    const timeElapsed = Date.now() - new Date(res.created_at).getTime()
    const secondsElapsed = timeElapsed / 1000
    switch (res.status) {
      case 'error':
        throw new Error('Transcription failed')
      case 'processing':
        console.log(`(${secondsElapsed}s) Transcription in progress...`)
        break
      case 'queued':
        console.log(`(${secondsElapsed}s) Transcription queued...`)
        break
    }
    await new Promise((resolve) => setTimeout(resolve, 5000))
    res = await fetchTranscription(resultUrl)
  }

  const { transcription, summarization } = res.result ?? {}

  if (!transcription || !summarization) {
    throw new Error('Transcription failed but status was done')
  }

  return { transcription: transcription.full_transcript, summarization: summarization.results }
}
