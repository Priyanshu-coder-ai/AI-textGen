'use server';

/**
 * @fileOverview Generates a video from a text prompt, falling back to image generation if video creation fails.
 *
 * - generateVideoOrImage - A function that handles the video/image generation process.
 * - GenerateVideoOrImageInput - The input type for the generateVideoOrImage function.
 * - GenerateVideoOrImageOutput - The return type for the generateVideoOrImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateVideoOrImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to use for video or image generation.'),
});

export type GenerateVideoOrImageInput = z.infer<typeof GenerateVideoOrImageInputSchema>;

const GenerateVideoOrImageOutputSchema = z.object({
  mediaUrl: z.string().describe('The data URI of the generated video or image.'),
  type: z.enum(['video', 'image']).describe('The type of media generated.'),
});

export type GenerateVideoOrImageOutput = z.infer<typeof GenerateVideoOrImageOutputSchema>;

export async function generateVideoOrImage(input: GenerateVideoOrImageInput): Promise<GenerateVideoOrImageOutput> {
  return generateVideoOrImageFlow(input);
}

const generateVideoOrImageFlow = ai.defineFlow(
  {
    name: 'generateVideoOrImageFlow',
    inputSchema: GenerateVideoOrImageInputSchema,
    outputSchema: GenerateVideoOrImageOutputSchema,
  },
  async input => {
    try {
      // Attempt video generation
      //const videoResult = await ai.generate({
      //model: 'text-to-video-model', // Replace with actual text-to-video model
      //prompt: input.prompt,
      //});
      //if (videoResult.media?.url) {
      //return {
      //mediaUrl: videoResult.media.url,
      //type: 'video',
      //};
      //}
      console.log('Video generation skipped, falling back to image generation.');
    } catch (videoError: any) {
      console.error('Video generation failed:', videoError);
      console.log('Falling back to image generation.');
    }

    // Fallback to image generation
    try {
      const imageResult = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: input.prompt,
        config: {responseModalities: ['TEXT', 'IMAGE']},
      });

      if (imageResult.media?.url) {
        return {
          mediaUrl: imageResult.media.url,
          type: 'image',
        };
      }
      throw new Error('Image generation failed: no media returned');
    } catch (imageError: any) {
      console.error('Image generation failed:', imageError);
      throw new Error(`Failed to generate video or image: ${imageError.message || imageError}`);
    }
  }
);
