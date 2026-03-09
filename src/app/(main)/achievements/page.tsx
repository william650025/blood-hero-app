'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  fetchAchievementsWithStatus,
  type AchievementWithStatus,
} from '@/lib/actions/achievements';
import { Trophy, Loader2, Lock } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [donationCount, setDonationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await fetchAchievementsWithStatus();
      if (result.data) {
        setAchievements(result.data);
        setDonationCount(result.donationCount);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div>
      <Header title="成就牆" />

      <div className="space-y-4 p-4">
        {/* Progress Summary */}
        {!isLoading && (
          <Card className="border-0 bg-accent-50">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-100">
                <Trophy className="h-7 w-7 text-accent-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {earnedCount} / {achievements.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  已解鎖成就 · 累計 {donationCount} 次捐血
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent-400" />
          </div>
        )}

        {/* Achievement Cards */}
        {!isLoading && (
          <div className="space-y-3">
            {achievements.map((ach) => (
              <Card
                key={ach.id}
                className={`overflow-hidden transition-all ${
                  ach.earned
                    ? 'border-accent-200 bg-accent-50/50'
                    : 'opacity-60'
                }`}
              >
                <CardContent className="flex items-center gap-4 pt-5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
                      ach.earned
                        ? 'bg-accent-100'
                        : 'bg-neutral-100'
                    }`}
                  >
                    {ach.earned ? (
                      ach.icon || '🏅'
                    ) : (
                      <Lock className="h-5 w-5 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-semibold ${
                          ach.earned
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {ach.name}
                      </h3>
                      {ach.earned && (
                        <Badge className="bg-accent-100 text-accent-700 text-xs">
                          已解鎖
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {ach.description}
                    </p>
                    {!ach.earned && (
                      <div className="mt-2">
                        <div className="h-1.5 w-full rounded-full bg-neutral-200">
                          <div
                            className="h-1.5 rounded-full bg-accent-400 transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                (donationCount / ach.threshold_count) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {donationCount} / {ach.threshold_count} 次
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
