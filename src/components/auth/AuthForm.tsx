'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  mode?: AuthMode;
  redirectTo?: string;
}

export function AuthForm({ mode: initialMode = 'login', redirectTo }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'signup') {
      // Validate passwords match
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Validate password strength
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push(redirectTo || '/dashboard');
          router.refresh();
        }, 2000);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push(redirectTo || '/dashboard');
        router.refresh();
      }
    }
  };

  if (success) {
    return (
      <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Account created!</h2>
        <p className="text-slate-400">
          Your account has been created successfully. Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'login'
              ? 'bg-white text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'signup'
              ? 'bg-white text-slate-900'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-slate-400">
          {mode === 'login'
            ? 'Sign in to your account to continue'
            : 'Start managing your portfolio with AI'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          {mode === 'signup' && (
            <p className="text-slate-500 text-xs mt-1">Must be at least 8 characters</p>
          )}
        </div>

        {mode === 'signup' && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-slate-900 hover:bg-slate-100"
        >
          {loading
            ? mode === 'login'
              ? 'Signing in...'
              : 'Creating account...'
            : mode === 'login'
            ? 'Sign In'
            : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
}
