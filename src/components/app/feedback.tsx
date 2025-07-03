'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Feedback() {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  return (
    <div className="mt-6 flex items-center justify-end gap-4">
      <p className="text-sm text-muted-foreground">Was this helpful?</p>
      <div className="flex gap-2">
        <Button
          variant={feedback === 'up' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setFeedback('up')}
          className={cn('h-9 w-9', feedback === 'up' && 'bg-green-500/20 text-green-500 border-green-500/50')}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="sr-only">Helpful</span>
        </Button>
        <Button
          variant={feedback === 'down' ? 'destructive' : 'outline'}
          size="icon"
          onClick={() => setFeedback('down')}
          className={cn('h-9 w-9', feedback === 'down' && 'bg-red-500/20 text-red-500 border-red-500/50')}
        >
          <ThumbsDown className="h-4 w-4" />
          <span className="sr-only">Not Helpful</span>
        </Button>
      </div>
    </div>
  );
}
