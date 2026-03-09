'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  fetchDonationEvents,
  SAMPLE_EVENTS,
  type DonationEventRow,
} from '@/lib/actions/events';
import {
  CalendarDays,
  MapPin,
  Users,
  Loader2,
  ExternalLink,
  Info,
} from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<DonationEventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingSample, setUsingSample] = useState(false);

  useEffect(() => {
    async function load() {
      const result = await fetchDonationEvents();
      if (result.data && result.data.length > 0) {
        setEvents(result.data);
      } else {
        setEvents(SAMPLE_EVENTS);
        setUsingSample(true);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const formatDateRange = (start: string | null, end: string | null) => {
    if (!start) return '';
    const s = new Date(start);
    const startStr = `${s.getFullYear()}/${String(s.getMonth() + 1).padStart(2, '0')}/${String(s.getDate()).padStart(2, '0')}`;
    if (!end || start === end) return startStr;
    const e = new Date(end);
    const endStr = `${e.getFullYear()}/${String(e.getMonth() + 1).padStart(2, '0')}/${String(e.getDate()).padStart(2, '0')}`;
    return `${startStr} ~ ${endStr}`;
  };

  const isUpcoming = (startDate: string | null) => {
    if (!startDate) return false;
    return new Date(startDate) > new Date();
  };

  return (
    <div>
      <Header title="捐血活動" />

      <div className="space-y-4 p-4">
        {/* Sample data notice */}
        {usingSample && !isLoading && (
          <Card className="border-0 bg-info-bg">
            <CardContent className="flex items-start gap-2 pt-4 pb-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
              <p className="text-xs text-info">
                目前顯示的是範例活動資料。實際活動資料將在資料爬蟲上線後自動更新。
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && events.length === 0 && (
          <Card className="border-0 bg-primary-50">
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <CalendarDays className="h-12 w-12 text-primary-300" />
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground">
                  目前沒有活動
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  最新活動資訊將會自動更新
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        {!isLoading &&
          events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div
                className={`h-1 ${
                  isUpcoming(event.start_date)
                    ? 'bg-primary-500'
                    : 'bg-neutral-300'
                }`}
              />
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground leading-tight">
                    {event.title}
                  </h3>
                  {isUpcoming(event.start_date) && (
                    <Badge className="shrink-0 bg-primary-100 text-primary-700">
                      即將舉辦
                    </Badge>
                  )}
                </div>

                {event.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                )}

                <div className="space-y-1.5">
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 shrink-0 text-primary-500" />
                    {formatDateRange(event.start_date, event.end_date)}
                  </p>
                  {event.location && (
                    <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                      {event.location}
                    </p>
                  )}
                  {event.organizer && (
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0 text-primary-500" />
                      {event.organizer}
                    </p>
                  )}
                </div>

                {event.source_url && (
                  <a
                    href={event.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary-600 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    查看詳情
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
