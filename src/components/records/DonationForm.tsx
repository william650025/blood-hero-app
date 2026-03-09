'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DONATION_TYPE_LABELS, type DonationType } from '@/lib/donation-rules';
import { createDonationRecord, updateDonationRecord } from '@/lib/actions/donations';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DonationFormProps {
  mode: 'create' | 'edit';
  recordId?: string;
  defaultValues?: {
    donation_date: string;
    donation_type: DonationType;
    location_name: string;
    notes: string;
  };
}

export function DonationForm({ mode, recordId, defaultValues }: DonationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationDate, setDonationDate] = useState(
    defaultValues?.donation_date || new Date().toISOString().split('T')[0]
  );
  const [donationType, setDonationType] = useState<DonationType>(
    defaultValues?.donation_type || 'whole_250'
  );
  const [locationName, setLocationName] = useState(defaultValues?.location_name || '');
  const [notes, setNotes] = useState(defaultValues?.notes || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationDate || !donationType) {
      toast.error('請填寫必要欄位');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        donation_date: donationDate,
        donation_type: donationType,
        location_name: locationName,
        notes,
      };

      const result =
        mode === 'edit' && recordId
          ? await updateDonationRecord(recordId, formData)
          : await createDonationRecord(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(mode === 'edit' ? '紀錄已更新' : '紀錄已新增');
        router.push('/records');
        router.refresh();
      }
    } catch {
      toast.error('發生錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-5 pt-6">
          {/* Donation Date */}
          <div className="space-y-2">
            <Label htmlFor="donation_date">捐血日期 *</Label>
            <Input
              id="donation_date"
              type="date"
              value={donationDate}
              onChange={(e) => setDonationDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Donation Type */}
          <div className="space-y-2">
            <Label htmlFor="donation_type">捐血類型 *</Label>
            <Select
              value={donationType}
              onValueChange={(v) => setDonationType(v as DonationType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇捐血類型" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DONATION_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location_name">捐血地點</Label>
            <Input
              id="location_name"
              type="text"
              placeholder="例如：台北捐血中心"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">備註</Label>
            <textarea
              id="notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="其他備註..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                處理中...
              </>
            ) : mode === 'edit' ? (
              '更新紀錄'
            ) : (
              '新增紀錄'
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
