'use server';

import { generateVideo, type GenerateVideoOutput } from '@/ai/flows/generate-video';

export type FormState = {
  data: GenerateVideoOutput | null;
  error: string | null;
  timestamp: number;
};

export async function generateContentAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const prompt = formData.get('prompt') as string;

  if (!prompt || prompt.trim().length === 0) {
    return { data: null, error: 'Please enter a prompt.', timestamp: Date.now() };
  }

  try {
    const result = await generateVideo({ prompt });
    if (result.error) {
      return { data: null, error: result.error, timestamp: Date.now() };
    }
    return { data: result, error: null, timestamp: Date.now() };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unknown error occurred.', timestamp: Date.now() };
  }
}
