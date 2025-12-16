'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePortfolioContext } from '@/components/providers/PortfolioProvider';
import { dataProvider } from '@/lib';
import { Portfolio, AnalyticsOutput } from '@/types';

interface ScenarioDetail {
  key: string;
  name: string;
  shortName: string;
  description: string;
  impact_percent: number;
  impact_eur: number;
  confidence: string;
  category: 'rates' | 'equity' | 'fx';
  icon: React.ReactNode;
  explanation: string;
  affectedAssets: string[];
  mechanism: string;
}

export default function ScenariosPage() {
  const { profile } = usePortfolioContext();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'rates' | 'equity' | 'fx'>('all');

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

  // Calculate allocation percentages for personalized explanations
  const equityAlloc = analytics.allocations_by_asset_class.find(a => a.category === 'Equities')?.weight_percent ?? 0;
  const bondAlloc = analytics.allocations_by_asset_class.find(a => a.category === 'Fixed Income')?.weight_percent ?? 0;
  const usdAlloc = analytics.allocations_by_currency.find(a => a.category === 'USD')?.weight_percent ?? 0;
  const topPositions = analytics.concentration.top_positions.slice(0, 3).map(p => p.ticker);

  // Build detailed scenarios with personalized explanations
  const scenarios: ScenarioDetail[] = [
    {
      key: 'rate_cut',
      name: 'ECB Rate Cut',
      shortName: 'Rate Cut -50bps',
      description: 'European Central Bank reduces main refinancing rate by 50 basis points',
      impact_percent: analytics.scenarios.rate_cut.impact_percent,
      impact_eur: analytics.scenarios.rate_cut.impact_eur,
      confidence: analytics.scenarios.rate_cut.confidence,
      category: 'rates',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      mechanism: 'Lower rates increase bond prices and support equity valuations through cheaper financing.',
      explanation: bondAlloc > 30 
        ? `Your ${bondAlloc.toFixed(0)}% bond allocation benefits significantly from rate cuts as existing bond prices rise.`
        : equityAlloc > 50
        ? `Your ${equityAlloc.toFixed(0)}% equity allocation benefits from lower financing costs, boosting corporate earnings.`
        : `Mixed impact across your diversified portfolio. Bonds gain from price appreciation, equities from cheaper capital.`,
      affectedAssets: bondAlloc > 20 ? ['MTH', 'IEAC', 'Bond ETFs'] : topPositions,
    },
    {
      key: 'rate_hike',
      name: 'ECB Rate Hike',
      shortName: 'Rate Hike +50bps',
      description: 'European Central Bank increases main refinancing rate by 50 basis points',
      impact_percent: analytics.scenarios.rate_hike.impact_percent,
      impact_eur: analytics.scenarios.rate_hike.impact_eur,
      confidence: analytics.scenarios.rate_hike.confidence,
      category: 'rates',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      mechanism: 'Higher rates reduce bond prices and pressure equity valuations through higher discount rates.',
      explanation: bondAlloc > 30
        ? `Your ${bondAlloc.toFixed(0)}% bond exposure faces mark-to-market losses as yields rise and prices fall.`
        : equityAlloc > 50
        ? `Higher rates increase discount rates, pressuring valuations especially for your growth stocks.`
        : `Moderate impact expected. Bond prices decline, equities face valuation pressure from higher discount rates.`,
      affectedAssets: bondAlloc > 20 ? ['MTH', 'IEAC', 'Bond ETFs'] : topPositions,
    },
    {
      key: 'equity_crash',
      name: 'Market Correction',
      shortName: 'Equities -20%',
      description: 'Global equity markets experience a 20% correction from current levels',
      impact_percent: analytics.scenarios.equity_crash.impact_percent,
      impact_eur: analytics.scenarios.equity_crash.impact_eur,
      confidence: analytics.scenarios.equity_crash.confidence,
      category: 'equity',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M9 17l3-6 3 3 3-6" />
        </svg>
      ),
      mechanism: 'Equity holdings decline proportionally. Beta exposure determines actual impact.',
      explanation: equityAlloc > 70
        ? `With ${equityAlloc.toFixed(0)}% equity allocation, you have significant downside exposure. Your top positions (${topPositions.join(', ')}) would be directly impacted.`
        : equityAlloc > 40
        ? `Your ${equityAlloc.toFixed(0)}% equity allocation provides balanced exposure. Non-equity assets offer partial cushioning.`
        : `Your conservative ${equityAlloc.toFixed(0)}% equity allocation limits downside to about ${(equityAlloc * 0.2).toFixed(1)}% direct loss.`,
      affectedAssets: topPositions,
    },
    {
      key: 'equity_rally',
      name: 'Market Rally',
      shortName: 'Equities +15%',
      description: 'Global equity markets rise 15% on strong economic outlook',
      impact_percent: analytics.scenarios.equity_rally.impact_percent,
      impact_eur: analytics.scenarios.equity_rally.impact_eur,
      confidence: analytics.scenarios.equity_rally.confidence,
      category: 'equity',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M9 13l3-3 3 3 3-6" />
        </svg>
      ),
      mechanism: 'Equity holdings appreciate proportionally. High-beta stocks outperform in rallies.',
      explanation: equityAlloc > 70
        ? `Your ${equityAlloc.toFixed(0)}% equity allocation captures most of the upside. ${topPositions[0]} and ${topPositions[1]} lead gains.`
        : equityAlloc > 40
        ? `Solid participation with ${equityAlloc.toFixed(0)}% equity exposure. You capture roughly ${(equityAlloc * 0.15).toFixed(1)}% of the rally.`
        : `Conservative allocation limits upside capture. Consider if this matches your growth objectives.`,
      affectedAssets: topPositions,
    },
    {
      key: 'usd_depreciation',
      name: 'USD Weakness',
      shortName: 'USD/EUR -10%',
      description: 'US Dollar depreciates 10% against Euro',
      impact_percent: analytics.scenarios.usd_depreciation.impact_percent,
      impact_eur: analytics.scenarios.usd_depreciation.impact_eur,
      confidence: analytics.scenarios.usd_depreciation.confidence,
      category: 'fx',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      mechanism: 'USD-denominated assets lose value when converted to EUR. Unhedged positions fully exposed.',
      explanation: usdAlloc > 50
        ? `Critical exposure: ${usdAlloc.toFixed(0)}% of your portfolio is in USD. A 10% drop means ~€${Math.abs(analytics.scenarios.usd_depreciation.impact_eur).toLocaleString()} loss.`
        : usdAlloc > 20
        ? `Your ${usdAlloc.toFixed(0)}% USD exposure creates moderate currency risk. US stocks (${topPositions.filter(t => ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'].includes(t)).join(', ') || 'US equities'}) affected.`
        : usdAlloc > 0
        ? `Limited ${usdAlloc.toFixed(0)}% USD exposure means minimal currency impact on your EUR-based portfolio.`
        : `No direct USD exposure. Your portfolio is fully EUR-denominated.`,
      affectedAssets: usdAlloc > 10 ? ['AAPL', 'MSFT', 'USD positions'] : [],
    },
    {
      key: 'usd_appreciation',
      name: 'USD Strength',
      shortName: 'USD/EUR +10%',
      description: 'US Dollar appreciates 10% against Euro',
      impact_percent: analytics.scenarios.usd_appreciation.impact_percent,
      impact_eur: analytics.scenarios.usd_appreciation.impact_eur,
      confidence: analytics.scenarios.usd_appreciation.confidence,
      category: 'fx',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      mechanism: 'USD-denominated assets gain value when converted to EUR. Natural hedge for US equity holders.',
      explanation: usdAlloc > 50
        ? `Your ${usdAlloc.toFixed(0)}% USD exposure becomes a tailwind. Expect ~€${analytics.scenarios.usd_appreciation.impact_eur.toLocaleString()} gain from currency alone.`
        : usdAlloc > 20
        ? `Moderate benefit from ${usdAlloc.toFixed(0)}% USD allocation. Your US holdings gain from favorable FX translation.`
        : usdAlloc > 0
        ? `Limited upside from ${usdAlloc.toFixed(0)}% USD exposure. Consider increasing USD allocation if bullish on dollar.`
        : `No USD exposure means no currency benefit. Portfolio remains unaffected by dollar strength.`,
      affectedAssets: usdAlloc > 10 ? ['AAPL', 'MSFT', 'USD positions'] : [],
    },
  ];

  const filteredScenarios = selectedCategory === 'all' 
    ? scenarios 
    : scenarios.filter(s => s.category === selectedCategory);

  // Calculate worst-case and best-case scenarios
  const worstCase = Math.min(...scenarios.map(s => s.impact_eur));
  const bestCase = Math.max(...scenarios.map(s => s.impact_eur));

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded-full uppercase tracking-wide">High confidence</span>;
      case 'medium':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded-full uppercase tracking-wide">Medium confidence</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full uppercase tracking-wide">Indicative</span>;
    }
  };

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
          <h1 className="text-xl font-semibold text-slate-900">Scenario Analysis</h1>
          <p className="text-sm text-slate-500">How market events could impact your €{portfolio.total_value_eur.toLocaleString()} portfolio</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Worst Case Scenario</p>
            <p className="text-3xl font-bold text-red-400">€{worstCase.toLocaleString()}</p>
            <p className="text-sm text-white/50 mt-1">{((worstCase / portfolio.total_value_eur) * 100).toFixed(1)}% of portfolio</p>
          </div>
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Best Case Scenario</p>
            <p className="text-3xl font-bold text-emerald-400">+€{bestCase.toLocaleString()}</p>
            <p className="text-sm text-white/50 mt-1">+{((bestCase / portfolio.total_value_eur) * 100).toFixed(1)}% of portfolio</p>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-xs text-white/50">
            Based on your current allocation: {equityAlloc.toFixed(0)}% equities, {bondAlloc.toFixed(0)}% bonds, {usdAlloc.toFixed(0)}% USD exposure
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All Scenarios' },
          { key: 'rates', label: 'Interest Rates' },
          { key: 'equity', label: 'Equity Markets' },
          { key: 'fx', label: 'Currency' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as typeof selectedCategory)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === key
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Scenarios Grid */}
      <div className="space-y-4">
        {filteredScenarios.map((scenario) => {
          const isPositive = scenario.impact_percent >= 0;
          const isNeutral = scenario.impact_percent === 0;
          
          return (
            <div 
              key={scenario.key} 
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    scenario.category === 'rates' ? 'bg-purple-100 text-purple-600' :
                    scenario.category === 'equity' ? 'bg-blue-100 text-blue-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {scenario.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{scenario.name}</h3>
                    <p className="text-xs text-slate-500">{scenario.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    isNeutral ? 'text-slate-400' : isPositive ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {isNeutral ? '0' : isPositive ? '+' : ''}{scenario.impact_percent.toFixed(1)}%
                  </p>
                  <p className="text-sm text-slate-500">
                    {isNeutral ? '€0' : isPositive ? '+' : ''}€{scenario.impact_eur.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Personalized Explanation */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-slate-700 font-medium mb-1">What this means for you</p>
                    <p className="text-sm text-slate-600">{scenario.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Mechanism + Confidence */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">Transmission mechanism</p>
                  <p className="text-xs text-slate-600">{scenario.mechanism}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getConfidenceBadge(scenario.confidence)}
                  {scenario.affectedAssets.length > 0 && (
                    <div className="flex gap-1">
                      {scenario.affectedAssets.slice(0, 3).map((asset, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded">
                          {asset}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Ask Copilot CTA */}
              <Link 
                href={`/demo/chat?prompt=${encodeURIComponent(`How would a ${scenario.shortName} scenario specifically impact my portfolio and what actions should I consider?`)}`}
                className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span>Ask Copilot for detailed analysis</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Methodology Disclaimer */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <h3 className="text-sm font-medium text-slate-700 mb-2">Methodology & Limitations</h3>
        <ul className="text-xs text-slate-500 space-y-1">
          <li>• Scenarios assume linear sensitivities; actual market behavior may exhibit non-linear dynamics</li>
          <li>• Correlations between asset classes may change during stress periods</li>
          <li>• Impact estimates based on historical data and simplified duration/beta assumptions</li>
          <li>• Does not account for potential central bank interventions or circuit breakers</li>
        </ul>
        <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-wide">
          For informational purposes only. Not investment advice.
        </p>
      </div>
    </div>
  );
}
