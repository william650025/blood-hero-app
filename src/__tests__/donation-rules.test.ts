import { describe, it, expect } from 'vitest';
import {
  getDonationIntervalDays,
  calculateNextEligibleDate,
  isEligibleToday,
  getDaysUntilEligible,
  DONATION_TYPE_LABELS,
} from '@/lib/donation-rules';

describe('donation-rules', () => {
  describe('DONATION_TYPE_LABELS', () => {
    it('should have labels for all donation types', () => {
      expect(DONATION_TYPE_LABELS.whole_250).toBe('全血 250ml');
      expect(DONATION_TYPE_LABELS.whole_500).toBe('全血 500ml');
      expect(DONATION_TYPE_LABELS.platelet).toBe('分離術血小板');
      expect(DONATION_TYPE_LABELS.leukocyte).toBe('分離術白血球');
    });
  });

  describe('getDonationIntervalDays', () => {
    it('should return correct intervals for whole_250', () => {
      expect(getDonationIntervalDays('whole_250', 'male')).toBe(60);
      expect(getDonationIntervalDays('whole_250', 'female')).toBe(90);
    });

    it('should return correct intervals for whole_500', () => {
      expect(getDonationIntervalDays('whole_500', 'male')).toBe(90);
      expect(getDonationIntervalDays('whole_500', 'female')).toBe(120);
    });

    it('should return correct intervals for platelet', () => {
      expect(getDonationIntervalDays('platelet', 'male')).toBe(14);
      expect(getDonationIntervalDays('platelet', 'female')).toBe(14);
    });

    it('should return correct intervals for leukocyte', () => {
      expect(getDonationIntervalDays('leukocyte', 'male')).toBe(30);
      expect(getDonationIntervalDays('leukocyte', 'female')).toBe(30);
    });
  });

  describe('calculateNextEligibleDate', () => {
    it('should add 60 days for male whole_250', () => {
      const donationDate = new Date(2025, 0, 1); // Jan 1 2025 local time
      const next = calculateNextEligibleDate(donationDate, 'whole_250', 'male');
      const diffDays = Math.round(
        (next.getTime() - donationDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(diffDays).toBe(60);
    });

    it('should add 120 days for female whole_500', () => {
      const donationDate = new Date(2025, 5, 1); // Jun 1 2025
      const next = calculateNextEligibleDate(donationDate, 'whole_500', 'female');
      const diffDays = Math.round(
        (next.getTime() - donationDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(diffDays).toBe(120);
    });

    it('should add 14 days for platelet', () => {
      const donationDate = new Date(2025, 2, 1); // Mar 1 2025
      const next = calculateNextEligibleDate(donationDate, 'platelet', 'male');
      const diffDays = Math.round(
        (next.getTime() - donationDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(diffDays).toBe(14);
    });
  });

  describe('isEligibleToday', () => {
    it('should return true if enough time has passed', () => {
      const longAgo = new Date();
      longAgo.setDate(longAgo.getDate() - 365); // 1 year ago
      expect(isEligibleToday(longAgo, 'whole_500', 'female')).toBe(true);
    });

    it('should return false if not enough time has passed', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isEligibleToday(yesterday, 'whole_250', 'male')).toBe(false);
    });
  });

  describe('getDaysUntilEligible', () => {
    it('should return 0 if already eligible', () => {
      const longAgo = new Date();
      longAgo.setDate(longAgo.getDate() - 200);
      expect(getDaysUntilEligible(longAgo, 'whole_250', 'male')).toBe(0);
    });

    it('should return positive number if not yet eligible', () => {
      const today = new Date();
      const days = getDaysUntilEligible(today, 'whole_250', 'male');
      expect(days).toBeGreaterThan(0);
      expect(days).toBeLessThanOrEqual(60);
    });

    it('should never return negative', () => {
      const ancient = new Date('2000-01-01');
      expect(getDaysUntilEligible(ancient, 'whole_500', 'female')).toBe(0);
    });
  });
});
