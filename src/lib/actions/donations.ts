'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateNextEligibleDate, type DonationType, type Gender } from '@/lib/donation-rules';

export interface DonationRecordRow {
  id: string;
  user_id: string;
  donation_date: string;
  donation_type: DonationType;
  location_name: string | null;
  notes: string | null;
  next_eligible_date: string | null;
  created_at: string;
  updated_at: string;
}

// Volume mapping by donation type
const VOLUME_MAP: Record<DonationType, number> = {
  whole_250: 250,
  whole_500: 500,
  platelet: 250,
  leukocyte: 250,
};

export async function fetchDonationRecords() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未登入', data: null };

  const { data, error } = await supabase
    .from('donation_records')
    .select('*')
    .eq('user_id', user.id)
    .order('donation_date', { ascending: false });

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as DonationRecordRow[] };
}

export async function createDonationRecord(formData: {
  donation_date: string;
  donation_type: DonationType;
  location_name?: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未登入' };

  // Get user gender for next eligible date calculation
  const { data: profile } = await supabase
    .from('profiles')
    .select('gender')
    .eq('id', user.id)
    .single();

  const gender: Gender = (profile?.gender as Gender) || 'male';
  const nextEligible = calculateNextEligibleDate(
    new Date(formData.donation_date),
    formData.donation_type,
    gender
  );

  const { error } = await supabase.from('donation_records').insert({
    user_id: user.id,
    donation_date: formData.donation_date,
    donation_type: formData.donation_type,
    location_name: formData.location_name || null,
    notes: formData.notes || null,
    next_eligible_date: nextEligible.toISOString().split('T')[0],
  });

  if (error) return { error: error.message };
  return { error: null };
}

export async function updateDonationRecord(
  id: string,
  formData: {
    donation_date: string;
    donation_type: DonationType;
    location_name?: string;
    notes?: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未登入' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('gender')
    .eq('id', user.id)
    .single();

  const gender: Gender = (profile?.gender as Gender) || 'male';
  const nextEligible = calculateNextEligibleDate(
    new Date(formData.donation_date),
    formData.donation_type,
    gender
  );

  const { error } = await supabase
    .from('donation_records')
    .update({
      donation_date: formData.donation_date,
      donation_type: formData.donation_type,
      location_name: formData.location_name || null,
      notes: formData.notes || null,
      next_eligible_date: nextEligible.toISOString().split('T')[0],
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  return { error: null };
}

export async function deleteDonationRecord(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未登入' };

  const { error } = await supabase
    .from('donation_records')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  return { error: null };
}

export async function fetchDonationStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未登入', data: null };

  const { data: records, error } = await supabase
    .from('donation_records')
    .select('*')
    .eq('user_id', user.id)
    .order('donation_date', { ascending: false });

  if (error) return { error: error.message, data: null };

  const typedRecords = records as DonationRecordRow[];
  const totalCount = typedRecords.length;
  const totalVolume = typedRecords.reduce(
    (sum, r) => sum + VOLUME_MAP[r.donation_type as DonationType],
    0
  );
  const lastDonation = typedRecords[0] || null;

  return {
    error: null,
    data: { totalCount, totalVolume, lastDonation },
  };
}

export async function fetchSingleRecord(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未登入', data: null };

  const { data, error } = await supabase
    .from('donation_records')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as DonationRecordRow };
}
