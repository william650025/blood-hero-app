'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, Map, CalendarDays, Trophy } from 'lucide-react';

const navItems = [
  { href: '/', label: '首頁', icon: Home },
  { href: '/records', label: '紀錄', icon: BarChart3 },
  { href: '/map', label: '地圖', icon: Map },
  { href: '/events', label: '活動', icon: CalendarDays },
  { href: '/achievements', label: '成就', icon: Trophy },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? 'text-primary-600 font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
