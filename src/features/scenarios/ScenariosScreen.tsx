'use client';

import Link from 'next/link';
import { AnalyticsOutput } from '@/types';
import { ScenarioCards } from '@/components/ui';

export interface ScenariosScreenProps {
  analytics: AnalyticsOutput | null;
  isLoading?: boolean;
  backLink?: string;
}

export function ScenariosScreen({
  analytics,
  isLoading = false,
  backLink = '/dashboard',
}: ScenariosScreenProps) {
  if (isLoading || !analytics) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={backLink} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Scenario Sensitivity</h1>
          <p className="text-sm text-slate-600">How market events could affect your portfolio</p>
        </div>
      </div>

      {/* Scenarios */}
      <ScenarioCards scenarios={analytics.scenarios} />
    </div>
  );
}
