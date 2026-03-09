'use client';

import { Header } from '@/components/layout/Header';
import { DonationForm } from '@/components/records/DonationForm';

export default function NewRecordPage() {
  return (
    <div>
      <Header title="新增紀錄" />
      <div className="p-4">
        <DonationForm mode="create" />
      </div>
    </div>
  );
}
