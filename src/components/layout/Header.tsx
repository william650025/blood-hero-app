'use client';

import Link from 'next/link';
import { User } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600 transition-colors hover:bg-primary-200"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
