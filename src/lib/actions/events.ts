'use server';

import { createClient } from '@/lib/supabase/server';

export interface DonationEventRow {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  organizer: string | null;
  source_url: string | null;
}

export async function fetchDonationEvents() {
  const supabase = await createClient();

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('donation_events')
    .select('*')
    .gte('end_date', today)
    .order('start_date', { ascending: true });

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as DonationEventRow[] };
}

// Sample events for when DB is empty
export const SAMPLE_EVENTS: DonationEventRow[] = [
  {
    id: 'sample-1',
    title: '春季校園捐血活動',
    description: '歡迎各位同學一起參與捐血，幫助有需要的人！現場提供小禮物。',
    location: '台灣大學綜合體育館前',
    start_date: '2026-03-15',
    end_date: '2026-03-16',
    organizer: '台灣血液基金會',
    source_url: null,
  },
  {
    id: 'sample-2',
    title: '捐血一袋，救人一命',
    description: '假日捐血活動，歡迎闔家參加。捐血者可獲得限量紀念品。',
    location: '台北市信義區新光三越 A8 館前',
    start_date: '2026-03-22',
    end_date: '2026-03-22',
    organizer: '台灣血液基金會',
    source_url: null,
  },
  {
    id: 'sample-3',
    title: '企業聯合捐血日',
    description: '多家企業共同響應捐血活動，展現企業社會責任。',
    location: '台中市政府廣場',
    start_date: '2026-04-01',
    end_date: '2026-04-02',
    organizer: '台中捐血中心',
    source_url: null,
  },
  {
    id: 'sample-4',
    title: '世界捐血者日特別活動',
    description: '慶祝世界捐血者日，感謝每一位捐血者的無私奉獻。',
    location: '高雄市夢時代購物中心',
    start_date: '2026-06-14',
    end_date: '2026-06-14',
    organizer: '高雄捐血中心',
    source_url: null,
  },
];
