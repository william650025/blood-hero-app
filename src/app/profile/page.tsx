'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchProfile, updateProfile, type ProfileRow } from '@/lib/actions/profile';
import { signOut } from '@/lib/auth';
import { ArrowLeft, User, LogOut, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const BLOOD_TYPES = ['A', 'B', 'O', 'AB'] as const;
const GENDER_LABELS: Record<string, string> = {
  male: '男',
  female: '女',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');

  useEffect(() => {
    async function load() {
      const result = await fetchProfile();
      if (result.data) {
        setProfile(result.data);
        setEmail(result.email || '');
        setDisplayName(result.data.display_name || '');
        setGender(result.data.gender || '');
        setBloodType(result.data.blood_type || '');
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateProfile({
      display_name: displayName,
      gender,
      blood_type: bloodType,
    });
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('個人資料已更新');
      setIsEditing(false);
      // Update local state
      setProfile((prev) =>
        prev
          ? { ...prev, display_name: displayName, gender, blood_type: bloodType }
          : prev
      );
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-md bg-background">
        <header className="flex h-14 items-center border-b border-border px-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold">個人檔案</h1>
          <div className="w-5" />
        </header>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background">
      {/* Header */}
      <header className="flex h-14 items-center border-b border-border px-4">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-center text-lg font-semibold">個人檔案</h1>
        <div className="w-5" />
      </header>

      <div className="space-y-4 p-4">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
            <User className="h-10 w-10 text-primary-600" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">
              {profile?.display_name || '未設定'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {profile?.blood_type ? `${profile.blood_type} 型` : ''}{' '}
              {profile?.gender ? `· ${GENDER_LABELS[profile.gender] || profile.gender}` : ''}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        {/* Profile Edit */}
        {isEditing ? (
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">顯示名稱</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="你的名字"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">性別</Label>
                <Select value={gender} onValueChange={(v) => setGender(v || '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇性別" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">血型</Label>
                <Select value={bloodType} onValueChange={(v) => setBloodType(v || '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇血型" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map((bt) => (
                      <SelectItem key={bt} value={bt}>
                        {bt} 型
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  取消
                </Button>
                <Button
                  className="flex-1 bg-primary-600 hover:bg-primary-700"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  儲存
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsEditing(true)}
          >
            編輯個人資料
          </Button>
        )}

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-error hover:text-error"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          登出
        </Button>
      </div>
    </div>
  );
}
