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
  // subtitles: string[]
  utterances: Utterance[]
}

