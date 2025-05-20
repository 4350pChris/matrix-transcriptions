export type TranscribeAudio = (
  blob: Blob
) => Promise<{
  transcription: string
  summarization: string | null | undefined
}>;
