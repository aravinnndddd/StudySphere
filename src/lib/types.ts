import type { GenerateApplicationQuestionsOutput } from '@/ai/flows/generate-application-questions';
import type { GenerateStudyGuideOutput } from '@/ai/flows/generate-study-guide';
import type { SummarizeNotesOutput } from '@/ai/flows/summarize-notes';

export type StudyPlan = {
  summary: SummarizeNotesOutput;
  studyGuide: GenerateStudyGuideOutput;
  questions: GenerateApplicationQuestionsOutput;
};

export type HistoryItem = {
  id: string;
  title: string;
  timestamp: number;
  plan: StudyPlan;
};
