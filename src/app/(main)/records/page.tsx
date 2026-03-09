'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DONATION_TYPE_LABELS, type DonationType } from '@/lib/donation-rules';
import { fetchDonationRecords, deleteDonationRecord, type DonationRecordRow } from '@/lib/actions/donations';
import {
  PlusCircle,
  Pencil,
  Trash2,
  Droplets,
  MapPin,
  Calendar,
  Loader2,
  ClipboardList,
} from 'lucide-react';
import { toast } from 'sonner';

export default function RecordsPage() {
  const [records, setRecords] = useState<DonationRecordRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadRecords() {
      setIsLoading(true);
      const result = await fetchDonationRecords();
      if (!cancelled && result.data) {
        setRecords(result.data);
      }
      if (!cancelled) setIsLoading(false);
    }
    loadRecords();
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await deleteDonationRecord(deleteTarget);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('紀錄已刪除');
      setRecords((prev) => prev.filter((r) => r.id !== deleteTarget));
    }
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div>
      <Header title="捐血紀錄" />

      <div className="space-y-4 p-4">
        {/* Add Button */}
        <Link href="/records/new">
          <Button className="w-full bg-primary-600 hover:bg-primary-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            新增捐血紀錄
          </Button>
        </Link>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && records.length === 0 && (
          <Card className="border-0 bg-primary-50">
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <ClipboardList className="h-12 w-12 text-primary-300" />
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground">
                  還沒有紀錄
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  點擊上方按鈕開始記錄你的捐血歷程
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Records List */}
        {!isLoading &&
          records.map((record) => (
            <Card key={record.id}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">
                        {formatDate(record.donation_date)}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-primary-100 text-primary-700">
                      <Droplets className="mr-1 h-3 w-3" />
                      {DONATION_TYPE_LABELS[record.donation_type as DonationType]}
                    </Badge>
                    {record.location_name && (
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {record.location_name}
                      </p>
                    )}
                    {record.notes && (
                      <p className="text-sm text-muted-foreground italic">
                        {record.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/records/${record.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setDeleteTarget(record.id)}
                    >
                      <Trash2 className="h-4 w-4 text-error" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
            <DialogDescription>
              確定要刪除這筆捐血紀錄嗎？此操作無法復原。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
