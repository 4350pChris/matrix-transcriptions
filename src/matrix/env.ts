import z from 'zod'

const envSchema = z.object({
  MATRIX_HOST: z.string().min(1, 'Matrix host is required'),
  MATRIX_USER_ID: z.string().min(1, 'Matrix user ID is required'),
  MATRIX_USER_ACCESS_TOKEN: z
    .string()
    .min(1, 'Matrix user access token is required'),
  MATRIX_BOT_ID: z.string().min(1, 'Matrix bot ID is required'),
  MATRIX_BOT_ACCESS_TOKEN: z
    .string()
    .min(1, 'Matrix bot access token is required'),
  MATRIX_CHANNEL_ID: z.string().optional(),
})

export const envs = envSchema.parse(process.env)
