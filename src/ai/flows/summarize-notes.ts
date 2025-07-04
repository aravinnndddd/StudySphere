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
  prompt: `You are an intelligent study assistant.

Your job is to read through the provided study material or class notes and generate a clear, structured summary that is:
- Easy to understand for students of all levels
- Organized in bullet points
- Includes key concepts and important formulas
- Mentions external references or study materials if needed
- Keeps the tone concise, helpful, and student-friendly

=== NOTES START ===
{{{notes}}}
=== NOTES END ===

Format your response exactly like this:

📌 **Key Concepts:**
- Point 1
- Point 2
- ...

🧮 **Important Formulas:**
- Formula Name: Formula here (with explanation if needed)
- ...

🔗 **References (if any):**
- [Title](link) – short description

Make sure the summary is not too long and avoids repeating the original text. Focus on clarity, structure, and helpfulness.`,
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
