'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePortfolioContext } from '@/components/providers/PortfolioProvider';
import { dataProvider } from '@/lib';
import { Portfolio, AnalyticsOutput, NewsItem } from '@/types';

export default function DashboardPage() {
  const { profile } = usePortfolioContext();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOutput | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [portfolioData, analyticsData, newsData] = await Promise.all([
          dataProvider.getPortfolio(profile),
          dataProvider.getAnalytics(profile),
          dataProvider.getNews(),
        ]);
        setPortfolio(portfolioData);
        setAnalytics(analyticsData);
        setNews(newsData.slice(0, 3));
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  const highRiskCount = analytics.flags.filter(f => f.severity === 'high').length;
  const topPosition = analytics.concentration.top_positions[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Welcome Header */}
      <div className="px-1">
        <h1 className="text-xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Your portfolio at a glance</p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* PILLAR 1: Portfolio Performance */}
        <Link href="/demo/portfolio" className="group">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-slate-700">Portfolio</h2>
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Main Value */}
            <div className="mb-4">
              <p className="text-3xl font-bold text-slate-900">
                €{portfolio.total_value_eur.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm font-medium ${portfolio.total_pnl_percent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {portfolio.total_pnl_percent >= 0 ? '+' : ''}{portfolio.total_pnl_percent.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400">
                  ({portfolio.total_pnl_eur >= 0 ? '+' : ''}€{portfolio.total_pnl_eur.toLocaleString()})
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Positions</p>
                <p className="text-sm font-semibold text-slate-800">{portfolio.position_count}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Top holding</p>
                <p className="text-sm font-semibold text-slate-800">{topPosition?.ticker}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Concentration</p>
                <p className="text-sm font-semibold text-slate-800">{analytics.concentration.top1_weight.toFixed(0)}%</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                View positions, allocation, and performance breakdown
              </p>
            </div>
          </div>
        </Link>

        {/* PILLAR 2: Risk Analysis */}
        <Link href="/demo/risks" className="group">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${highRiskCount > 0 ? 'bg-red-100' : 'bg-amber-100'} flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${highRiskCount > 0 ? 'text-red-600' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-slate-700">Risk Analysis</h2>
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Risk Summary */}
            <div className="mb-4">
              <p className="text-3xl font-bold text-slate-900">
                {analytics.flags.length} <span className="text-lg font-normal text-slate-500">flags</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                {highRiskCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                    {highRiskCount} high priority
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  requires attention
                </span>
              </div>
            </div>

            {/* Top Risks Preview */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              {analytics.flags.slice(0, 2).map((flag, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    flag.severity === 'high' ? 'bg-red-500' : 
                    flag.severity === 'medium' ? 'bg-amber-500' : 'bg-slate-400'
                  }`} />
                  <p className="text-xs text-slate-600 line-clamp-1">{flag.title}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Understand risks and their € impact on your holdings
              </p>
            </div>
          </div>
        </Link>

        {/* PILLAR 3: Market News */}
        <Link href="/demo/news" className="group">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-slate-700">Market News</h2>
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* News Count */}
            <div className="mb-4">
              <p className="text-3xl font-bold text-slate-900">
                {news.length} <span className="text-lg font-normal text-slate-500">articles</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Relevant to your holdings
              </p>
            </div>

            {/* News Preview */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              {news.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-blue-500" />
                  <p className="text-xs text-slate-600 line-clamp-1">{item.title}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                See how market events affect your portfolio
              </p>
            </div>
          </div>
        </Link>

        {/* PILLAR 4: AI Copilot */}
        <Link href="/demo/chat" className="group">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all h-full text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-white/90">AI Copilot</h2>
              </div>
              <svg className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Main Message */}
            <div className="mb-4">
              <p className="text-lg font-medium text-white">
                Ask anything about your portfolio
              </p>
              <p className="text-sm text-white/60 mt-1">
                Personalized answers based on your €{portfolio.total_value_eur.toLocaleString()} holdings
              </p>
            </div>

            {/* Suggested Questions */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-wide text-white/40">Suggested</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                  What are my biggest risks?
                </span>
                <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">
                  How diversified am I?
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <p className="text-xs text-white/50">
                Expert analysis personalized to your holdings
              </p>
            </div>
          </div>
        </Link>

      </div>

      {/* Scenario Sensitivity - Premium Card */}
      <Link href="/demo/scenarios" className="block group">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-700">Scenario Sensitivity</h3>
                <p className="text-xs text-slate-400">How market events could affect your portfolio</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          {/* Scenario Preview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Rate Cut */}
            <div className="p-3 bg-gradient-to-br from-purple-50 to-slate-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Rate Cut</p>
              </div>
              <p className={`text-lg font-bold ${analytics.scenarios.rate_cut.impact_percent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {analytics.scenarios.rate_cut.impact_percent >= 0 ? '+' : ''}{analytics.scenarios.rate_cut.impact_percent.toFixed(1)}%
              </p>
              <p className="text-[10px] text-slate-400">
                {analytics.scenarios.rate_cut.impact_eur >= 0 ? '+' : ''}€{analytics.scenarios.rate_cut.impact_eur.toLocaleString()}
              </p>
            </div>

            {/* Rate Hike */}
            <div className="p-3 bg-gradient-to-br from-purple-50 to-slate-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Rate Hike</p>
              </div>
              <p className={`text-lg font-bold ${analytics.scenarios.rate_hike.impact_percent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {analytics.scenarios.rate_hike.impact_percent >= 0 ? '+' : ''}{analytics.scenarios.rate_hike.impact_percent.toFixed(1)}%
              </p>
              <p className="text-[10px] text-slate-400">
                {analytics.scenarios.rate_hike.impact_eur >= 0 ? '+' : ''}€{analytics.scenarios.rate_hike.impact_eur.toLocaleString()}
              </p>
            </div>

            {/* Equity Crash */}
            <div className="p-3 bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M9 17l3-6 3 3 3-6" />
                </svg>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Mkt -20%</p>
              </div>
              <p className={`text-lg font-bold ${analytics.scenarios.equity_crash.impact_percent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {analytics.scenarios.equity_crash.impact_percent.toFixed(1)}%
              </p>
              <p className="text-[10px] text-slate-400">
                €{analytics.scenarios.equity_crash.impact_eur.toLocaleString()}
              </p>
            </div>

            {/* USD Move */}
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-slate-50 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">USD -10%</p>
              </div>
              <p className={`text-lg font-bold ${
                analytics.scenarios.usd_depreciation.impact_percent === 0 
                  ? 'text-slate-400' 
                  : analytics.scenarios.usd_depreciation.impact_percent >= 0 
                    ? 'text-emerald-600' 
                    : 'text-red-600'
              }`}>
                {analytics.scenarios.usd_depreciation.impact_percent === 0 
                  ? '0%' 
                  : `${analytics.scenarios.usd_depreciation.impact_percent.toFixed(1)}%`}
              </p>
              <p className="text-[10px] text-slate-400">
                {analytics.scenarios.usd_depreciation.impact_eur === 0 
                  ? 'No USD exposure' 
                  : `€${analytics.scenarios.usd_depreciation.impact_eur.toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* View All CTA */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">View detailed scenario analysis with personalized insights</p>
            <span className="text-xs font-medium text-purple-600 group-hover:text-purple-700">See all 6 scenarios →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
