'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export default function AchievementsPage() {
  return (
    <div>
      <Header title="成就牆" />
      <div className="flex flex-col items-center justify-center p-8">
        <Card className="w-full border-0 bg-primary-50">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Trophy className="h-12 w-12 text-accent-400" />
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">成就牆</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                即將推出 — 展示你的捐血勳章
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
