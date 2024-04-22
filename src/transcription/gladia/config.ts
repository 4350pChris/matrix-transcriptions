import z from 'zod'

export type RequestParams = {
  audio_url: string
  subtitles: boolean
  diarization: boolean
  translation: boolean
  summarization: boolean
  summarization_config: {
    type: 'general' | 'bullet_points' | 'concise'
  }
  sentences: boolean
  moderation: boolean
  audio_enhancer: boolean
  detect_language: boolean
  enable_code_switching: boolean
}

const envSchema = z.object({
  SUMMARIZE: z
    .union([z.literal('true'), z.literal('false')])
    .transform((val) => val === 'true'),
  GLADIA_TOKEN: z.string(),
  GLADIA_SUMMARIZATION_TYPE: z
    .union([
      z.literal('general'),
      z.literal('bullet_points'),
      z.literal('concise'),
    ])
    .default('concise'),
})

const envs = envSchema.parse(process.env)

export function getConfig(): Partial<RequestParams> {
  return {
    summarization: envs.SUMMARIZE,
    summarization_config: {
      type: envs.GLADIA_SUMMARIZATION_TYPE,
    },
  }
}
