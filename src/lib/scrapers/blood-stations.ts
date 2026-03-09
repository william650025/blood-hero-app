/**
 * Blood Station Data Fetcher
 *
 * Sources:
 * 1. Hardcoded: All fixed blood donation centers/rooms across Taiwan (from blood.org.tw)
 * 2. Taichung City Open Data API - Mobile donation points (XML)
 */

import { XMLParser } from 'fast-xml-parser';

export interface RawStation {
  name: string;
  address: string;
  operating_hours: string;
  phone?: string;
  station_type: 'fixed_station' | 'mobile_bus';
  source: string;
  region?: string;
}

// ============================================================
// All fixed blood donation centers/rooms in Taiwan
// Data source: blood.org.tw (台灣血液基金會)
// ============================================================
export const ALL_FIXED_STATIONS: RawStation[] = [
  // ---- 台北捐血中心轄區 ----
  {
    name: '台北捐血中心',
    address: '台北市北投區立德路123號',
    operating_hours: '週一至週日 08:30-17:30',
    phone: '02-2897-1600',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台北',
  },
  {
    name: '關渡捐血室',
    address: '台北市北投區立德路123號',
    operating_hours: '週一至週日 09:00-17:00',
    phone: '02-2897-1600',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台北',
  },
  {
    name: '南海捐血室',
    address: '台北市中正區南海路1號3樓',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台北',
  },
  {
    name: '市府捐血室',
    address: '台北市信義區市府路1號',
    operating_hours: '週一至週五 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台北',
  },
  {
    name: '長春捐血室',
    address: '台北市松山區復興北路69號5樓',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台北',
  },
  {
    name: '忠孝捐血室',
    address: '台北市大安區忠孝東路四段地下街',
    operating_hours: '週一至週日 10:00-18:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台北',
  },
  {
    name: '公園號捐血車',
    address: '台北市中正區襄陽路與公園路口（228和平公園內）',
    operating_hours: '週一至週日 09:30-17:30',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台北',
  },
  {
    name: '峨嵋號捐血車',
    address: '台北市萬華區峨嵋街立體停車場旁',
    operating_hours: '週一至週日 09:30-17:30',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台北',
  },
  {
    name: '新光站前號捐血車',
    address: '台北市中正區忠孝西路一段66號新光摩天大樓左側',
    operating_hours: '週一至週日 09:30-17:30',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台北',
  },
  {
    name: '大安號捐血車',
    address: '台北市大安區建國南路二段地下停車場入口旁',
    operating_hours: '週一至週日 09:30-17:30',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台北',
  },
  {
    name: '新莊號捐血車',
    address: '新北市新莊區中華路一段與復興路一段交叉口',
    operating_hours: '週一至週日 09:30-17:30',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '新北',
  },
  {
    name: '汐止捐血點',
    address: '新北市汐止區大同路二段',
    operating_hours: '依排程公告',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '新北',
  },

  // ---- 新竹捐血中心轄區 ----
  {
    name: '新竹捐血中心',
    address: '新竹縣竹北市光明十一路215巷8號',
    operating_hours: '週一至週日 08:30-17:00',
    phone: '03-558-9乘07',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '新竹',
  },
  {
    name: '西大捐血室',
    address: '新竹市北區文雅街6號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '新竹',
  },
  {
    name: '長庚捐血室',
    address: '桃園市龜山區復興街5號（林口長庚醫院醫學大樓地下街）',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '桃園',
  },

  // ---- 台中捐血中心轄區 ----
  {
    name: '台中捐血中心',
    address: '台中市西屯區台灣大道四段1176號',
    operating_hours: '週一至週日 08:30-17:30',
    phone: '04-2461-5乘50',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台中',
  },
  {
    name: '三民捐血室（台中）',
    address: '台中市北區三民路一段174號7樓',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台中',
  },
  {
    name: '豐原捐血室',
    address: '台中市豐原區北陽路2號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台中',
  },
  {
    name: '海線捐血室',
    address: '台中市清水區中華路一段1001之1號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台中',
  },
  {
    name: '彰化捐血站',
    address: '彰化縣彰化市中山路一段348號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '彰化',
  },
  {
    name: '員林捐血室',
    address: '彰化縣員林市民權街55號（員林火車站一樓大廳）',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '彰化',
  },
  {
    name: '埔里捐血站',
    address: '南投縣埔里鎮北環路222號',
    operating_hours: '週一至週六 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '南投',
  },
  {
    name: '雲林捐血站',
    address: '雲林縣斗六市漢口路187號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '雲林',
  },

  // ---- 台南捐血中心轄區 ----
  {
    name: '台南捐血中心',
    address: '台南市東區林森路一段191號',
    operating_hours: '週一至週日 08:30-17:00',
    phone: '06-237-3645',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台南',
  },

  // ---- 高雄捐血中心轄區 ----
  {
    name: '高雄捐血中心',
    address: '高雄市楠梓區高楠公路1837號',
    operating_hours: '週一至週日 08:30-17:30',
    phone: '07-365-3乘17',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '高雄',
  },
  {
    name: '楠梓捐血室',
    address: '高雄市楠梓區高楠公路1837號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '高雄',
  },
  {
    name: '前金捐血室',
    address: '高雄市前金區中華三路7號6樓',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '高雄',
  },
  {
    name: '左營捐血室',
    address: '高雄市左營區博愛三路635號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '高雄',
  },
  {
    name: '三民捐血室（高雄）',
    address: '高雄市三民區博愛一路220號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '高雄',
  },
  {
    name: '捷運前鎮捐血室',
    address: '高雄市前鎮區翠亨北路1號（捷運前鎮高中站B1）',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '高雄',
  },
  {
    name: '捷運鳳山捐血室',
    address: '高雄市鳳山區光遠路68號（捷運大東站B1）',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '高雄',
  },
  {
    name: '岡山捐血室',
    address: '高雄市岡山區壽華路58號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '高雄',
  },
  {
    name: '屏東捐血站',
    address: '屏東縣屏東市和平路71號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '屏東',
  },
  {
    name: '嘉義捐血站',
    address: '嘉義市西區博愛路一段488號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '嘉義',
  },
  {
    name: '垂楊捐血室',
    address: '嘉義市東區垂楊路132號',
    operating_hours: '週一至週日 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '嘉義',
  },

  // ---- 花蓮 / 台東 ----
  {
    name: '花蓮捐血站',
    address: '花蓮縣花蓮市中山路123號',
    operating_hours: '週一至週六 09:00-17:00',
    phone: '03-833-0511',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '花蓮',
  },
  {
    name: '台東捐血站',
    address: '台東縣台東市博愛路401號',
    operating_hours: '週一至週五 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '台東',
  },

  // ---- 宜蘭 / 基隆 ----
  {
    name: '宜蘭捐血站',
    address: '宜蘭縣宜蘭市中山路三段156號',
    operating_hours: '週一至週六 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '宜蘭',
  },
  {
    name: '基隆捐血站',
    address: '基隆市仁愛區愛三路26號',
    operating_hours: '週一至週六 09:00-17:00',
    station_type: 'fixed_station',
    source: 'blood.org.tw',
    region: '基隆',
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
    const mobileRes = await fetch(TAICHUNG_MOBILE_URL, {
      signal: AbortSignal.timeout(10000),
    });
    if (mobileRes.ok) {
      const xml = await mobileRes.text();
      const parsed = parser.parse(xml);
      const items = parsed?.root?.item;
      if (Array.isArray(items)) {
        for (const item of items) {
          stations.push({
            name: String(item['巡迴捐血點'] || ''),
            address: String(item['地址'] || ''),
            operating_hours: String(item['作業時間'] || ''),
            station_type: 'mobile_bus',
            source: 'taichung_opendata',
            region: '台中',
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch Taichung mobile stations:', err);
  }

  try {
    const fixedRes = await fetch(TAICHUNG_FIXED_URL, {
      signal: AbortSignal.timeout(10000),
    });
    if (fixedRes.ok) {
      const xml = await fixedRes.text();
      const parsed = parser.parse(xml);
      const items = parsed?.root?.item;
      if (Array.isArray(items)) {
        for (const item of items) {
          stations.push({
            name: String(item['固定捐血點'] || item['捐血點'] || ''),
            address: String(item['地址'] || ''),
            operating_hours: String(item['作業時間'] || ''),
            phone: item['電話'] ? String(item['電話']) : undefined,
            station_type: 'fixed_station',
            source: 'taichung_opendata',
            region: '台中',
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
  const allStations: RawStation[] = [...ALL_FIXED_STATIONS];

  // Fetch from open data APIs (台中巡迴捐血車)
  const taichungStations = await fetchTaichungStations();

  // Deduplicate by name
  const existingNames = new Set(allStations.map((s) => s.name));
  for (const s of taichungStations) {
    if (!existingNames.has(s.name)) {
      allStations.push(s);
      existingNames.add(s.name);
    }
  }

  return allStations;
}
