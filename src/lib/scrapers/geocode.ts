/**
 * Simple geocoding using Nominatim (OpenStreetMap)
 * Rate limit: max 1 request per second
 */

interface GeoResult {
  lat: number;
  lng: number;
}

const CACHE = new Map<string, GeoResult | null>();

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Geocode a Taiwan address using Nominatim
 */
export async function geocodeAddress(address: string): Promise<GeoResult | null> {
  if (CACHE.has(address)) return CACHE.get(address) || null;

  try {
    const q = encodeURIComponent(address);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&countrycodes=tw&limit=1`,
      {
        headers: { 'User-Agent': 'BloodHero/1.0 (blood-hero-app)' },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      CACHE.set(address, null);
      return null;
    }

    const data = await res.json();
    if (data.length > 0) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      CACHE.set(address, result);
      return result;
    }

    CACHE.set(address, null);
    return null;
  } catch {
    CACHE.set(address, null);
    return null;
  }
}

/**
 * Batch geocode addresses with rate limiting (1 req/sec for Nominatim)
 */
export async function batchGeocode(
  addresses: string[]
): Promise<Map<string, GeoResult | null>> {
  const results = new Map<string, GeoResult | null>();

  for (const addr of addresses) {
    const result = await geocodeAddress(addr);
    results.set(addr, result);
    // Respect Nominatim rate limit
    await sleep(1100);
  }

  return results;
}
