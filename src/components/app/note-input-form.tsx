'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, LoaderCircle, Upload } from 'lucide-react';

type NoteInputFormProps = {
  onSubmit: (notes: string) => void;
  isLoading: boolean;
};

export function NoteInputForm({ onSubmit, isLoading }: NoteInputFormProps) {
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(notes);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setNotes(text);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Sparkles className="text-primary h-6 w-6" />
          Create Your Study Plan
        </CardTitle>
        <CardDescription>
          Paste your notes below, or upload a text file. We'll generate your personalized study materials.
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
          />
           <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.md"
            />
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleUploadClick} disabled={isLoading} className="w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || !notes}>
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Study Plan'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
