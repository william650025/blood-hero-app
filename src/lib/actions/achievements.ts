'use server';

import { createClient } from '@/lib/supabase/server';

export interface AchievementRow {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  threshold_count: number;
  achievement_type: string;
}

export interface UserAchievementRow {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface AchievementWithStatus extends AchievementRow {
  earned: boolean;
  earned_at: string | null;
}

// Predefined achievements
export const DEFAULT_ACHIEVEMENTS: AchievementRow[] = [
  {
    id: 'ach-1',
    name: '初心者',
    description: '完成第一次捐血',
    icon: '🩸',
    threshold_count: 1,
    achievement_type: 'donation_count',
  },
  {
    id: 'ach-3',
    name: '熱血青年',
    description: '累計捐血 3 次',
    icon: '🔥',
    threshold_count: 3,
    achievement_type: 'donation_count',
  },
  {
    id: 'ach-5',
    name: '捐血達人',
    description: '累計捐血 5 次',
    icon: '⭐',
    threshold_count: 5,
    achievement_type: 'donation_count',
  },
  {
    id: 'ach-10',
    name: '捐血英雄',
    description: '累計捐血 10 次',
    icon: '🏅',
    threshold_count: 10,
    achievement_type: 'donation_count',
  },
  {
    id: 'ach-20',
    name: '捐血勇士',
    description: '累計捐血 20 次',
    icon: '🏆',
    threshold_count: 20,
    achievement_type: 'donation_count',
  },
  {
    id: 'ach-50',
    name: '生命守護者',
    description: '累計捐血 50 次',
    icon: '💎',
    threshold_count: 50,
    achievement_type: 'donation_count',
  },
  {
    id: 'ach-100',
    name: '傳奇捐血者',
    description: '累計捐血 100 次',
    icon: '👑',
    threshold_count: 100,
    achievement_type: 'donation_count',
  },
];

export async function fetchAchievementsWithStatus(): Promise<{
  error: string | null;
  data: AchievementWithStatus[] | null;
  donationCount: number;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未登入', data: null, donationCount: 0 };

  // Get donation count
  const { count } = await supabase
    .from('donation_records')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const donationCount = count || 0;

  // Try fetching from DB, fall back to defaults
  const { data: dbAchievements } = await supabase
    .from('achievements')
    .select('*')
    .order('threshold_count');

  const achievements =
    dbAchievements && dbAchievements.length > 0
      ? (dbAchievements as AchievementRow[])
      : DEFAULT_ACHIEVEMENTS;

  // Get user's earned achievements
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', user.id);

  const earnedMap = new Map(
    (userAchievements || []).map((ua: UserAchievementRow) => [
      ua.achievement_id,
      ua.earned_at,
    ])
  );

  const result: AchievementWithStatus[] = achievements.map((ach) => ({
    ...ach,
    earned:
      earnedMap.has(ach.id) || donationCount >= ach.threshold_count,
    earned_at: earnedMap.get(ach.id) || null,
  }));

  return { error: null, data: result, donationCount };
}
