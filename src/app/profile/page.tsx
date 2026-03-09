'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Settings, LogOut } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      {/* Header */}
      <header className="flex h-14 items-center border-b border-border px-4">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-center text-lg font-semibold">個人檔案</h1>
        <div className="w-5" />
      </header>

      <div className="space-y-4 p-4">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
            <User className="h-10 w-10 text-primary-600" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">小明</h2>
            <p className="text-sm text-muted-foreground">A 型 · 男</p>
          </div>
        </div>

        <Card className="border-0 bg-primary-50">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <Settings className="h-10 w-10 text-primary-300" />
            <p className="text-sm text-muted-foreground">
              個人資料編輯功能即將推出
            </p>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full text-error hover:text-error"
        >
          <LogOut className="mr-2 h-4 w-4" />
          登出
        </Button>
      </div>
    </div>
  );
}
