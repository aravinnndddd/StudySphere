'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

import { StudyDashboard } from '@/components/app/study-dashboard';
import { getPlan } from '@/lib/history-storage';
import type { StudyPlan } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PlanPage() {
  const params = useParams();
  const { id } = params;
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === 'string' && id) {
      const storedPlan = getPlan(id);
      if (storedPlan) {
        setPlan(storedPlan);
      } else {
        setError('Study plan not found. It may have been deleted.');
      }
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
        <div className="flex flex-1 items-center justify-center p-4">
            <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive">{error}</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return <StudyDashboard isLoading={false} data={plan} />;
}
