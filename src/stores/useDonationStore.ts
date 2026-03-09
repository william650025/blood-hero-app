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

// Mock data
const mockRecords: DonationRecord[] = [
  {
    id: '1',
    date: '2025-12-15',
    type: 'whole_250',
    location: '台北捐血中心',
    volume: 250,
  },
  {
    id: '2',
    date: '2025-09-20',
    type: 'whole_500',
    location: '新竹捐血站',
    volume: 500,
  },
  {
    id: '3',
    date: '2025-06-10',
    type: 'platelet',
    location: '台中捐血中心',
    volume: 250,
    notes: '分離術捐血',
  },
];

export const useDonationStore = create<DonationState>((set) => ({
  records: mockRecords,
  stats: {
    totalCount: mockRecords.length,
    totalVolume: mockRecords.reduce((sum, r) => sum + r.volume, 0),
    lastDonation: mockRecords[0],
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
