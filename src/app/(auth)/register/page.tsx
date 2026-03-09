'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { signUp } from '@/lib/auth';
import { ArrowLeft, Mail, Lock, User, ChevronRight } from 'lucide-react';

type BloodType = 'A' | 'B' | 'O' | 'AB';
type Gender = 'male' | 'female';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [bloodType, setBloodType] = useState<BloodType | ''>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = () => {
    if (password.length === 0) return { level: 0, label: '', color: '' };
    if (password.length < 6) return { level: 1, label: '弱', color: 'bg-error' };
    if (password.length < 10) return { level: 2, label: '中等', color: 'bg-warning' };
    return { level: 3, label: '強', color: 'bg-success' };
  };

  const strength = getPasswordStrength();

  const canProceedStep1 =
    email.includes('@') &&
    password.length >= 6 &&
    confirmPassword === password;

  const canProceedStep2 =
    displayName.trim() !== '' && gender !== '' && bloodType !== '';

  const handleNextStep = () => {
    setError('');
    if (!email.includes('@')) {
      setError('請輸入有效的 Email 地址');
      return;
    }
    if (password.length < 6) {
      setError('密碼至少需要 6 個字元');
      return;
    }
    if (password !== confirmPassword) {
      setError('兩次密碼輸入不一致');
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    setError('');
    if (!displayName.trim()) {
      setError('請輸入姓名');
      return;
    }
    if (!gender) {
      setError('請選擇性別');
      return;
    }
    if (!bloodType) {
      setError('請選擇血型');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(email, password, displayName, gender || undefined, bloodType || undefined);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/');
      }
    } catch {
      setError('註冊時發生錯誤，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 items-center border-b border-border px-4">
        <button
          onClick={() => (step === 2 ? setStep(1) : router.back())}
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold">註冊</h1>
        <div className="w-5" />
      </header>

      <div className="flex flex-1 flex-col items-center px-4 pt-8">
        <div className="w-full max-w-sm space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  step >= 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                1
              </div>
              <span className="text-xs text-muted-foreground">帳號資料</span>
            </div>
            <div
              className={`h-0.5 w-12 ${
                step >= 2 ? 'bg-primary-600' : 'bg-muted'
              }`}
            />
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  step >= 2
                    ? 'bg-primary-600 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                2
              </div>
              <span className="text-xs text-muted-foreground">個人資料</span>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="space-y-4 pt-6">
              {step === 1 ? (
                /* Step 1: Account Info */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="請輸入 Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">密碼</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="請輸入密碼（至少 6 字元）"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {password.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex h-1.5 flex-1 gap-1">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`h-full flex-1 rounded-full ${
                                i <= strength.level ? strength.color : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {strength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">確認密碼</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="再次輸入密碼"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-xs text-error">密碼不一致</p>
                    )}
                  </div>

                  {error && <p className="text-sm text-error">{error}</p>}

                  <Button
                    className="w-full rounded-full bg-primary-600 text-white hover:bg-primary-700"
                    disabled={!canProceedStep1}
                    onClick={handleNextStep}
                  >
                    下一步
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                /* Step 2: Personal Info */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">姓名</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="請輸入姓名"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>性別</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { value: 'male', label: '男' },
                        { value: 'female', label: '女' },
                      ] as const).map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setGender(option.value)}
                          className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                            gender === option.value
                              ? 'border-primary-600 bg-primary-50 text-primary-600'
                              : 'border-border bg-background text-foreground hover:border-primary-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>血型</Label>
                    <div className="grid grid-cols-4 gap-3">
                      {(['A', 'B', 'O', 'AB'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setBloodType(type)}
                          className={`rounded-lg border-2 px-3 py-3 text-sm font-medium transition-colors ${
                            bloodType === type
                              ? 'border-primary-600 bg-primary-50 text-primary-600'
                              : 'border-border bg-background text-foreground hover:border-primary-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <p className="text-sm text-error">{error}</p>}

                  <Button
                    className="w-full rounded-full bg-primary-600 text-white hover:bg-primary-700"
                    disabled={!canProceedStep2 || isLoading}
                    onClick={handleRegister}
                  >
                    {isLoading ? '註冊中...' : '完成註冊'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            已有帳號？{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:underline">
              登入
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
