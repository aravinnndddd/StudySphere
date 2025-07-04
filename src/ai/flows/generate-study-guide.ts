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
- 📘 Organize the content with clear section titles. Do not use markdown headings (like ##). Use plain text for titles.
- Group related points under descriptive section titles.
- Explain concepts clearly. Avoid overly technical jargon where possible.
- Use bullet points or numbered lists sparingly, using simple dashes (-) when it enhances clarity (e.g., for steps in a process or a list of examples).
- ✅ Use emojis like 💡, ✅, and 📘 to add visual interest and highlight key information.
- End each major section with a concise summary or a practical study tip.
- Ensure the final output is clean and easy to read, without any markdown, JSON or code-like formatting.

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
