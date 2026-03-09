'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Map } from 'lucide-react';

export default function MapPage() {
  return (
    <div>
      <Header title="捐血地圖" />
      <div className="flex flex-col items-center justify-center p-8">
        <Card className="w-full border-0 bg-primary-50">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Map className="h-12 w-12 text-primary-300" />
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">捐血地圖</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                即將推出 — 找到離你最近的捐血站
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
