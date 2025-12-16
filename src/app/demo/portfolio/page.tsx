'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePortfolioContext } from '@/components/providers/PortfolioProvider';
import { dataProvider } from '@/lib';
import { Portfolio, AnalyticsOutput } from '@/types';

export default function PortfolioPage() {
  const { profile } = usePortfolioContext();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [portfolioData, analyticsData] = await Promise.all([
          dataProvider.getPortfolio(profile),
          dataProvider.getAnalytics(profile),
        ]);
        setPortfolio(portfolioData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [profile]);

  if (isLoading || !portfolio || !analytics) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/demo/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Portfolio Overview</h1>
          <p className="text-sm text-slate-500">Detailed breakdown of your holdings</p>
        </div>
      </div>

      {/* Performance Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-white/60 mb-1">Total Portfolio Value</p>
            <p className="text-4xl font-bold">€{portfolio.total_value_eur.toLocaleString()}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg ${portfolio.total_pnl_percent >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            <p className={`text-lg font-semibold ${portfolio.total_pnl_percent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {portfolio.total_pnl_percent >= 0 ? '+' : ''}{portfolio.total_pnl_percent.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-white/50 mb-1">Unrealized P&L</p>
            <p className={`text-lg font-semibold ${portfolio.total_pnl_eur >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {portfolio.total_pnl_eur >= 0 ? '+' : ''}€{portfolio.total_pnl_eur.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">Positions</p>
            <p className="text-lg font-semibold text-white">{portfolio.position_count}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">Profile</p>
            <p className="text-lg font-semibold text-white capitalize">{portfolio.profile}</p>
          </div>
        </div>
      </div>

      {/* Allocation Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-medium text-slate-700 mb-4">Asset Allocation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* By Asset Class */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">By Asset Class</p>
            <div className="space-y-3">
              {analytics.allocations_by_asset_class.map((alloc, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{alloc.category}</span>
                    <span className="font-medium text-slate-900">{alloc.weight_percent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${alloc.weight_percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Currency */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">By Currency</p>
            <div className="space-y-3">
              {analytics.allocations_by_currency.map((alloc, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{alloc.category}</span>
                    <span className="font-medium text-slate-900">{alloc.weight_percent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${alloc.weight_percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Region */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">By Region</p>
            <div className="space-y-3">
              {analytics.allocations_by_region.map((alloc, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{alloc.category}</span>
                    <span className="font-medium text-slate-900">{alloc.weight_percent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${alloc.weight_percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Concentration Analysis */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-medium text-slate-700 mb-4">Concentration Analysis</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">{analytics.concentration.top1_weight.toFixed(1)}%</p>
            <p className="text-xs text-slate-500">Top 1 Position</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">{analytics.concentration.top5_weight.toFixed(1)}%</p>
            <p className="text-xs text-slate-500">Top 5 Positions</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold text-slate-900">{analytics.concentration.top10_weight.toFixed(1)}%</p>
            <p className="text-xs text-slate-500">Top 10 Positions</p>
          </div>
        </div>

        {/* Top Positions */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Top Holdings</p>
          <div className="space-y-2">
            {analytics.concentration.top_positions.slice(0, 5).map((pos, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{pos.ticker}</p>
                    <p className="text-xs text-slate-500">{pos.name}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-900">{pos.weight_percent.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Positions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-medium text-slate-700">All Positions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Asset</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Qty</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Value</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Weight</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {portfolio.positions.map((pos, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{pos.ticker}</p>
                      <p className="text-xs text-slate-500">{pos.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-600">{pos.quantity}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                    €{pos.market_value_eur.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-600">
                    {pos.weight_percent.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div>
                      <p className={`text-sm font-medium ${(pos.pnl_percent ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {(pos.pnl_percent ?? 0) >= 0 ? '+' : ''}{(pos.pnl_percent ?? 0).toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-500">
                        {(pos.pnl_eur ?? 0) >= 0 ? '+' : ''}€{(pos.pnl_eur ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ask Copilot CTA */}
      <Link 
        href="/demo/chat?prompt=Give me a detailed analysis of my portfolio allocation and suggest improvements"
        className="block bg-slate-900 rounded-xl p-5 text-white hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Questions about your portfolio?</p>
            <p className="text-sm text-white/60">Ask the AI Copilot for personalized analysis</p>
          </div>
          <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
