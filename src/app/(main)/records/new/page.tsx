'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export default function NewRecordPage() {
  return (
    <div>
      <Header title="新增紀錄" />
      <div className="flex flex-col items-center justify-center p-8">
        <Card className="w-full border-0 bg-primary-50">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <PlusCircle className="h-12 w-12 text-primary-300" />
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">新增捐血紀錄</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                即將推出 — 記錄你的每次捐血
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
