'use server';

/**
 * @fileOverview A flow to generate application-based questions from notes and extract solutions from external sources.
 *
 * - generateApplicationQuestions - A function that handles the generation of application questions and solution extraction.
 * - GenerateApplicationQuestionsInput - The input type for the generateApplicationQuestions function.
 * - GenerateApplicationQuestionsOutput - The return type for the generateApplicationQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateApplicationQuestionsInputSchema = z.object({
  notes: z.string().describe('The notes to generate questions from.'),
  numQuestions: z.number().default(3).describe('The number of questions to generate.'),
});
export type GenerateApplicationQuestionsInput = z.infer<typeof GenerateApplicationQuestionsInputSchema>;

const GenerateApplicationQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The application-based question.'),
      solution: z.string().describe('The solution to the question, explained in a friendly, academic tone.'),
      source: z.string().optional().describe('The source URL of the solution.'),
    })
  ).describe('The generated application-based questions and their solutions.'),
});
export type GenerateApplicationQuestionsOutput = z.infer<typeof GenerateApplicationQuestionsOutputSchema>;

export async function generateApplicationQuestions(input: GenerateApplicationQuestionsInput): Promise<GenerateApplicationQuestionsOutput> {
  return generateApplicationQuestionsFlow(input);
}

const questionPrompt = ai.definePrompt({
  name: 'applicationQuestionPrompt',
  input: {schema: GenerateApplicationQuestionsInputSchema},
  output: {schema: GenerateApplicationQuestionsOutputSchema},
  prompt: `You are an expert in generating application-based questions from study notes. Your task is to create questions that test the user's understanding of how to apply the concepts in the notes.

For each question, you will also provide a detailed solution. When writing the solution, please follow these guidelines:
- Adopt a friendly and academic tone, like a teacher explaining the answer step-by-step.
- Use headings or bold text to structure the explanation if it has multiple parts.
- Explain the reasoning clearly.
- When providing code examples, enclose them in markdown code fences with the language identifier (e.g., \`\`\`javascript ... \`\`\`).
- For mathematical formulas, use LaTeX syntax enclosed in double dollar signs for blocks (e.g., $$ E=mc^2 $$) or single dollar signs for inline math (e.g., $ y = mx + b $).
- If possible, extract the solution from a credible online source and provide the source URL.

Notes: {{{notes}}}

Number of questions to generate: {{{numQuestions}}}

Important: You MUST format your entire response as a single JSON object that strictly matches the following schema. Do not include any text outside of this JSON object.
${JSON.stringify(GenerateApplicationQuestionsOutputSchema.describe, null, 2)}`,
});

const generateApplicationQuestionsFlow = ai.defineFlow(
  {
    name: 'generateApplicationQuestionsFlow',
    inputSchema: GenerateApplicationQuestionsInputSchema,
    outputSchema: GenerateApplicationQuestionsOutputSchema,
  },
  async input => {
    const {output} = await questionPrompt(input);
    return output!;
  }
);
