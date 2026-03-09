import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchAllStations } from '@/lib/scrapers/blood-stations';
import { geocodeAddress } from '@/lib/scrapers/geocode';

// Use service role key for cron jobs (bypasses RLS)
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey);
}

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getAdminClient();
    const stations = await fetchAllStations();

    let inserted = 0;
    let updated = 0;
    let geocoded = 0;

    for (const station of stations) {
      // Check if station already exists by name
      const { data: existing } = await supabase
        .from('blood_stations')
        .select('id, lat, lng')
        .eq('name', station.name)
        .single();

      // Geocode if we don't have coordinates
      let lat = existing?.lat || null;
      let lng = existing?.lng || null;

      if (!lat || !lng) {
        const geo = await geocodeAddress(station.address);
        if (geo) {
          lat = geo.lat;
          lng = geo.lng;
          geocoded++;
        }
      }

      if (existing) {
        // Update existing station
        await supabase
          .from('blood_stations')
          .update({
            address: station.address,
            operating_hours: station.operating_hours,
            phone: station.phone || null,
            station_type: station.station_type,
            source_url: station.source,
            lat,
            lng,
            last_synced_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
        updated++;
      } else {
        // Insert new station
        await supabase.from('blood_stations').insert({
          name: station.name,
          address: station.address,
          operating_hours: station.operating_hours,
          phone: station.phone || null,
          station_type: station.station_type,
          source_url: station.source,
          lat,
          lng,
          last_synced_at: new Date().toISOString(),
        });
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      total: stations.length,
      inserted,
      updated,
      geocoded,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sync stations error:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}
