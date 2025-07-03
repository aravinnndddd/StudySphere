'use server';

import { generateApplicationQuestions } from '@/ai/flows/generate-application-questions';
import { generateStudyGuide } from '@/ai/flows/generate-study-guide';
import { summarizeNotes } from '@/ai/flows/summarize-notes';
import type { StudyPlan } from '@/lib/types';

export async function generateStudyPlan(
  notes: string
): Promise<{ success: boolean; data?: StudyPlan; error?: string }> {
  if (!notes || notes.trim().length < 50) {
    return {
      success: false,
      error: 'Please provide at least 50 characters of notes to generate a study plan.',
    };
  }

  try {
    // We can run summarization and question generation in parallel
    const [summaryResult, questionsResult] = await Promise.all([
      summarizeNotes({ notes }),
      generateApplicationQuestions({ notes, numQuestions: 5 }),
    ]);

    if (!summaryResult?.summary) {
        throw new Error("Failed to generate summary.");
    }
    if (!questionsResult?.questions) {
        throw new Error("Failed to generate questions.");
    }

    // Study guide generation depends on the summary, so it runs after
    const studyGuideResult = await generateStudyGuide({
      summarizedNotes: summaryResult.summary,
    });
    
    if (!studyGuideResult?.studyGuide) {
        throw new Error("Failed to generate study guide.");
    }

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
