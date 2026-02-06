'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

function AuthContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || undefined;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
            <span className="text-slate-900 font-bold text-xl">C</span>
          </div>
          <span className="text-2xl font-semibold text-white tracking-tight">Charlie</span>
        </div>

        <AuthForm redirectTo={redirectTo} />

        <div className="mt-6 text-center">
          <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
