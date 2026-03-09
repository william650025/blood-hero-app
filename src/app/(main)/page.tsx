'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { fetchDonationStats, type DonationRecordRow } from '@/lib/actions/donations';
import { fetchProfile } from '@/lib/actions/profile';
import {
  getDaysUntilEligible,
  DONATION_TYPE_LABELS,
  type DonationType,
  type Gender,
} from '@/lib/donation-rules';
import {
  Droplets,
  PlusCircle,
  MapPin,
  CalendarDays,
  Heart,
  TrendingUp,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [totalCount, setTotalCount] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [lastDonation, setLastDonation] = useState<DonationRecordRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [profileResult, statsResult] = await Promise.all([
        fetchProfile(),
        fetchDonationStats(),
      ]);

      if (profileResult.data) {
        setDisplayName(profileResult.data.display_name || '捐血勇士');
        setGender((profileResult.data.gender as Gender) || 'male');
      }

      if (statsResult.data) {
        setTotalCount(statsResult.data.totalCount);
        setTotalVolume(statsResult.data.totalVolume);
        setLastDonation(statsResult.data.lastDonation);
      }

      setIsLoading(false);
    }
    load();
  }, []);

  const daysUntilEligible = lastDonation
    ? getDaysUntilEligible(
        new Date(lastDonation.donation_date),
        lastDonation.donation_type as DonationType,
        gender
      )
    : 0;

  const canDonate = !lastDonation || daysUntilEligible === 0;

  if (isLoading) {
    return (
      <div>
        <Header title="捐血勇士" />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        </div>
      </div>
    );
  }

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
              嗨，{displayName}
            </h2>
            <p className="text-sm text-muted-foreground">
              感謝你的每一次捐血 ❤️
            </p>
          </div>
        </div>

        {/* Donation Status Card */}
        <Card
          className={`border-0 ${
            canDonate ? 'bg-success-bg' : 'bg-primary-50'
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
                    {lastDonation.donation_date}
                  </p>
                  <Badge variant="secondary">
                    {DONATION_TYPE_LABELS[lastDonation.donation_type as DonationType]}
                  </Badge>
                </div>
                <div className="text-right">
                  {lastDonation.location_name && (
                    <p className="text-sm text-muted-foreground">
                      <MapPin className="mr-1 inline h-3.5 w-3.5" />
                      {lastDonation.location_name}
                    </p>
                  )}
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
                  {totalCount}
                </p>
                <p className="text-xs text-muted-foreground">捐血次數</p>
              </div>
              <div className="rounded-lg bg-primary-50 p-4 text-center">
                <p className="text-3xl font-extrabold text-primary-600">
                  {totalVolume}
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
