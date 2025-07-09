'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, BookOpen, Sparkles, LogIn } from 'lucide-react';

import { NoteInputForm } from '@/components/app/note-input-form';
import { generateStudyPlan } from '@/app/actions';
import { addHistoryItem } from '@/lib/history-storage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { StudyPlan } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, signInWithGoogle, isFirebaseEnabled } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);
  const [planName, setPlanName] = useState('');

  const handleGenerate = async (summary: string, fullNotes: string) => {
    setIsGenerating(true);
    const result = await generateStudyPlan({ fullNotes, summary });
    setIsGenerating(false);

    if (result.success && result.data) {
      // Generate a default title from the summary
      const keyConceptsMatch = result.data.summary.summary.match(/📌 \*\*Key Concepts:\*\*\s*\n-\s*(.*)/);
      let defaultTitle = keyConceptsMatch ? keyConceptsMatch[1] : 'New Study Plan';
      defaultTitle = defaultTitle.replace(/(\*\*|__|\*|_|`|#)/g, '');
      defaultTitle = defaultTitle.length > 50 ? defaultTitle.substring(0, 47) + '...' : defaultTitle;

      setPlanName(defaultTitle);
      setGeneratedPlan(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result.error || 'Unable to generate study plan.',
      });
    }
  };

  const handleSavePlan = () => {
    if (!generatedPlan || !planName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Invalid Name',
        description: 'Please enter a name for your study plan.',
      });
      return;
    }
    const historyItem = addHistoryItem(generatedPlan, planName);
    setGeneratedPlan(null); // Close the dialog
    router.push(`/plan/${historyItem.id}`);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setGeneratedPlan(null);
    }
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

        {user ? (
          <NoteInputForm onSubmit={handleGenerate} isLoading={isGenerating} />
        ) : (
          <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20 text-center">
            <CardContent className="p-10">
              {isFirebaseEnabled ? (
                 <>
                    <h3 className="text-xl font-semibold mb-4">Please sign in to continue</h3>
                    <p className="text-muted-foreground mb-6">
                      Sign in with your Google account to start creating your personalized study plans.
                    </p>
                    <Button onClick={signInWithGoogle} size="lg">
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In with Google
                    </Button>
                  </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-4">Firebase Not Configured</h3>
                  <p className="text-muted-foreground mb-6">
                    To enable user sign-in, please add your Firebase project credentials to the{' '}
                    <code className="font-code bg-muted px-1.5 py-0.5 rounded-sm">.env</code> file.
                  </p>
                  <Button size="lg" disabled>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In with Google
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!generatedPlan} onOpenChange={handleModalOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Name Your Study Plan</DialogTitle>
            <DialogDescription>
              Give your new study plan a name to save it to your history.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan-name" className="text-right">
                Name
              </Label>
              <Input
                id="plan-name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSavePlan();
                    }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSavePlan}>Save and View Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
