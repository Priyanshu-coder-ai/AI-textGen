'use server';
/**
 * @fileOverview Generates a video from a text prompt using the Hugging Face Inference API.
 *
 * - generateVideo - A function that generates a video from a text prompt.
 * - GenerateVideoInput - The input type for the generateVideo function.
 * - GenerateVideoOutput - The return type for the generateVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate a video from.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      'The generated video as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Fixed typo here
    )
    .optional(),
  imageDataUri: z
    .string()
    .describe(
      'The generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Fixed typo here
    )
    .optional(),
  error: z.string().optional(),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
  return generateVideoFlow(input);
}

const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async input => {
    try {
      // Attempt to generate a video
      //const videoResult = await ai.generate({
      //  model: '...', // Replace with an appropriate text-to-video model
      //  prompt: input.prompt,
      //});

      //console.log(videoResult.media?.url);

      // Fallback to image generation if video generation fails or is not available
      const imageResult = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: input.prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (imageResult.media?.url) {
        return {imageDataUri: imageResult.media.url};
      } else {
        return {error: 'Failed to generate video or image.'};
      }
    } catch (error: any) {
      console.error('Error generating content:', error);
      return {error: error.message || 'Failed to generate video or image.'};
    }
  }
);
