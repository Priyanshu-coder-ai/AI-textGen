'use server';

import { generateImage } from '@/ai/flows/generate-image';
import { generateVideo } from '@/ai/flows/generate-video';

// This combined type will hold either image or video data, plus a type discriminator
export type ContentResult = {
  type: 'image' | 'video';
  dataUri: string;
};

export type FormState = {
  result: ContentResult | null;
  error: string | null;
  timestamp: number;
};

export async function generateContentAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const prompt = formData.get('prompt') as string;
  const action = formData.get('action') as 'image' | 'video' | null;

  if (!prompt || prompt.trim().length === 0) {
    return { result: null, error: 'Please enter a prompt.', timestamp: Date.now() };
  }

  if (!action) {
    return { result: null, error: 'Please select an action (image or video).', timestamp: Date.now() };
  }

  try {
    if (action === 'image') {
      const result = await generateImage({ prompt });
      return { result: { type: 'image', dataUri: result.imageDataUri }, error: null, timestamp: Date.now() };
    } else if (action === 'video') {
      // The video flow is expected to throw an error.
      const result = await generateVideo({ prompt });
      return { result: { type: 'video', dataUri: result.videoDataUri }, error: null, timestamp: Date.now() };
    }
    return { result: null, error: 'Invalid action specified.', timestamp: Date.now() };
  } catch (e: any) {
    console.error(e);
    return { result: null, error: e.message || 'An unknown error occurred.', timestamp: Date.now() };
  }
}
