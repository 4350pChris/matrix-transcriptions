import { fal } from "@fal-ai/client";
import type { TranscribeAudio } from '../types.js';

const FALAI_API_KEY = process.env.FALAI_API_KEY;

fal.config({ credentials: FALAI_API_KEY })

export const transcribeAudio: TranscribeAudio = async (blob): ReturnType<TranscribeAudio> => {
  const result = await fal.subscribe('fal-ai/wizper', {
    input: {
      audio_url: blob,
      language: 'de',
      task: 'transcribe',
    },
    onQueueUpdate(update) {
      if (update.status === 'IN_QUEUE') {
        console.log(`In queue: ${update.queue_position}`);
      } else if (update.status === 'IN_PROGRESS') {
        update.logs?.map((log) => log.message).forEach(console.log);
      }
    },
  })

  const transcription = result.data.text;

  return { transcription, summarization: null }
}
