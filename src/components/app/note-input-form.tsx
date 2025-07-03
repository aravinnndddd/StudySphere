'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, LoaderCircle } from 'lucide-react';

type NoteInputFormProps = {
  onSubmit: (notes: string) => void;
  isLoading: boolean;
};

export function NoteInputForm({ onSubmit, isLoading }: NoteInputFormProps) {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(notes);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Sparkles className="text-primary h-6 w-6" />
          Create Your Study Plan
        </CardTitle>
        <CardDescription>
          Paste your notes below, and we'll generate your personalized study materials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Paste your extensive class notes, book chapters, or any study material here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[250px] text-base"
            disabled={isLoading}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading || !notes}>
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Study Plan'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
