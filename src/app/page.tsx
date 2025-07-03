'use client';

import { useState } from 'react';
import { BrainCircuit, BookOpen, Sparkles } from 'lucide-react';

import { NoteInputForm } from '@/components/app/note-input-form';
import { StudyDashboard } from '@/components/app/study-dashboard';
import { generateStudyPlan } from '@/app/actions';
import type { StudyPlan } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (summary: string, fullNotes: string) => {
    setIsLoading(true);
    setStudyPlan(null);
    const result = await generateStudyPlan({ fullNotes, summary });
    if (result.success && result.data) {
      setStudyPlan(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result.error || 'Unable to generate study plan.',
      });
    }
    setIsLoading(false);
  };

  if (isLoading || studyPlan) {
    return <StudyDashboard isLoading={isLoading} data={studyPlan} />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-grid-white/[0.05] relative">
       <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-background bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="w-full max-w-4xl mx-auto z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Welcome to StudySphere
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste your notes and let AI create a personalized study plan with summaries, flashcards, and practice questions to help you ace your exams.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-center mb-12">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border">
            <Sparkles className="h-10 w-10 mx-auto text-primary mb-3" />
            <h3 className="text-xl font-semibold mb-2">Summarize</h3>
            <p className="text-muted-foreground">Get key points from long notes instantly.</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border">
            <BookOpen className="h-10 w-10 mx-auto text-primary mb-3" />
            <h3 className="text-xl font-semibold mb-2">Study Guide</h3>
            <p className="text-muted-foreground">A structured guide to focus your learning.</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border">
            <BrainCircuit className="h-10 w-10 mx-auto text-primary mb-3" />
            <h3 className="text-xl font-semibold mb-2">Test Yourself</h3>
            <p className="text-muted-foreground">Interactive flashcards & practice questions.</p>
          </div>
        </div>

        <NoteInputForm onSubmit={handleGenerate} isLoading={isLoading} />
      </div>
    </div>
  );
}
