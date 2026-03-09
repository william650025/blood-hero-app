'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { DonationForm } from '@/components/records/DonationForm';
import { fetchSingleRecord, type DonationRecordRow } from '@/lib/actions/donations';
import { Loader2 } from 'lucide-react';
import type { DonationType } from '@/lib/donation-rules';

export default function EditRecordPage() {
  const params = useParams();
  const id = params.id as string;
  const [record, setRecord] = useState<DonationRecordRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const result = await fetchSingleRecord(id);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setRecord(result.data);
      }
      setIsLoading(false);
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div>
        <Header title="編輯紀錄" />
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div>
        <Header title="編輯紀錄" />
        <div className="p-4 text-center text-muted-foreground">
          {error || '找不到紀錄'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="編輯紀錄" />
      <div className="p-4">
        <DonationForm
          mode="edit"
          recordId={record.id}
          defaultValues={{
            donation_date: record.donation_date,
            donation_type: record.donation_type as DonationType,
            location_name: record.location_name || '',
            notes: record.notes || '',
          }}
        />
      </div>
    </div>
  );
}
