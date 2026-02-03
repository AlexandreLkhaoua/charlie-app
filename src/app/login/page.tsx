'use client';

import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const redirectTo = searchParams.get('redirectTo') || '/demo/dashboard';
      router.push(redirectTo);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
            <span className="text-slate-900 font-bold text-xl">C</span>
          </div>
          <span className="text-2xl font-semibold text-white tracking-tight">Charlie</span>
        </div>

        {/* Form */}
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400 mb-6">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-slate-900 hover:bg-slate-100"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-white hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
