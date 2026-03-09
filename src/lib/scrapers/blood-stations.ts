/**
 * Blood Station Data Fetcher
 * 
 * Sources:
 * 1. Taichung City Open Data - Mobile & Fixed Donation Points (XML/JSON API)
 * 2. Tainan City Open Data - Mobile & Fixed Donation Points
 * 3. Hardcoded major blood centers across Taiwan
 */

import { XMLParser } from 'fast-xml-parser';

export interface RawStation {
  name: string;
  address: string;
  operating_hours: string;
  phone?: string;
  station_type: 'fixed_station' | 'mobile_bus';
  source: string;
}

// Major blood centers in Taiwan (manually maintained)
export const MAJOR_CENTERS: RawStation[] = [
  {
    name: '台北捐血中心',
    address: '台北市中正區南海路2號',
    operating_hours: '週一至週日 09:00-17:30',
    phone: '02-2341-7281',
    station_type: 'fixed_station',
    source: 'manual',
  },
  {
    name: '台北捐血中心西門固定點',
    address: '台北市萬華區昆明街96號2樓',
    operating_hours: '週一至週日 10:00-18:00',
    phone: '02-2361-5乘30',
    station_type: 'fixed_station',
    source: 'manual',
  },
  {
    name: '新竹捐血中心',
    address: '新竹市東區食品路282號',
    operating_hours: '週一至週日 09:00-17:00',
    phone: '03-578-8308',
    station_type: 'fixed_station',
    source: 'manual',
  },
  {
    name: '台中捐血中心',
    address: '台中市北區忠明路288號',
    operating_hours: '週一至週日 09:00-17:30',
    phone: '04-2203-7155',
    station_type: 'fixed_station',
    source: 'manual',
  },
  {
    name: '高雄捐血中心',
    address: '高雄市前鎮區翠亨北路359號',
    operating_hours: '週一至週日 09:00-17:30',
    phone: '07-811-9966',
    station_type: 'fixed_station',
    source: 'manual',
  },
  {
    name: '台南捐血中心',
    address: '台南市東區林森路一段191號',
    operating_hours: '週一至週日 09:00-17:00',
    phone: '06-237-3645',
    station_type: 'fixed_station',
    source: 'manual',
  },
  {
    name: '花蓮捐血站',
    address: '花蓮縣花蓮市中山路123號',
    operating_hours: '週一至週六 09:00-17:00',
    phone: '03-833-0511',
    station_type: 'fixed_station',
    source: 'manual',
  },
];

// Taichung Open Data API endpoints
const TAICHUNG_MOBILE_URL =
  'https://datacenter.taichung.gov.tw/swagger/OpenData/5b95e7c4-54a4-426b-8f09-2a26a014c9d9';
const TAICHUNG_FIXED_URL =
  'https://datacenter.taichung.gov.tw/swagger/OpenData/635d8dd2-c5ae-436c-a2ec-23aa0f583b4b';

async function fetchTaichungStations(): Promise<RawStation[]> {
  const stations: RawStation[] = [];
  const parser = new XMLParser();

  try {
    // Fetch mobile donation points
    const mobileRes = await fetch(TAICHUNG_MOBILE_URL, { signal: AbortSignal.timeout(10000) });
    if (mobileRes.ok) {
      const xml = await mobileRes.text();
      const parsed = parser.parse(xml);
      const items = parsed?.root?.item;
      if (Array.isArray(items)) {
        for (const item of items) {
          stations.push({
            name: String(item['巡迴捐血點'] || item['name'] || ''),
            address: String(item['地址'] || item['address'] || ''),
            operating_hours: String(item['作業時間'] || item['hours'] || ''),
            station_type: 'mobile_bus',
            source: 'taichung_opendata',
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch Taichung mobile stations:', err);
  }

  try {
    // Fetch fixed donation points
    const fixedRes = await fetch(TAICHUNG_FIXED_URL, { signal: AbortSignal.timeout(10000) });
    if (fixedRes.ok) {
      const xml = await fixedRes.text();
      const parsed = parser.parse(xml);
      const items = parsed?.root?.item;
      if (Array.isArray(items)) {
        for (const item of items) {
          stations.push({
            name: String(item['固定捐血點'] || item['捐血點'] || item['name'] || ''),
            address: String(item['地址'] || item['address'] || ''),
            operating_hours: String(item['作業時間'] || item['hours'] || ''),
            phone: item['電話'] ? String(item['電話']) : undefined,
            station_type: 'fixed_station',
            source: 'taichung_opendata',
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch Taichung fixed stations:', err);
  }

  return stations.filter((s) => s.name && s.address);
}

/**
 * Fetch all blood stations from available data sources
 */
export async function fetchAllStations(): Promise<RawStation[]> {
  const allStations: RawStation[] = [...MAJOR_CENTERS];

  // Fetch from open data APIs
  const taichungStations = await fetchTaichungStations();
  allStations.push(...taichungStations);

  return allStations;
}
