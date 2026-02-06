'use client';

import Link from 'next/link';
import { Portfolio, AnalyticsOutput, RiskFlag } from '@/types';
import { FlagsList } from '@/components/ui';

export interface RisksScreenProps {
  portfolio: Portfolio | null;
  analytics: AnalyticsOutput | null;
  isLoading?: boolean;
  backLink?: string;
}

const getSeverityCount = (flags: RiskFlag[], severity: string) => {
  return flags.filter((f) => f.severity === severity).length;
};

export function RisksScreen({
  portfolio,
  analytics,
  isLoading = false,
  backLink = '/dashboard',
}: RisksScreenProps) {
  if (isLoading || !portfolio || !analytics) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  const flags = analytics.flags || [];
  const highCount = getSeverityCount(flags, 'high');
  const mediumCount = getSeverityCount(flags, 'medium');
  const lowCount = flags.length - highCount - mediumCount;

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
          <h1 className="text-2xl font-semibold text-slate-900">Risk Analysis</h1>
          <p className="text-sm text-slate-600">Key risk indicators for your portfolio</p>
        </div>
      </div>

      {/* Risk Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900 mb-4">Risk Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-3xl font-semibold tracking-tight text-red-600">{highCount}</p>
            <p className="text-xs text-red-700 font-medium">High Priority</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-3xl font-semibold tracking-tight text-amber-600">{mediumCount}</p>
            <p className="text-xs text-amber-700 font-medium">Medium Priority</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-3xl font-semibold tracking-tight text-blue-600">{lowCount}</p>
            <p className="text-xs text-blue-700 font-medium">Low Priority</p>
          </div>
        </div>
      </div>

      {/* Flags List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900 mb-4">Risk Flags</h2>
        <FlagsList flags={flags} />
      </div>
    </div>
  );
}
