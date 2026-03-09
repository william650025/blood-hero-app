'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { signIn, signInWithGoogle } from '@/lib/auth';
import { Droplets, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('請輸入有效的 Email 地址');
      return;
    }
    if (password.length < 6) {
      setError('密碼至少需要 6 個字元');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/');
      }
    } catch {
      setError('登入時發生錯誤，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      setError('Google 登入失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
            <Droplets className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-primary-600">捐血勇士</h1>
          <p className="text-sm text-muted-foreground">Blood Hero</p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-lg">
          <CardContent className="space-y-4 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    type={showPassword ? 'text' : 'password'}
                    placeholder="請輸入密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-error">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full rounded-full bg-primary-600 text-white hover:bg-primary-700"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? '登入中...' : '登入'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">或</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              使用 Google 登入
            </Button>
          </CardContent>
        </Card>

        {/* Register Link */}
        <p className="text-center text-sm text-muted-foreground">
          還沒有帳號？{' '}
          <Link href="/register" className="font-medium text-primary-600 hover:underline">
            立即註冊
          </Link>
        </p>
      </div>
    </div>
  );
}
