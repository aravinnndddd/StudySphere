'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, LoaderCircle, Upload } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker to be loaded from a CDN. Use the mjs build for modern bundlers.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;

type NoteInputFormProps = {
  onSubmit: (notes: string) => void;
  isLoading: boolean;
};

export function NoteInputForm({ onSubmit, isLoading }: NoteInputFormProps) {
  const [notes, setNotes] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(notes);
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setNotes('');

    try {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (!event.target?.result) {
            setIsParsing(false);
            console.error("File reading failed.");
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
            setNotes(fullText.trim());
          } catch (error) {
            console.error('Error parsing PDF:', error);
          } finally {
            setIsParsing(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // Handle text-based files
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          setNotes(text);
          setIsParsing(false);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Failed to read file", error);
      setIsParsing(false);
    }
  };


  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadButtonDisabled = isLoading || isParsing;
  const generateButtonDisabled = isLoading || isParsing || !notes;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Sparkles className="text-primary h-6 w-6" />
          Create Your Study Plan
        </CardTitle>
        <CardDescription>
          Paste your notes below, or upload a text or PDF file. We'll generate your personalized study materials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Paste your extensive class notes, book chapters, or any study material here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[250px] text-base"
            disabled={isLoading || isParsing}
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
              {isParsing ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
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
