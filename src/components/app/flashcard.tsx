'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

type FlashcardProps = {
  question: string;
  solution: string;
};

export function Flashcard({ question, solution }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardContainerStyle: React.CSSProperties = {
    perspective: '1000px',
  };

  const cardStyle: React.CSSProperties = {
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  };

  const cardFaceStyle: React.CSSProperties = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden', // for Safari
  };

  return (
    <div
      style={cardContainerStyle}
      className="w-full h-80 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div style={cardStyle} className="relative w-full h-full">
        {/* Front of the card */}
        <div
          style={cardFaceStyle}
          className="absolute w-full h-full"
        >
          <Card className="w-full h-full flex flex-col justify-between">
            <CardContent className="p-6 flex-1 flex items-center justify-center">
                <ScrollArea className="h-[220px]">
                    <p className="text-center text-lg">{question}</p>
                </ScrollArea>
            </CardContent>
            <div className="p-4 border-t flex justify-end">
                <Button variant="ghost" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Flip
                </Button>
            </div>
          </Card>
        </div>

        {/* Back of the card */}
        <div
          style={{ ...cardFaceStyle, transform: 'rotateY(180deg)' }}
          className="absolute w-full h-full"
        >
           <Card className="w-full h-full flex flex-col justify-between bg-secondary">
            <CardContent className="p-6 flex-1 flex items-center justify-center">
                <ScrollArea className="h-[220px]">
                    <p className="text-center text-md font-code whitespace-pre-wrap">{solution}</p>
                </ScrollArea>
            </CardContent>
             <div className="p-4 border-t flex justify-end">
                <Button variant="ghost" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Flip
                </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
