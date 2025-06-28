'use server';

import { generateImage } from '@/ai/flows/generate-image';
import { improvePrompt } from '@/ai/flows/improve-prompt';

export type ContentResult = {
  type: 'image';
  dataUri: string;
};

export type FormState = {
  result: ContentResult | null;
  improvedPrompt: string | null;
  error: string | null;
  timestamp: number;
};

export async function generateContentAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const prompt = formData.get('prompt') as string;
  const action = formData.get('action') as 'image' | 'improve' | null;

  if (!prompt || prompt.trim().length === 0) {
    return { result: null, improvedPrompt: null, error: 'Please enter a prompt.', timestamp: Date.now() };
  }

  if (!action) {
    return { result: null, improvedPrompt: null, error: 'Please select an action.', timestamp: Date.now() };
  }

  try {
    if (action === 'image') {
      const result = await generateImage({ prompt });
      return { result: { type: 'image', dataUri: result.imageDataUri }, improvedPrompt: null, error: null, timestamp: Date.now() };
    } else if (action === 'improve') {
      const { improvedPrompt } = await improvePrompt({ prompt });
      return { result: null, improvedPrompt, error: null, timestamp: Date.now() };
    }
    return { result: null, improvedPrompt: null, error: 'Invalid action specified.', timestamp: Date.now() };
  } catch (e: any) {
    console.error(e);
    return { result: null, improvedPrompt: null, error: e.message || 'An unknown error occurred.', timestamp: Date.now() };
  }
}
