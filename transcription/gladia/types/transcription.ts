export type StartEndConfidence = {
  start: number
  end: number
  confidence: number
}

export type Word = StartEndConfidence & {
  word: string
}

export type Utterance = StartEndConfidence & {
  text: string
  language: string
  channel: number
  speaker?: number
  words: Word[]
}

export type Transcription = {
  full_transcript: string
  languagues: string[]
  utterances: Utterance[]
}

export type Summarization = {
  success: boolean
  is_empty: boolean
  exec_time: number
  error: {
    status_code: number
    exception: string
    message: string
  }
  results: string | null
}
