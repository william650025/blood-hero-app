'use client';

import { create } from 'zustand';
import type { DonationType } from '@/lib/donation-rules';

export interface DonationRecord {
  id: string;
  date: string;
  type: DonationType;
  location: string;
  volume: number;
  notes?: string;
}

interface DonationStats {
  totalCount: number;
  totalVolume: number;
  lastDonation: DonationRecord | null;
}

interface DonationState {
  records: DonationRecord[];
  stats: DonationStats;
  isLoading: boolean;
  setRecords: (records: DonationRecord[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useDonationStore = create<DonationState>((set) => ({
  records: [],
  stats: {
    totalCount: 0,
    totalVolume: 0,
    lastDonation: null,
  },
  isLoading: false,
  setRecords: (records) =>
    set({
      records,
      stats: {
        totalCount: records.length,
        totalVolume: records.reduce((sum, r) => sum + r.volume, 0),
        lastDonation: records[0] || null,
      },
    }),
  setLoading: (isLoading) => set({ isLoading }),
}));
