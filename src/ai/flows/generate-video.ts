'use server';
/**
 * @fileOverview Generates a video from a text prompt.
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
      "The generated video as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
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
  async (input) => {
    // This is a placeholder. Real video generation would go here.
    // For now, we inform the user that this feature is not implemented.
    throw new Error('Video generation is not yet available. Please try generating an image instead.');
  }
);
