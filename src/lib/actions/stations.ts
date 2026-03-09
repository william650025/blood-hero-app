'use server';

import { createClient } from '@/lib/supabase/server';

export interface BloodStationRow {
  id: string;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  operating_hours: string | null;
  station_type: 'fixed_station' | 'mobile_bus' | null;
  source_url: string | null;
}

export async function fetchBloodStations() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('blood_stations')
    .select('*')
    .order('name');

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as BloodStationRow[] };
}

// Seed data: Major blood donation centers in Taiwan
export const DEFAULT_STATIONS: BloodStationRow[] = [
  {
    id: 'seed-1',
    name: '台北捐血中心',
    address: '台北市中正區南海路2號',
    lat: 25.0302,
    lng: 121.5127,
    phone: '02-2341-7281',
    operating_hours: '週一至週日 09:00-17:30',
    station_type: 'fixed_station',
    source_url: null,
  },
  {
    id: 'seed-2',
    name: '新竹捐血中心',
    address: '新竹市東區食品路282號',
    lat: 24.7877,
    lng: 120.9985,
    phone: '03-578-8308',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source_url: null,
  },
  {
    id: 'seed-3',
    name: '台中捐血中心',
    address: '台中市北區忠明路288號',
    lat: 24.1550,
    lng: 120.6685,
    phone: '04-2203-7155',
    operating_hours: '週一至週日 09:00-17:30',
    station_type: 'fixed_station',
    source_url: null,
  },
  {
    id: 'seed-4',
    name: '高雄捐血中心',
    address: '高雄市前鎮區翠亨北路359號',
    lat: 22.6183,
    lng: 120.3203,
    phone: '07-811-9966',
    operating_hours: '週一至週日 09:00-17:30',
    station_type: 'fixed_station',
    source_url: null,
  },
  {
    id: 'seed-5',
    name: '台南捐血中心',
    address: '台南市東區林森路一段191號',
    lat: 22.9908,
    lng: 120.2130,
    phone: '06-237-3645',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source_url: null,
  },
  {
    id: 'seed-6',
    name: '花蓮捐血站',
    address: '花蓮縣花蓮市中山路123號',
    lat: 23.9910,
    lng: 121.6014,
    phone: '03-833-0511',
    operating_hours: '週一至週六 09:00-17:00',
    station_type: 'fixed_station',
    source_url: null,
  },
];
