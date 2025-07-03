'use server';

/**
 * @fileOverview Summarizes uploaded notes into concise bullet points.
 *
 * - summarizeNotes - A function that summarizes lecture notes.
 * - SummarizeNotesInput - The input type for the summarizeNotes function.
 * - SummarizeNotesOutput - The return type for the summarizeNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNotesInputSchema = z.object({
  notes: z
    .string()
    .describe('The lecture notes to summarize.'),
});
export type SummarizeNotesInput = z.infer<typeof SummarizeNotesInputSchema>;

const SummarizeNotesOutputSchema = z.object({
  summary: z.string().describe('The summarized notes in a friendly, well-formatted structure.'),
});
export type SummarizeNotesOutput = z.infer<typeof SummarizeNotesOutputSchema>;

export async function summarizeNotes(input: SummarizeNotesInput): Promise<SummarizeNotesOutput> {
  return summarizeNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: {schema: SummarizeNotesInputSchema},
  output: {schema: SummarizeNotesOutputSchema},
  prompt: `You are an expert in creating structured study materials. Your goal is to summarize the provided notes into a clear, engaging, and easy-to-digest format for a student.

Please adhere to the following guidelines for your output:
- Adopt a friendly and academic tone, like a helpful teacher.
- Use clear headings and subheadings to structure the content.
- Group related concepts into logical sections.
- Use bullet points only when necessary for lists of items.
- 📘 Use emojis to add visual cues and break up the text.
- 💡 At the end of each major section, provide a one-line summary or a helpful tip.
- Do not use JSON or code-like formatting.

The goal is to create a preliminary summary that is well-formatted and ready for a student to review before generating a more detailed study plan.

Notes to summarize:
{{{notes}}}`,
});

const summarizeNotesFlow = ai.defineFlow(
  {
    name: 'summarizeNotesFlow',
    inputSchema: SummarizeNotesInputSchema,
    outputSchema: SummarizeNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
