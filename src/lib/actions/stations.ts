'use server';

import { createClient } from '@/lib/supabase/server';
import { ALL_FIXED_STATIONS, type RawStation } from '@/lib/scrapers/blood-stations';

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
  region?: string;
}

export async function fetchBloodStations(region?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('blood_stations')
    .select('*')
    .order('name');

  if (region) {
    // Filter by name containing region keyword
    query = query.ilike('address', `%${region}%`);
  }

  const { data, error } = await query;

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as BloodStationRow[] };
}

/**
 * Convert RawStation to BloodStationRow for client-side fallback
 */
function rawToRow(station: RawStation, index: number): BloodStationRow {
  return {
    id: `seed-${index}`,
    name: station.name,
    address: station.address,
    lat: null,
    lng: null,
    phone: station.phone || null,
    operating_hours: station.operating_hours,
    station_type: station.station_type,
    source_url: station.source,
    region: station.region,
  };
}

/**
 * Get default stations (fallback when DB is empty)
 * Contains all fixed blood donation centers across Taiwan
 */
export async function getDefaultStations(): Promise<BloodStationRow[]> {
  return ALL_FIXED_STATIONS.map((s, i) => rawToRow(s, i));
}
