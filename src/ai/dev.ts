import { config } from 'dotenv';
config();

import '@/ai/flows/generate-application-questions.ts';
import '@/ai/flows/summarize-notes.ts';
import '@/ai/flows/generate-study-guide.ts';