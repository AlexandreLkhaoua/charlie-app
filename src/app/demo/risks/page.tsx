'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePortfolioContext } from '@/components/providers/PortfolioProvider';
import { dataProvider } from '@/lib';
import { Portfolio, AnalyticsOutput, RiskFlag } from '@/types';

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-500' };
    case 'medium': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-500' };
    default: return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-500' };
  }
};

const getSeverityIcon = (severity: string) => {
  if (severity === 'high') {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

export default function RisksPage() {
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
        <div className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  const flags = analytics.flags || [];
  const highSeverityFlags = flags.filter((f: RiskFlag) => f.severity === 'high');
  const mediumSeverityFlags = flags.filter((f: RiskFlag) => f.severity === 'medium');
  const lowSeverityFlags = flags.filter((f: RiskFlag) => f.severity === 'low' || f.severity === 'info');

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
          <h1 className="text-xl font-semibold text-slate-900">Risk Analysis</h1>
          <p className="text-sm text-slate-500">Key risk indicators for your portfolio</p>
        </div>
      </div>

      {/* Risk Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-medium text-slate-700 mb-4">Risk Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-3xl font-bold text-red-600">{highSeverityFlags.length}</p>
            <p className="text-xs text-red-700">High Priority</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-3xl font-bold text-amber-600">{mediumSeverityFlags.length}</p>
            <p className="text-xs text-amber-700">Medium Priority</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-3xl font-bold text-blue-600">{lowSeverityFlags.length}</p>
            <p className="text-xs text-blue-700">Watch Items</p>
          </div>
        </div>
      </div>

      {/* Key Risk Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-sm font-medium text-slate-700 mb-4">Key Risk Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Concentration Risk */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Concentration</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{analytics.concentration.top1_weight.toFixed(1)}%</p>
            <p className="text-xs text-slate-500">in largest position</p>
          </div>

          {/* Currency Exposure */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-slate-500 uppercase tracking-wide">FX Exposure</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {analytics.allocations_by_currency.filter(c => c.category !== 'EUR').reduce((sum, c) => sum + c.weight_percent, 0).toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500">non-EUR positions</p>
          </div>

          {/* Regional Concentration */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Regional</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {analytics.allocations_by_region[0]?.weight_percent.toFixed(1) ?? 0}%
            </p>
            <p className="text-xs text-slate-500">in {analytics.allocations_by_region[0]?.category ?? 'N/A'}</p>
          </div>

          {/* Position Count */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Diversification</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{portfolio.position_count}</p>
            <p className="text-xs text-slate-500">total positions</p>
          </div>
        </div>
      </div>

      {/* All Risk Flags */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-slate-700">All Risk Flags ({flags.length})</h2>
        
        {flags.length === 0 ? (
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6 text-center">
            <svg className="w-12 h-12 text-emerald-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium text-emerald-800">No Risk Flags Detected</p>
            <p className="text-sm text-emerald-600 mt-1">Your portfolio appears well-balanced</p>
          </div>
        ) : (
          <div className="space-y-3">
            {flags.map((flag, idx) => {
              const colors = getSeverityColor(flag.severity);
              return (
                <div 
                  key={idx} 
                  className={`${colors.bg} rounded-xl border ${colors.border} p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div className={colors.icon}>
                      {getSeverityIcon(flag.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`font-medium ${colors.text}`}>{flag.title}</p>
                          <p className="text-sm text-slate-600 mt-1">{flag.explanation}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                          {flag.severity.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Recommendation */}
                      {flag.recommendation && (
                        <div className="mt-3 pt-3 border-t border-slate-200/50">
                          <p className="text-xs text-slate-500 mb-1">Recommendation:</p>
                          <p className="text-sm text-slate-600">{flag.recommendation}</p>
                        </div>
                      )}

                      {/* Ask Copilot */}
                      <Link 
                        href={`/demo/chat?prompt=${encodeURIComponent(`Explain the "${flag.title}" risk in detail and what actions I should consider`)}`}
                        className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-slate-700 hover:text-slate-900"
                      >
                        Ask Copilot about this
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Risk Mitigation CTA */}
      <Link 
        href="/demo/chat?prompt=What are the top 3 risks in my portfolio and how can I mitigate them?"
        className="block bg-slate-900 rounded-xl p-5 text-white hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Need help managing risks?</p>
            <p className="text-sm text-white/60">Get personalized risk mitigation strategies</p>
          </div>
          <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
