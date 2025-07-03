'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, LoaderCircle, Upload } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { summarizeForDisplay } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

// Set up the worker to be loaded from a CDN. Use the mjs build for modern bundlers.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;

type NoteInputFormProps = {
  onSubmit: (summary: string, fullNotes: string) => void;
  isLoading: boolean;
};

export function NoteInputForm({ onSubmit, isLoading }: NoteInputFormProps) {
  const [notes, setNotes] = useState(''); // This will hold the summary or pasted notes
  const [originalNotes, setOriginalNotes] = useState(''); // Holds full text from file
  const [isParsing, setIsParsing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(notes, originalNotes || notes);
  };

  const processExtractedText = async (text: string) => {
    setOriginalNotes(text);
    setIsParsing(false);
    setIsSummarizing(true);
    setNotes('Summarizing content, this may take a moment...');

    const result = await summarizeForDisplay(text);
    if (result.success) {
      setNotes(result.data);
    } else {
      setNotes(result.data); // Fallback to original text on error
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: result.error || 'Could not summarize the document. Using full text.',
      });
    }
    setIsSummarizing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setNotes('Parsing file...');
    setOriginalNotes('');

    try {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (!event.target?.result) {
            setIsParsing(false);
            setNotes('');
            toast({ variant: 'destructive', title: 'Error', description: 'File reading failed.' });
            return;
          }
          try {
            const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map((item: any) => item.str).join(' ');
              fullText += pageText + '\n\n';
            }
            await processExtractedText(fullText.trim());
          } catch (error) {
            console.error('Error parsing PDF:', error);
            setNotes('');
            toast({ variant: 'destructive', title: 'Error', description: 'Could not parse the PDF file.' });
            setIsParsing(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = event.target?.result as string;
          await processExtractedText(text);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error('Failed to read file', error);
      setNotes('');
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to read file.' });
      setIsParsing(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadButtonDisabled = isLoading || isParsing || isSummarizing;
  const generateButtonDisabled = isLoading || isParsing || isSummarizing || !notes;
  const currentStatus = isParsing ? 'Parsing...' : isSummarizing ? 'Summarizing...' : 'Upload File';

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Sparkles className="text-primary h-6 w-6" />
          Create Your Study Plan
        </CardTitle>
        <CardDescription>
          Paste your notes, or upload a file. We'll summarize it for you to review before generating your study materials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Paste your notes here, or upload a file to have it summarized automatically..."
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setOriginalNotes('');
            }}
            className="min-h-[250px] text-base"
            disabled={isLoading || isParsing || isSummarizing}
          />
           <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.md,.pdf"
            />
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleUploadClick} disabled={uploadButtonDisabled} className="w-full sm:w-auto">
              {isParsing || isSummarizing ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  {currentStatus}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {currentStatus}
                </>
              )}
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={generateButtonDisabled}>
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
