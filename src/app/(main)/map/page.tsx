'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  fetchBloodStations,
  DEFAULT_STATIONS,
  type BloodStationRow,
} from '@/lib/actions/stations';
import { MapPin, Phone, Clock, Loader2, List, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dynamic import to avoid SSR issues with Leaflet
const MapView = dynamic(
  () => import('@/components/map/MapView').then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    ),
  }
);

export default function MapPage() {
  const [stations, setStations] = useState<BloodStationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  useEffect(() => {
    async function load() {
      const result = await fetchBloodStations();
      if (result.data && result.data.length > 0) {
        setStations(result.data);
      } else {
        // Fall back to seed data
        setStations(DEFAULT_STATIONS);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <Header title="捐血地圖" />

      {/* View Toggle */}
      <div className="flex gap-2 border-b border-border px-4 py-2">
        <Button
          variant={viewMode === 'map' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('map')}
          className={viewMode === 'map' ? 'bg-primary-600' : ''}
        >
          <MapIcon className="mr-1 h-4 w-4" />
          地圖
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
          className={viewMode === 'list' ? 'bg-primary-600' : ''}
        >
          <List className="mr-1 h-4 w-4" />
          列表
        </Button>
        <Badge variant="secondary" className="ml-auto self-center">
          {stations.length} 個捐血站
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        </div>
      ) : viewMode === 'map' ? (
        <div className="flex-1">
          <MapView stations={stations} />
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto p-4 pb-20">
          {stations.map((station) => (
            <Card key={station.id}>
              <CardContent className="space-y-2 pt-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-foreground">
                    {station.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="shrink-0 bg-primary-100 text-primary-700"
                  >
                    {station.station_type === 'mobile_bus'
                      ? '捐血車'
                      : '捐血站'}
                  </Badge>
                </div>
                {station.address && (
                  <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    {station.address}
                  </p>
                )}
                {station.phone && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <a
                      href={`tel:${station.phone}`}
                      className="text-primary-600 underline"
                    >
                      {station.phone}
                    </a>
                  </p>
                )}
                {station.operating_hours && (
                  <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                    {station.operating_hours}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
