'use server';
/**
 * @fileOverview Generates an image from a text prompt.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to use for image generation.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    try {
      const imageResult = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: input.prompt,
        config: {responseModalities: ['TEXT', 'IMAGE']},
      });

      if (imageResult.media?.url) {
        return {
          imageDataUri: imageResult.media.url,
        };
      }
      throw new Error('Image generation failed: no media returned');
    } catch (imageError: any) {
      console.error('Image generation failed:', imageError);
      throw new Error(`Failed to generate image: ${imageError.message || imageError}`);
    }
  }
);
