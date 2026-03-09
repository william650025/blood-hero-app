// 捐血類型
export type DonationType = 'whole_250' | 'whole_500' | 'platelet' | 'leukocyte';

// 性別
export type Gender = 'male' | 'female';

// 捐血類型顯示名稱
export const DONATION_TYPE_LABELS: Record<DonationType, string> = {
  whole_250: '全血 250ml',
  whole_500: '全血 500ml',
  platelet: '分離術血小板',
  leukocyte: '分離術白血球',
};

// 捐血間隔規則（天數）
const DONATION_INTERVALS: Record<DonationType, Record<Gender, number>> = {
  whole_250: {
    male: 60,   // 2 個月
    female: 90, // 3 個月
  },
  whole_500: {
    male: 90,   // 3 個月
    female: 120, // 4 個月
  },
  platelet: {
    male: 14,   // 2 週
    female: 14, // 2 週
  },
  leukocyte: {
    male: 30,   // 1 個月
    female: 30, // 1 個月
  },
};

/**
 * 取得捐血間隔天數
 */
export function getDonationIntervalDays(
  donationType: DonationType,
  gender: Gender
): number {
  return DONATION_INTERVALS[donationType][gender];
}

/**
 * 計算下次可捐血日期
 */
export function calculateNextEligibleDate(
  donationDate: Date,
  donationType: DonationType,
  gender: Gender
): Date {
  const intervalDays = getDonationIntervalDays(donationType, gender);
  const nextDate = new Date(donationDate);
  nextDate.setHours(0, 0, 0, 0);
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate;
}

/**
 * 檢查今天是否可以捐血
 */
export function isEligibleToday(
  lastDonationDate: Date,
  lastDonationType: DonationType,
  gender: Gender
): boolean {
  const nextEligible = calculateNextEligibleDate(
    lastDonationDate,
    lastDonationType,
    gender
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today >= nextEligible;
}

/**
 * 計算距離下次可捐血的剩餘天數（若已可捐血則回傳 0）
 */
export function getDaysUntilEligible(
  lastDonationDate: Date,
  lastDonationType: DonationType,
  gender: Gender
): number {
  const nextEligible = calculateNextEligibleDate(
    lastDonationDate,
    lastDonationType,
    gender
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = nextEligible.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
