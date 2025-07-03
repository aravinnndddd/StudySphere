'use server';

import { generateApplicationQuestions } from '@/ai/flows/generate-application-questions';
import { generateStudyGuide } from '@/ai/flows/generate-study-guide';
import { summarizeNotes, type SummarizeNotesOutput } from '@/ai/flows/summarize-notes';
import type { StudyPlan } from '@/lib/types';

export async function summarizeForDisplay(
  notes: string
): Promise<{ success: boolean; data: string; error?: string }> {
  if (!notes || notes.trim().length < 50) {
    return { success: true, data: notes };
  }

  try {
    const summaryResult = await summarizeNotes({ notes });
    if (!summaryResult?.summary) {
      throw new Error('Failed to generate summary.');
    }
    return { success: true, data: summaryResult.summary };
  } catch (e) {
    console.error('Error summarizing for display:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      success: false,
      error: `Failed to summarize notes. ${errorMessage}`,
      data: notes, 
    };
  }
}

export async function generateStudyPlan(payload: {
  fullNotes: string;
  summary: string;
}): Promise<{ success: boolean; data?: StudyPlan; error?: string }> {
  const { fullNotes, summary } = payload;
  if (!fullNotes || fullNotes.trim().length < 50) {
    return {
      success: false,
      error: 'Please provide at least 50 characters of notes to generate a study plan.',
    };
  }

  try {
    const [questionsResult, studyGuideResult] = await Promise.all([
      generateApplicationQuestions({ notes: fullNotes, numQuestions: 5 }),
      generateStudyGuide({ summarizedNotes: summary }),
    ]);

    if (!questionsResult?.questions) {
      throw new Error('Failed to generate questions.');
    }
    if (!studyGuideResult?.studyGuide) {
      throw new Error('Failed to generate study guide.');
    }

    const summaryResult: SummarizeNotesOutput = { summary: summary };

    return {
      success: true,
      data: {
        summary: summaryResult,
        studyGuide: studyGuideResult,
        questions: questionsResult,
      },
    };
  } catch (e) {
    console.error('Error generating study plan:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      success: false,
      error: `Failed to generate study plan. ${errorMessage}`,
    };
  }
}
