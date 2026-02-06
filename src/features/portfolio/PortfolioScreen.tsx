'use client';

import Link from 'next/link';
import { Portfolio, AnalyticsOutput } from '@/types';
import { PositionsTable, AllocationBars } from '@/components/ui';

export interface PortfolioScreenProps {
  portfolio: Portfolio | null;
  analytics: AnalyticsOutput | null;
  isLoading?: boolean;
  backLink?: string;
}

export function PortfolioScreen({
  portfolio,
  analytics,
  isLoading = false,
  backLink = '/dashboard',
}: PortfolioScreenProps) {
  if (isLoading || !portfolio || !analytics) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
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
          <h1 className="text-2xl font-semibold text-slate-900">Portfolio Overview</h1>
          <p className="text-sm text-slate-600">Detailed breakdown of your holdings</p>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-slate-950 text-slate-100 border border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-slate-300/80 mb-1">Total Portfolio Value</p>
            <p className="text-4xl font-semibold tracking-tight text-white">€{portfolio.total_value_eur.toLocaleString()}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg ${portfolio.total_pnl_percent >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            <p className={`text-lg font-semibold ${portfolio.total_pnl_percent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {portfolio.total_pnl_percent >= 0 ? '+' : ''}{portfolio.total_pnl_percent.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-slate-400 mb-1">Unrealized P&L</p>
            <p className={`text-lg font-semibold ${portfolio.total_pnl_eur >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {portfolio.total_pnl_eur >= 0 ? '+' : ''}€{portfolio.total_pnl_eur.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Positions</p>
            <p className="text-lg font-semibold text-white">{portfolio.position_count}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Profile</p>
            <p className="text-lg font-semibold text-white capitalize">{portfolio.profile}</p>
          </div>
        </div>
      </div>

      {/* Allocation Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-medium text-slate-900 mb-4">Asset Allocation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wide mb-3">By Asset Class</p>
            <AllocationBars allocations={analytics.allocations_by_asset_class} title="By Asset Class" />
          </div>
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wide mb-3">By Region</p>
            <AllocationBars allocations={analytics.allocations_by_region} title="By Region" />
          </div>
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wide mb-3">By Currency</p>
            <AllocationBars allocations={analytics.allocations_by_currency.slice(0, 5)} title="By Currency" />
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-sm font-medium text-slate-900">Holdings</h2>
        </div>
        <PositionsTable positions={portfolio.positions} />
      </div>
    </div>
  );
}
