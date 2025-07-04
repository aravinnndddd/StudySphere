'use server';

/**
 * @fileOverview Generates a structured study guide from summarized notes.
 *
 * - generateStudyGuide - A function that generates a study guide.
 * - GenerateStudyGuideInput - The input type for the generateStudyGuide function.
 * - GenerateStudyGuideOutput - The return type for the generateStudyGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyGuideInputSchema = z.object({
  summarizedNotes: z
    .string()
    .describe('The summarized notes to generate a study guide from.'),
});
export type GenerateStudyGuideInput = z.infer<typeof GenerateStudyGuideInputSchema>;

const GenerateStudyGuideOutputSchema = z.object({
  studyGuide: z.string().describe('The generated study guide.'),
});
export type GenerateStudyGuideOutput = z.infer<typeof GenerateStudyGuideOutputSchema>;

export async function generateStudyGuide(input: GenerateStudyGuideInput): Promise<GenerateStudyGuideOutput> {
  return generateStudyGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyGuidePrompt',
  input: {schema: GenerateStudyGuideInputSchema},
  output: {schema: GenerateStudyGuideOutputSchema},
  prompt: `You are an expert study guide creator, acting as a friendly and knowledgeable teacher. Your task is to transform the following summarized notes into a comprehensive, well-formatted study guide that is perfect for student revision.

Please follow these formatting rules carefully:
- Write in a friendly, academic tone.
- 📘Organize the content with clear markdown headings and subheadings (e.g., ## Section, ### Subsection).
- Use bold text for emphasis on key terms.
- Group related points under descriptive section titles.
- Explain concepts clearly. Avoid overly technical jargon where possible.
- Use bullet points or numbered lists (using dashes - or numbers 1.) when it enhances clarity.
- You may use emojis to add visual interest.
- End each major section with a concise summary or a practical study tip.

Summarized Notes to expand into a study guide:
{{{summarizedNotes}}}`,
});

const generateStudyGuideFlow = ai.defineFlow(
  {
    name: 'generateStudyGuideFlow',
    inputSchema: GenerateStudyGuideInputSchema,
    outputSchema: GenerateStudyGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
