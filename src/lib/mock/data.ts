import { Portfolio, Position, PortfolioProfile } from '@/types/portfolio';
import { AnalyticsOutput, RiskFlag } from '@/types/analytics';
import { NewsItem, NewsImpactPack, ImpactSentiment } from '@/types/news';
import { QuickPrompt } from '@/types/chat';

// ============================================
// DEMO PORTFOLIOS
// ============================================

const prudentPositions: Position[] = [
  {
    id: 'p1',
    isin: 'FR0010149120',
    name: 'Lyxor Euro Government Bond 3-5Y',
    ticker: 'MTH',
    instrument_type: 'ETF',
    asset_class: 'Fixed Income',
    region: 'Europe',
    currency: 'EUR',
    quantity: 500,
    price_eur: 102.45,
    market_value_eur: 51225,
    weight_percent: 25.6,
  },
  {
    id: 'p2',
    isin: 'LU0378449770',
    name: 'iShares Euro Corporate Bond',
    ticker: 'IEAC',
    instrument_type: 'ETF',
    asset_class: 'Fixed Income',
    region: 'Europe',
    currency: 'EUR',
    quantity: 400,
    price_eur: 115.30,
    market_value_eur: 46120,
    weight_percent: 23.1,
  },
  {
    id: 'p3',
    isin: 'FR0010315770',
    name: 'Lyxor Euro Money Market',
    ticker: 'CSH',
    instrument_type: 'MMF',
    asset_class: 'Cash & MMF',
    region: 'Europe',
    currency: 'EUR',
    quantity: 300,
    price_eur: 105.20,
    market_value_eur: 31560,
    weight_percent: 15.8,
  },
  {
    id: 'p4',
    isin: 'IE00B4L5Y983',
    name: 'iShares Core MSCI World',
    ticker: 'IWDA',
    instrument_type: 'ETF',
    asset_class: 'Equities',
    region: 'Global',
    currency: 'EUR',
    quantity: 200,
    price_eur: 85.60,
    market_value_eur: 17120,
    weight_percent: 8.6,
  },
  {
    id: 'p5',
    isin: 'FR0000120271',
    name: 'TotalEnergies SE',
    ticker: 'TTE',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'Europe',
    currency: 'EUR',
    quantity: 150,
    price_eur: 62.80,
    market_value_eur: 9420,
    weight_percent: 4.7,
  },
  {
    id: 'p6',
    isin: 'DE0007164600',
    name: 'SAP SE',
    ticker: 'SAP',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'Europe',
    currency: 'EUR',
    quantity: 50,
    price_eur: 185.40,
    market_value_eur: 9270,
    weight_percent: 4.6,
  },
  {
    id: 'p7',
    isin: 'IE00BK5BQT80',
    name: 'Vanguard FTSE All-World',
    ticker: 'VWCE',
    instrument_type: 'ETF',
    asset_class: 'Equities',
    region: 'Global',
    currency: 'EUR',
    quantity: 60,
    price_eur: 118.50,
    market_value_eur: 7110,
    weight_percent: 3.6,
  },
  {
    id: 'p8',
    isin: 'CASH-EUR',
    name: 'Cash EUR',
    ticker: 'CASH',
    instrument_type: 'Cash',
    asset_class: 'Cash & MMF',
    region: 'Europe',
    currency: 'EUR',
    quantity: 1,
    price_eur: 28175,
    market_value_eur: 28175,
    weight_percent: 14.1,
  },
];

const balancedPositions: Position[] = [
  {
    id: 'b1',
    isin: 'IE00B4L5Y983',
    name: 'iShares Core MSCI World',
    ticker: 'IWDA',
    instrument_type: 'ETF',
    asset_class: 'Equities',
    region: 'Global',
    currency: 'EUR',
    quantity: 450,
    price_eur: 85.60,
    market_value_eur: 38520,
    weight_percent: 19.3,
  },
  {
    id: 'b2',
    isin: 'US0378331005',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'North America',
    currency: 'USD',
    quantity: 120,
    price_eur: 175.20,
    market_value_eur: 21024,
    weight_percent: 10.5,
  },
  {
    id: 'b3',
    isin: 'US5949181045',
    name: 'Microsoft Corp.',
    ticker: 'MSFT',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'North America',
    currency: 'USD',
    quantity: 55,
    price_eur: 380.50,
    market_value_eur: 20927,
    weight_percent: 10.5,
  },
  {
    id: 'b4',
    isin: 'FR0010149120',
    name: 'Lyxor Euro Government Bond 3-5Y',
    ticker: 'MTH',
    instrument_type: 'ETF',
    asset_class: 'Fixed Income',
    region: 'Europe',
    currency: 'EUR',
    quantity: 200,
    price_eur: 102.45,
    market_value_eur: 20490,
    weight_percent: 10.3,
  },
  {
    id: 'b5',
    isin: 'LU0378449770',
    name: 'iShares Euro Corporate Bond',
    ticker: 'IEAC',
    instrument_type: 'ETF',
    asset_class: 'Fixed Income',
    region: 'Europe',
    currency: 'EUR',
    quantity: 150,
    price_eur: 115.30,
    market_value_eur: 17295,
    weight_percent: 8.7,
  },
  {
    id: 'b6',
    isin: 'DE0007164600',
    name: 'SAP SE',
    ticker: 'SAP',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'Europe',
    currency: 'EUR',
    quantity: 80,
    price_eur: 185.40,
    market_value_eur: 14832,
    weight_percent: 7.4,
  },
  {
    id: 'b7',
    isin: 'FR0000120271',
    name: 'TotalEnergies SE',
    ticker: 'TTE',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'Europe',
    currency: 'EUR',
    quantity: 180,
    price_eur: 62.80,
    market_value_eur: 11304,
    weight_percent: 5.7,
  },
  {
    id: 'b8',
    isin: 'IE00BK5BQT80',
    name: 'Vanguard FTSE All-World',
    ticker: 'VWCE',
    instrument_type: 'ETF',
    asset_class: 'Equities',
    region: 'Global',
    currency: 'EUR',
    quantity: 95,
    price_eur: 118.50,
    market_value_eur: 11257,
    weight_percent: 5.6,
  },
  {
    id: 'b9',
    isin: 'FR0010315770',
    name: 'Lyxor Euro Money Market',
    ticker: 'CSH',
    instrument_type: 'MMF',
    asset_class: 'Cash & MMF',
    region: 'Europe',
    currency: 'EUR',
    quantity: 150,
    price_eur: 105.20,
    market_value_eur: 15780,
    weight_percent: 7.9,
  },
  {
    id: 'b10',
    isin: 'CASH-EUR',
    name: 'Cash EUR',
    ticker: 'CASH',
    instrument_type: 'Cash',
    asset_class: 'Cash & MMF',
    region: 'Europe',
    currency: 'EUR',
    quantity: 1,
    price_eur: 28571,
    market_value_eur: 28571,
    weight_percent: 14.3,
  },
];

const aggressivePositions: Position[] = [
  {
    id: 'a1',
    isin: 'US0378331005',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'North America',
    currency: 'USD',
    quantity: 200,
    price_eur: 175.20,
    market_value_eur: 35040,
    weight_percent: 17.5,
  },
  {
    id: 'a2',
    isin: 'US5949181045',
    name: 'Microsoft Corp.',
    ticker: 'MSFT',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'North America',
    currency: 'USD',
    quantity: 85,
    price_eur: 380.50,
    market_value_eur: 32342,
    weight_percent: 16.2,
  },
  {
    id: 'a3',
    isin: 'US88160R1014',
    name: 'Tesla Inc.',
    ticker: 'TSLA',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'North America',
    currency: 'USD',
    quantity: 100,
    price_eur: 248.30,
    market_value_eur: 24830,
    weight_percent: 12.4,
  },
  {
    id: 'a4',
    isin: 'US67066G1040',
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'North America',
    currency: 'USD',
    quantity: 40,
    price_eur: 485.60,
    market_value_eur: 19424,
    weight_percent: 9.7,
  },
  {
    id: 'a5',
    isin: 'IE00B4L5Y983',
    name: 'iShares Core MSCI World',
    ticker: 'IWDA',
    instrument_type: 'ETF',
    asset_class: 'Equities',
    region: 'Global',
    currency: 'EUR',
    quantity: 200,
    price_eur: 85.60,
    market_value_eur: 17120,
    weight_percent: 8.6,
  },
  {
    id: 'a6',
    isin: 'DE0007164600',
    name: 'SAP SE',
    ticker: 'SAP',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'Europe',
    currency: 'EUR',
    quantity: 65,
    price_eur: 185.40,
    market_value_eur: 12051,
    weight_percent: 6.0,
  },
  {
    id: 'a7',
    isin: 'US30303M1027',
    name: 'Meta Platforms Inc.',
    ticker: 'META',
    instrument_type: 'Stock',
    asset_class: 'Equities',
    region: 'North America',
    currency: 'USD',
    quantity: 25,
    price_eur: 520.80,
    market_value_eur: 13020,
    weight_percent: 6.5,
  },
  {
    id: 'a8',
    isin: 'BTC-CRYPTO',
    name: 'Bitcoin',
    ticker: 'BTC',
    instrument_type: 'Crypto',
    asset_class: 'Crypto',
    region: 'Global',
    currency: 'EUR',
    quantity: 0.25,
    price_eur: 42000,
    market_value_eur: 10500,
    weight_percent: 5.3,
  },
  {
    id: 'a9',
    isin: 'ETH-CRYPTO',
    name: 'Ethereum',
    ticker: 'ETH',
    instrument_type: 'Crypto',
    asset_class: 'Crypto',
    region: 'Global',
    currency: 'EUR',
    quantity: 2.5,
    price_eur: 2200,
    market_value_eur: 5500,
    weight_percent: 2.8,
  },
  {
    id: 'a10',
    isin: 'CASH-EUR',
    name: 'Cash EUR',
    ticker: 'CASH',
    instrument_type: 'Cash',
    asset_class: 'Cash & MMF',
    region: 'Europe',
    currency: 'EUR',
    quantity: 1,
    price_eur: 30173,
    market_value_eur: 30173,
    weight_percent: 15.1,
  },
];

// Calculate totals helper
const calculateTotal = (positions: Position[]): number => {
  return positions.reduce((sum, pos) => sum + pos.market_value_eur, 0);
};

export const demoPortfolios: Record<PortfolioProfile, Portfolio> = {
  prudent: {
    id: 'demo-prudent',
    name: 'Portfolio Prudent',
    profile: 'prudent',
    owner: 'Demo User',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-15T09:30:00Z',
    total_value_eur: calculateTotal(prudentPositions),
    total_pnl_eur: 8450,
    total_pnl_percent: 4.4,
    positions: prudentPositions,
    position_count: prudentPositions.length,
  },
  balanced: {
    id: 'demo-balanced',
    name: 'Portfolio Équilibré',
    profile: 'balanced',
    owner: 'Demo User',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-15T09:30:00Z',
    total_value_eur: calculateTotal(balancedPositions),
    total_pnl_eur: 15230,
    total_pnl_percent: 8.2,
    positions: balancedPositions,
    position_count: balancedPositions.length,
  },
  aggressive: {
    id: 'demo-aggressive',
    name: 'Portfolio Agressif',
    profile: 'aggressive',
    owner: 'Demo User',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-15T09:30:00Z',
    total_value_eur: calculateTotal(aggressivePositions),
    total_pnl_eur: 28750,
    total_pnl_percent: 16.8,
    positions: aggressivePositions,
    position_count: aggressivePositions.length,
  },
};

// ============================================
// DEMO ANALYTICS
// ============================================

export const demoAnalytics: Record<PortfolioProfile, AnalyticsOutput> = {
  prudent: {
    portfolio_id: 'demo-prudent',
    computed_at: '2024-12-15T09:30:00Z',
    allocations_by_asset_class: [
      { category: 'Fixed Income', value_eur: 97345, weight_percent: 48.7 },
      { category: 'Cash & MMF', value_eur: 59735, weight_percent: 29.9 },
      { category: 'Equities', value_eur: 42920, weight_percent: 21.5 },
    ],
    allocations_by_currency: [
      { category: 'EUR', value_eur: 200000, weight_percent: 100 },
    ],
    allocations_by_region: [
      { category: 'Europe', value_eur: 175770, weight_percent: 87.9 },
      { category: 'Global', value_eur: 24230, weight_percent: 12.1 },
    ],
    concentration: {
      top1_weight: 25.6,
      top5_weight: 77.2,
      top10_weight: 100,
      top_positions: [
        { name: 'Lyxor Euro Government Bond 3-5Y', ticker: 'MTH', weight_percent: 25.6 },
        { name: 'iShares Euro Corporate Bond', ticker: 'IEAC', weight_percent: 23.1 },
        { name: 'Lyxor Euro Money Market', ticker: 'CSH', weight_percent: 15.8 },
        { name: 'Cash EUR', ticker: 'CASH', weight_percent: 14.1 },
        { name: 'iShares Core MSCI World', ticker: 'IWDA', weight_percent: 8.6 },
      ],
    },
    fx_exposure: [
      { currency: 'EUR', value_eur: 200000, weight_percent: 100 },
    ],
    flags: [
      {
        id: 'f1',
        severity: 'info',
        category: 'allocation',
        title: 'Conservative allocation detected',
        explanation: 'Your portfolio has a high allocation to fixed income and cash (78.6%), which is appropriate for a prudent risk profile.',
        recommendation: 'Consider if this aligns with your investment horizon.',
      },
      {
        id: 'f2',
        severity: 'low',
        category: 'concentration',
        title: 'Bond ETF concentration',
        explanation: 'Two bond ETFs represent 48.7% of your portfolio.',
        recommendation: 'Diversification within fixed income could reduce specific risk.',
      },
    ],
    scenarios: {
      rate_cut: { scenario_name: 'Rate Cut -50bps', description: 'ECB cuts rates by 50 basis points', impact_percent: 2.8, impact_eur: 5600, confidence: 'high' },
      rate_hike: { scenario_name: 'Rate Hike +50bps', description: 'ECB raises rates by 50 basis points', impact_percent: -2.4, impact_eur: -4800, confidence: 'high' },
      equity_crash: { scenario_name: 'Equity Crash -20%', description: 'Global equity markets drop 20%', impact_percent: -4.3, impact_eur: -8600, confidence: 'medium' },
      equity_rally: { scenario_name: 'Equity Rally +15%', description: 'Global equity markets rise 15%', impact_percent: 3.2, impact_eur: 6400, confidence: 'medium' },
      usd_depreciation: { scenario_name: 'USD -10%', description: 'USD depreciates 10% vs EUR', impact_percent: 0, impact_eur: 0, confidence: 'high' },
      usd_appreciation: { scenario_name: 'USD +10%', description: 'USD appreciates 10% vs EUR', impact_percent: 0, impact_eur: 0, confidence: 'high' },
    },
  },
  balanced: {
    portfolio_id: 'demo-balanced',
    computed_at: '2024-12-15T09:30:00Z',
    allocations_by_asset_class: [
      { category: 'Equities', value_eur: 117884, weight_percent: 59.0 },
      { category: 'Fixed Income', value_eur: 37785, weight_percent: 18.9 },
      { category: 'Cash & MMF', value_eur: 44351, weight_percent: 22.2 },
    ],
    allocations_by_currency: [
      { category: 'EUR', value_eur: 158059, weight_percent: 79.1 },
      { category: 'USD', value_eur: 41951, weight_percent: 21.0 },
    ],
    allocations_by_region: [
      { category: 'Europe', value_eur: 79701, weight_percent: 39.9 },
      { category: 'North America', value_eur: 41951, weight_percent: 21.0 },
      { category: 'Global', value_eur: 78348, weight_percent: 39.2 },
    ],
    concentration: {
      top1_weight: 19.3,
      top5_weight: 58.6,
      top10_weight: 100,
      top_positions: [
        { name: 'iShares Core MSCI World', ticker: 'IWDA', weight_percent: 19.3 },
        { name: 'Apple Inc.', ticker: 'AAPL', weight_percent: 10.5 },
        { name: 'Microsoft Corp.', ticker: 'MSFT', weight_percent: 10.5 },
        { name: 'Lyxor Euro Government Bond 3-5Y', ticker: 'MTH', weight_percent: 10.3 },
        { name: 'iShares Euro Corporate Bond', ticker: 'IEAC', weight_percent: 8.7 },
      ],
    },
    fx_exposure: [
      { currency: 'EUR', value_eur: 158059, weight_percent: 79.1 },
      { currency: 'USD', value_eur: 41951, weight_percent: 21.0 },
    ],
    flags: [
      {
        id: 'f1',
        severity: 'medium',
        category: 'fx',
        title: 'USD exposure unhedged',
        explanation: 'You have 21% exposure to USD-denominated assets without currency hedging.',
        recommendation: 'Consider the impact of EUR/USD movements on your portfolio.',
      },
      {
        id: 'f2',
        severity: 'low',
        category: 'concentration',
        title: 'Tech sector concentration',
        explanation: 'Apple and Microsoft represent 21% of your portfolio.',
        recommendation: 'Monitor tech sector volatility.',
      },
    ],
    scenarios: {
      rate_cut: { scenario_name: 'Rate Cut -50bps', description: 'ECB cuts rates by 50 basis points', impact_percent: 1.8, impact_eur: 3600, confidence: 'medium' },
      rate_hike: { scenario_name: 'Rate Hike +50bps', description: 'ECB raises rates by 50 basis points', impact_percent: -1.5, impact_eur: -3000, confidence: 'medium' },
      equity_crash: { scenario_name: 'Equity Crash -20%', description: 'Global equity markets drop 20%', impact_percent: -11.8, impact_eur: -23576, confidence: 'high' },
      equity_rally: { scenario_name: 'Equity Rally +15%', description: 'Global equity markets rise 15%', impact_percent: 8.9, impact_eur: 17782, confidence: 'high' },
      usd_depreciation: { scenario_name: 'USD -10%', description: 'USD depreciates 10% vs EUR', impact_percent: -2.1, impact_eur: -4195, confidence: 'high' },
      usd_appreciation: { scenario_name: 'USD +10%', description: 'USD appreciates 10% vs EUR', impact_percent: 2.1, impact_eur: 4195, confidence: 'high' },
    },
  },
  aggressive: {
    portfolio_id: 'demo-aggressive',
    computed_at: '2024-12-15T09:30:00Z',
    allocations_by_asset_class: [
      { category: 'Equities', value_eur: 153827, weight_percent: 76.9 },
      { category: 'Crypto', value_eur: 16000, weight_percent: 8.0 },
      { category: 'Cash & MMF', value_eur: 30173, weight_percent: 15.1 },
    ],
    allocations_by_currency: [
      { category: 'EUR', value_eur: 74844, weight_percent: 37.4 },
      { category: 'USD', value_eur: 124656, weight_percent: 62.3 },
      { category: 'Other', value_eur: 500, weight_percent: 0.3 },
    ],
    allocations_by_region: [
      { category: 'North America', value_eur: 124656, weight_percent: 62.3 },
      { category: 'Europe', value_eur: 12051, weight_percent: 6.0 },
      { category: 'Global', value_eur: 63293, weight_percent: 31.7 },
    ],
    concentration: {
      top1_weight: 17.5,
      top5_weight: 63.8,
      top10_weight: 100,
      top_positions: [
        { name: 'Apple Inc.', ticker: 'AAPL', weight_percent: 17.5 },
        { name: 'Microsoft Corp.', ticker: 'MSFT', weight_percent: 16.2 },
        { name: 'Tesla Inc.', ticker: 'TSLA', weight_percent: 12.4 },
        { name: 'NVIDIA Corp.', ticker: 'NVDA', weight_percent: 9.7 },
        { name: 'iShares Core MSCI World', ticker: 'IWDA', weight_percent: 8.6 },
      ],
    },
    fx_exposure: [
      { currency: 'EUR', value_eur: 74844, weight_percent: 37.4 },
      { currency: 'USD', value_eur: 124656, weight_percent: 62.3 },
    ],
    flags: [
      {
        id: 'f1',
        severity: 'high',
        category: 'concentration',
        title: 'High single-stock concentration',
        explanation: 'Your top 4 positions (AAPL, MSFT, TSLA, NVDA) represent 55.8% of your portfolio.',
        recommendation: 'Consider diversifying to reduce single-stock risk.',
      },
      {
        id: 'f2',
        severity: 'high',
        category: 'fx',
        title: 'Significant USD exposure',
        explanation: 'Over 62% of your portfolio is exposed to USD currency risk.',
        recommendation: 'Monitor EUR/USD exchange rate closely.',
      },
      {
        id: 'f3',
        severity: 'medium',
        category: 'volatility',
        title: 'Crypto exposure',
        explanation: 'You have 8% exposure to highly volatile crypto assets.',
        recommendation: 'Be prepared for significant price swings.',
      },
      {
        id: 'f4',
        severity: 'medium',
        category: 'sector',
        title: 'Heavy tech sector allocation',
        explanation: 'Technology stocks dominate your equity holdings.',
        recommendation: 'Consider sector diversification.',
      },
    ],
    scenarios: {
      rate_cut: { scenario_name: 'Rate Cut -50bps', description: 'ECB cuts rates by 50 basis points', impact_percent: 4.2, impact_eur: 8400, confidence: 'medium' },
      rate_hike: { scenario_name: 'Rate Hike +50bps', description: 'ECB raises rates by 50 basis points', impact_percent: -3.8, impact_eur: -7600, confidence: 'medium' },
      equity_crash: { scenario_name: 'Equity Crash -20%', description: 'Global equity markets drop 20%', impact_percent: -17.0, impact_eur: -34000, confidence: 'high' },
      equity_rally: { scenario_name: 'Equity Rally +15%', description: 'Global equity markets rise 15%', impact_percent: 12.7, impact_eur: 25400, confidence: 'high' },
      usd_depreciation: { scenario_name: 'USD -10%', description: 'USD depreciates 10% vs EUR', impact_percent: -6.2, impact_eur: -12466, confidence: 'high' },
      usd_appreciation: { scenario_name: 'USD +10%', description: 'USD appreciates 10% vs EUR', impact_percent: 6.2, impact_eur: 12466, confidence: 'high' },
    },
  },
};

// ============================================
// DEMO NEWS
// ============================================

export const demoNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'ECB Signals Potential Rate Cut in Q1 2025',
    summary: 'European Central Bank officials hint at possible 25-50 basis point rate reduction as inflation continues to moderate across the eurozone. Markets pricing in higher probability of dovish pivot.',
    source: 'Financial Times',
    author: 'Martin Arnold',
    published_at: '2024-12-15T08:30:00Z',
    tags: ['rates', 'macro'],
    full_text: 'The European Central Bank is increasingly likely to cut interest rates in the first quarter of 2025, according to several governing council members who spoke on condition of anonymity. With inflation now closer to the 2% target and economic growth stalling, the case for monetary easing is building.',
  },
  {
    id: 'news-2',
    title: 'Apple Reports Strong iPhone 16 Sales in China',
    summary: 'Apple Inc. sees 15% quarter-over-quarter increase in Chinese iPhone sales, defying analyst expectations of continued market share erosion to domestic competitors.',
    source: 'Bloomberg',
    author: 'Mark Gurman',
    published_at: '2024-12-14T14:00:00Z',
    tags: ['earnings', 'tech', 'equity'],
  },
  {
    id: 'news-3',
    title: 'NVIDIA Announces Next-Gen AI Chips at GTC',
    summary: 'NVIDIA unveils Blackwell Ultra architecture with 2x performance improvement for AI training. Major cloud providers commit to large-scale deployments starting Q2 2025.',
    source: 'Reuters',
    published_at: '2024-12-13T16:45:00Z',
    tags: ['tech', 'equity', 'earnings'],
  },
  {
    id: 'news-4',
    title: 'US Dollar Weakens on Fed Pivot Expectations',
    summary: 'The US dollar index fell to a 3-month low as traders increase bets on Federal Reserve rate cuts following softer-than-expected employment data.',
    source: 'Wall Street Journal',
    published_at: '2024-12-13T10:00:00Z',
    tags: ['fx', 'rates', 'macro'],
  },
  {
    id: 'news-5',
    title: 'Oil Prices Surge on OPEC+ Supply Cuts',
    summary: 'Brent crude jumps 4% after OPEC+ announces deeper production cuts through Q1 2025. Energy stocks rally across European and US markets.',
    source: 'Bloomberg',
    published_at: '2024-12-12T18:20:00Z',
    tags: ['commodities', 'equity', 'geopolitics'],
  },
  {
    id: 'news-6',
    title: 'Bitcoin Surpasses $45,000 on ETF Inflows',
    summary: 'Bitcoin price reaches highest level since March 2022 as spot ETF products see record weekly inflows of $2.3 billion. Institutional adoption accelerating.',
    source: 'CoinDesk',
    published_at: '2024-12-12T09:15:00Z',
    tags: ['crypto'],
  },
  {
    id: 'news-7',
    title: 'SAP Cloud Revenue Beats Expectations',
    summary: 'SAP SE reports Q4 cloud revenue growth of 24% year-over-year, exceeding analyst estimates. Company raises 2025 guidance on strong enterprise AI adoption.',
    source: 'Handelsblatt',
    published_at: '2024-12-11T07:00:00Z',
    tags: ['earnings', 'tech', 'equity'],
  },
  {
    id: 'news-8',
    title: 'Eurozone Inflation Falls to 2.3%',
    summary: 'November inflation data shows continued moderation in consumer prices across the eurozone, strengthening case for ECB policy easing in 2025.',
    source: 'ECB Press Release',
    published_at: '2024-12-10T10:00:00Z',
    tags: ['inflation', 'macro', 'rates'],
  },
  {
    id: 'news-9',
    title: 'Microsoft Expands Azure AI Partnership with OpenAI',
    summary: 'Microsoft announces $10 billion additional investment in OpenAI, cementing its position as the leading enterprise AI platform provider.',
    source: 'TechCrunch',
    published_at: '2024-12-09T15:30:00Z',
    tags: ['tech', 'equity'],
  },
  {
    id: 'news-10',
    title: 'Tesla Deliveries Miss Q4 Estimates',
    summary: 'Tesla Inc. reports Q4 deliveries of 435,000 vehicles, below the 450,000 consensus. Stock drops 5% in after-hours trading on margin concerns.',
    source: 'CNBC',
    published_at: '2024-12-08T20:00:00Z',
    tags: ['earnings', 'equity'],
  },
  {
    id: 'news-11',
    title: 'China Stimulus Package Boosts EM Sentiment',
    summary: 'Chinese government announces additional fiscal stimulus measures worth $200 billion to support domestic consumption and property sector recovery.',
    source: 'South China Morning Post',
    published_at: '2024-12-07T04:00:00Z',
    tags: ['macro', 'geopolitics', 'equity'],
  },
  {
    id: 'news-12',
    title: 'TotalEnergies Announces Major Green Hydrogen Project',
    summary: 'TotalEnergies SE commits €5 billion to European green hydrogen infrastructure, targeting 1 million tonnes annual production capacity by 2030.',
    source: 'Les Echos',
    published_at: '2024-12-06T11:00:00Z',
    tags: ['equity', 'commodities'],
  },
];

// ============================================
// NEWS IMPACT MAPPINGS
// ============================================

export const generateNewsImpact = (
  newsId: string,
  portfolio: Portfolio,
  analytics: AnalyticsOutput
): NewsImpactPack => {
  const news = demoNews.find((n) => n.id === newsId);
  if (!news) {
    return {
      news_id: newsId,
      sentiment: 'neutral',
      confidence: 'low',
      summary: 'Unable to analyze impact for this news item.',
      bullets: [],
      estimated_impact_percent: 0,
      estimated_impact_eur: 0,
      affected_positions: [],
      recommendations: [],
    };
  }

  // Generate contextual impact based on news tags and portfolio composition
  const profile = portfolio.profile;
  const hasEquities = analytics.allocations_by_asset_class.find((a) => a.category === 'Equities');
  const hasFixedIncome = analytics.allocations_by_asset_class.find((a) => a.category === 'Fixed Income');
  const hasCrypto = analytics.allocations_by_asset_class.find((a) => a.category === 'Crypto');
  const hasUSD = analytics.fx_exposure.find((f) => f.currency === 'USD');

  const impacts: Record<string, NewsImpactPack> = {
    'news-1': {
      news_id: 'news-1',
      sentiment: hasFixedIncome && hasFixedIncome.weight_percent > 20 ? 'positive' : 'neutral',
      confidence: 'high',
      summary: `Rate cuts would benefit your ${hasFixedIncome?.weight_percent.toFixed(1) || 0}% fixed income allocation through price appreciation.`,
      bullets: [
        `Your bond ETFs (${hasFixedIncome?.weight_percent.toFixed(1) || 0}% of portfolio) would see price gains`,
        'Duration-sensitive positions benefit most from rate cuts',
        profile === 'aggressive' ? 'Lower rates also support equity valuations' : 'Conservative allocation limits upside',
      ],
      estimated_impact_percent: profile === 'prudent' ? 2.8 : profile === 'balanced' ? 1.8 : 1.2,
      estimated_impact_eur: Math.round(portfolio.total_value_eur * (profile === 'prudent' ? 0.028 : profile === 'balanced' ? 0.018 : 0.012)),
      affected_positions: portfolio.positions
        .filter((p) => p.asset_class === 'Fixed Income')
        .slice(0, 3)
        .map((p) => ({
          ticker: p.ticker,
          name: p.name,
          impact_direction: 'up' as const,
          reason: 'Bond prices rise when rates fall',
        })),
      recommendations: [
        'Consider maintaining duration exposure ahead of potential rate cuts',
        'Monitor ECB communications for timing signals',
      ],
    },
    'news-2': {
      news_id: 'news-2',
      sentiment: portfolio.positions.find((p) => p.ticker === 'AAPL') ? 'positive' : 'neutral',
      confidence: 'medium',
      summary: portfolio.positions.find((p) => p.ticker === 'AAPL')
        ? `Positive for your Apple position (${portfolio.positions.find((p) => p.ticker === 'AAPL')?.weight_percent.toFixed(1)}% of portfolio).`
        : 'Limited direct impact - no Apple exposure in your portfolio.',
      bullets: [
        portfolio.positions.find((p) => p.ticker === 'AAPL')
          ? `Apple represents ${portfolio.positions.find((p) => p.ticker === 'AAPL')?.weight_percent.toFixed(1)}% of your holdings`
          : 'No direct Apple exposure',
        'Tech sector sentiment broadly positive',
        'China market recovery benefits global tech stocks',
      ],
      estimated_impact_percent: portfolio.positions.find((p) => p.ticker === 'AAPL')
        ? (portfolio.positions.find((p) => p.ticker === 'AAPL')?.weight_percent || 0) * 0.03
        : 0.2,
      estimated_impact_eur: Math.round(
        portfolio.positions.find((p) => p.ticker === 'AAPL')
          ? (portfolio.positions.find((p) => p.ticker === 'AAPL')?.market_value_eur || 0) * 0.03
          : portfolio.total_value_eur * 0.002
      ),
      affected_positions: portfolio.positions
        .filter((p) => p.ticker === 'AAPL' || p.asset_class === 'Equities')
        .slice(0, 3)
        .map((p) => ({
          ticker: p.ticker,
          name: p.name,
          impact_direction: 'up' as const,
          reason: p.ticker === 'AAPL' ? 'Direct exposure to Apple' : 'Tech sector correlation',
        })),
      recommendations: [
        'Apple momentum may continue if China sales sustain',
        'Consider exposure to broader tech sector for diversification',
      ],
    },
    'news-4': {
      news_id: 'news-4',
      sentiment: hasUSD && hasUSD.weight_percent > 15 ? 'negative' : 'positive',
      confidence: 'high',
      summary: hasUSD && hasUSD.weight_percent > 15
        ? `Dollar weakness negatively impacts your ${hasUSD?.weight_percent.toFixed(1)}% USD exposure.`
        : 'Limited FX impact - minimal USD exposure in your portfolio.',
      bullets: [
        hasUSD ? `${hasUSD.weight_percent.toFixed(1)}% of portfolio exposed to USD` : 'No significant USD exposure',
        'USD-denominated assets lose value in EUR terms',
        profile === 'aggressive' ? 'High USD exposure amplifies currency impact' : 'Conservative FX positioning limits impact',
      ],
      estimated_impact_percent: hasUSD ? -(hasUSD.weight_percent * 0.05) : 0,
      estimated_impact_eur: hasUSD ? Math.round(-(hasUSD.value_eur * 0.05)) : 0,
      affected_positions: portfolio.positions
        .filter((p) => p.currency === 'USD')
        .slice(0, 4)
        .map((p) => ({
          ticker: p.ticker,
          name: p.name,
          impact_direction: 'down' as const,
          reason: 'USD-denominated asset loses value vs EUR',
        })),
      recommendations: [
        hasUSD && hasUSD.weight_percent > 20 ? 'Consider currency hedging for USD positions' : 'Current FX exposure is manageable',
        'Monitor Fed communications for dollar direction',
      ],
    },
    'news-6': {
      news_id: 'news-6',
      sentiment: hasCrypto && hasCrypto.weight_percent > 0 ? 'positive' : 'neutral',
      confidence: 'medium',
      summary: hasCrypto && hasCrypto.weight_percent > 0
        ? `Positive for your crypto allocation (${hasCrypto.weight_percent.toFixed(1)}% of portfolio).`
        : 'No direct impact - you have no crypto exposure.',
      bullets: [
        hasCrypto ? `Crypto represents ${hasCrypto.weight_percent.toFixed(1)}% of your portfolio` : 'No crypto exposure',
        'Institutional flows supporting price momentum',
        hasCrypto ? 'High volatility - position sizing matters' : 'Consider small allocation for diversification',
      ],
      estimated_impact_percent: hasCrypto ? hasCrypto.weight_percent * 0.1 : 0,
      estimated_impact_eur: hasCrypto ? Math.round(hasCrypto.value_eur * 0.1) : 0,
      affected_positions: portfolio.positions
        .filter((p) => p.asset_class === 'Crypto')
        .map((p) => ({
          ticker: p.ticker,
          name: p.name,
          impact_direction: 'up' as const,
          reason: 'Bitcoin rally lifts crypto sector',
        })),
      recommendations: [
        hasCrypto ? 'Maintain disciplined position sizing given volatility' : 'Research crypto exposure if aligned with risk tolerance',
        'ETF structure provides easier access than direct holdings',
      ],
    },
  };

  // Default impact for news not specifically mapped
  const defaultImpact: NewsImpactPack = {
    news_id: newsId,
    sentiment: 'neutral' as ImpactSentiment,
    confidence: 'low',
    summary: `This news may have indirect effects on your portfolio depending on market reaction.`,
    bullets: [
      'Market sentiment could shift based on this development',
      'Monitor for second-order effects on your holdings',
      'Consider how this fits your investment thesis',
    ],
    estimated_impact_percent: 0.5,
    estimated_impact_eur: Math.round(portfolio.total_value_eur * 0.005),
    affected_positions: portfolio.positions.slice(0, 2).map((p) => ({
      ticker: p.ticker,
      name: p.name,
      impact_direction: 'neutral' as const,
      reason: 'Indirect market correlation',
    })),
    recommendations: [
      'Stay informed but avoid reactive trading',
      'Review position if fundamentals change materially',
    ],
  };

  return impacts[newsId] || defaultImpact;
};

// ============================================
// QUICK PROMPTS
// ============================================

export const quickPrompts: QuickPrompt[] = [
  {
    id: 'qp-1',
    text: 'What are my largest exposures?',
    category: 'exposure',
  },
  {
    id: 'qp-2',
    text: 'Summarize my main risk factors',
    category: 'risk',
  },
  {
    id: 'qp-3',
    text: 'How would a rate cut affect my portfolio?',
    category: 'scenario',
  },
  {
    id: 'qp-4',
    text: 'Is my portfolio well diversified?',
    category: 'general',
  },
];
