'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { useDonationStore } from '@/stores/useDonationStore';
import {
  getDaysUntilEligible,
  DONATION_TYPE_LABELS,
} from '@/lib/donation-rules';
import {
  Droplets,
  PlusCircle,
  MapPin,
  CalendarDays,
  Heart,
  TrendingUp,
} from 'lucide-react';

// Mock user data (Sprint 2 will use real auth)
const mockUser = {
  displayName: '小明',
  gender: 'male' as const,
};

export default function DashboardPage() {
  const { stats } = useDonationStore();
  const lastDonation = stats.lastDonation;

  const daysUntilEligible = lastDonation
    ? getDaysUntilEligible(
        new Date(lastDonation.date),
        lastDonation.type,
        mockUser.gender
      )
    : 0;

  const canDonate = daysUntilEligible === 0;

  return (
    <div>
      <Header title="捐血勇士" />

      <div className="space-y-4 p-4">
        {/* Greeting */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <Droplets className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              嗨，{mockUser.displayName}
            </h2>
            <p className="text-sm text-muted-foreground">
              感謝你的每一次捐血 ❤️
            </p>
          </div>
        </div>

        {/* Donation Status Card */}
        <Card
          className={`border-0 ${
            canDonate
              ? 'bg-success-bg'
              : 'bg-primary-50'
          }`}
        >
          <CardContent className="flex items-center gap-4 pt-6">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${
                canDonate ? 'bg-success/10' : 'bg-primary-100'
              }`}
            >
              <Heart
                className={`h-7 w-7 ${
                  canDonate ? 'text-success' : 'text-primary-600'
                }`}
              />
            </div>
            <div>
              {canDonate ? (
                <>
                  <p className="text-lg font-bold text-success">
                    你現在可以捐血！
                  </p>
                  <p className="text-sm text-success/80">
                    趕快找個捐血站吧 🎉
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-primary-700">
                    距離下次可捐還有
                  </p>
                  <p className="text-3xl font-extrabold text-primary-600">
                    {daysUntilEligible}{' '}
                    <span className="text-lg font-bold">天</span>
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Last Donation Card */}
        {lastDonation && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                上次捐血紀錄
              </h3>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    {lastDonation.date}
                  </p>
                  <Badge variant="secondary">
                    {DONATION_TYPE_LABELS[lastDonation.type]}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    <MapPin className="mr-1 inline h-3.5 w-3.5" />
                    {lastDonation.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Link href="/records/new">
            <Card className="cursor-pointer border-0 bg-primary-50 transition-colors hover:bg-primary-100">
              <CardContent className="flex flex-col items-center gap-2 p-4">
                <PlusCircle className="h-6 w-6 text-primary-600" />
                <span className="text-xs font-medium text-primary-700">
                  新增紀錄
                </span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/map">
            <Card className="cursor-pointer border-0 bg-primary-50 transition-colors hover:bg-primary-100">
              <CardContent className="flex flex-col items-center gap-2 p-4">
                <MapPin className="h-6 w-6 text-primary-600" />
                <span className="text-xs font-medium text-primary-700">
                  找捐血站
                </span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/events">
            <Card className="cursor-pointer border-0 bg-primary-50 transition-colors hover:bg-primary-100">
              <CardContent className="flex flex-col items-center gap-2 p-4">
                <CalendarDays className="h-6 w-6 text-primary-600" />
                <span className="text-xs font-medium text-primary-700">
                  查活動
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              累計統計
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-primary-50 p-4 text-center">
                <p className="text-3xl font-extrabold text-primary-600">
                  {stats.totalCount}
                </p>
                <p className="text-xs text-muted-foreground">捐血次數</p>
              </div>
              <div className="rounded-lg bg-primary-50 p-4 text-center">
                <p className="text-3xl font-extrabold text-primary-600">
                  {stats.totalVolume}
                </p>
                <p className="text-xs text-muted-foreground">總 cc 數</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
