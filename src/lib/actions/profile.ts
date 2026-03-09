'use server';

import { createClient } from '@/lib/supabase/server';

export interface ProfileRow {
  id: string;
  display_name: string | null;
  gender: string | null;
  blood_type: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未登入', data: null };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return { error: error.message, data: null };
  return { error: null, data: data as ProfileRow, email: user.email };
}

export async function updateProfile(formData: {
  display_name?: string;
  gender?: string;
  blood_type?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '未登入' };

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: formData.display_name || null,
      gender: formData.gender || null,
      blood_type: formData.blood_type || null,
    })
    .eq('id', user.id);

  if (error) return { error: error.message };
  return { error: null };
}
