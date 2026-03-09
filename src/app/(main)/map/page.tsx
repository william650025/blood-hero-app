'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  fetchBloodStations,
  getDefaultStations,
  type BloodStationRow,
} from '@/lib/actions/stations';
import { MapPin, Phone, Clock, Loader2, List, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const REGIONS = [
  { value: 'all', label: '全部地區' },
  { value: '台北', label: '台北' },
  { value: '新北', label: '新北' },
  { value: '基隆', label: '基隆' },
  { value: '桃園', label: '桃園' },
  { value: '新竹', label: '新竹' },
  { value: '台中', label: '台中' },
  { value: '彰化', label: '彰化' },
  { value: '南投', label: '南投' },
  { value: '雲林', label: '雲林' },
  { value: '嘉義', label: '嘉義' },
  { value: '台南', label: '台南' },
  { value: '高雄', label: '高雄' },
  { value: '屏東', label: '屏東' },
  { value: '宜蘭', label: '宜蘭' },
  { value: '花蓮', label: '花蓮' },
  { value: '台東', label: '台東' },
];

export default function MapPage() {
  const [allStations, setAllStations] = useState<BloodStationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    async function load() {
      const result = await fetchBloodStations();
      let stations: BloodStationRow[];
      if (result.data && result.data.length > 0) {
        stations = result.data;
      } else {
        stations = await getDefaultStations();
      }
      setAllStations(stations);
      setIsLoading(false);
    }
    load();
  }, []);

  const filteredStations = useMemo(() => {
    if (selectedRegion === 'all') return allStations;
    return allStations.filter(
      (s) =>
        s.address?.includes(selectedRegion) ||
        (s as BloodStationRow & { region?: string }).region === selectedRegion
    );
  }, [selectedRegion, allStations]);

  return (
    <div className="flex h-screen flex-col">
      <Header title="捐血地圖" />

      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
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

        <div className="ml-auto flex items-center gap-2">
          <Select
            value={selectedRegion}
            onValueChange={(v) => setSelectedRegion(v || 'all')}
          >
            <SelectTrigger className="h-8 w-[120px] text-xs">
              <SelectValue placeholder="選擇地區" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="shrink-0">
            {filteredStations.length} 個
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        </div>
      ) : viewMode === 'map' ? (
        <div className="flex-1">
          <MapView stations={filteredStations} />
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto p-4 pb-20">
          {filteredStations.length === 0 && (
            <Card className="border-0 bg-primary-50">
              <CardContent className="flex flex-col items-center gap-2 py-8">
                <MapPin className="h-8 w-8 text-primary-300" />
                <p className="text-sm text-muted-foreground">此地區沒有找到捐血站</p>
              </CardContent>
            </Card>
          )}
          {filteredStations.map((station) => (
            <Card key={station.id}>
              <CardContent className="space-y-2 pt-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-foreground">
                    {station.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="shrink-0 bg-primary-100 text-primary-700 text-xs"
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
