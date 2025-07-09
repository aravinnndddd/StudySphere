'use client';

import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Lightbulb,
  LoaderCircle,
  Sparkles,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Flashcard } from '@/components/app/flashcard';
import { Feedback } from '@/components/app/feedback';
import type { StudyPlan } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { MarkdownRenderer } from './markdown-renderer';

type StudyDashboardProps = {
  isLoading: boolean;
  data: StudyPlan | null;
};

export function StudyDashboard({ isLoading, data }: StudyDashboardProps) {
  const renderSkeletons = (count: number) =>
    Array(count)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="space-y-2 mb-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ));

  return (
    <div className="flex-1 w-full bg-grid-white/[0.05] relative flex items-center justify-center p-4">
       <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-background bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <Tabs defaultValue="summary" className="w-full max-w-6xl mx-auto z-10">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-12">
          <TabsTrigger value="summary" className="py-2.5"><ClipboardList className="mr-2" />Summary</TabsTrigger>
          <TabsTrigger value="study-guide" className="py-2.5"><BookOpen className="mr-2" />Study Guide</TabsTrigger>
          <TabsTrigger value="flashcards" className="py-2.5"><GraduationCap className="mr-2" />Flashcards</TabsTrigger>
          <TabsTrigger value="practice" className="py-2.5"><Lightbulb className="mr-2" />Practice</TabsTrigger>
        </TabsList>

        <Card className="mt-4 border-primary/20 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" /> Your AI-Generated Study Plan
                </CardTitle>
                <CardDescription>
                    Use these generated materials to enhance your learning experience.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <LoaderCircle className="h-12 w-12 animate-spin text-primary mb-4" />
                        <h3 className="text-xl font-medium mb-2">Generating Your Study Materials...</h3>
                        <p className="text-muted-foreground">The AI is working its magic. This might take a moment.</p>
                    </div>
                )}
                {!isLoading && data && (
                    <>
                    <TabsContent value="summary">
                        <ScrollArea className="max-h-[60vh] rounded-md border p-6">
                            <MarkdownRenderer content={data.summary.summary} />
                        </ScrollArea>
                        <Feedback />
                    </TabsContent>

                    <TabsContent value="study-guide">
                        <ScrollArea className="max-h-[60vh] rounded-md border p-6">
                            <MarkdownRenderer content={data.studyGuide.studyGuide} />
                        </ScrollArea>
                        <Feedback />
                    </TabsContent>

                    <TabsContent value="flashcards" className="flex flex-col items-center justify-center min-h-[450px]">
                        <Carousel className="w-full max-w-md">
                        <CarouselContent>
                            {data.questions.questions.map((q, i) => (
                            <CarouselItem key={i}>
                                <div className="p-1">
                                    <Flashcard question={q.question} solution={q.solution} />
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                        </Carousel>
                        <Feedback />
                    </TabsContent>

                    <TabsContent value="practice">
                        <ScrollArea className="max-h-[60vh] pr-4">
                        <Accordion type="single" collapsible className="w-full">
                            {data.questions.questions.map((q, i) => (
                            <AccordionItem value={`item-${i}`} key={i}>
                                <AccordionTrigger className="text-left hover:no-underline">
                                {`Q${i + 1}: ${q.question}`}
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                    <div className="text-base">
                                      <MarkdownRenderer content={q.solution} />
                                    </div>
                                    {q.source && (
                                        <a href={q.source} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                            Source
                                        </a>
                                    )}
                                    <Feedback />
                                </AccordionContent>
                            </AccordionItem>
                            ))}
                        </Accordion>
                        </ScrollArea>
                    </TabsContent>
                    </>
                )}
            </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
