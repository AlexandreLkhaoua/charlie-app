import { Portfolio, Position, AllocationItem } from '@/types'

export const portfolios: Portfolio[] = [
  {
    id: 'portfolio-001',
    clientId: 'client-001',
    name: 'Main Portfolio',
    value: 45_000_000,
    allocation: [
      { asset: 'US Equities', percentage: 45, value: 20_250_000, color: '#3b82f6' },
      { asset: 'International Equities', percentage: 15, value: 6_750_000, color: '#8b5cf6' },
      { asset: 'Fixed Income', percentage: 20, value: 9_000_000, color: '#22c55e' },
      { asset: 'Alternatives', percentage: 12, value: 5_400_000, color: '#f59e0b' },
      { asset: 'Cash', percentage: 8, value: 3_600_000, color: '#6b7280' },
    ],
    performance: {
      ytd: 12.4,
      oneYear: 15.8,
      threeYear: 9.2,
      fiveYear: 11.5,
      inception: 10.8,
      benchmark: 'S&P 500',
      benchmarkYtd: 22.8,
    },
    positions: [
      { id: 'pos-001', symbol: 'AAPL', name: 'Apple Inc.', quantity: 15000, avgCost: 142.50, currentPrice: 195.89, value: 2_938_350, pnl: 800_850, pnlPercent: 37.45, weight: 6.53, sector: 'Technology', assetClass: 'US Equities' },
      { id: 'pos-002', symbol: 'MSFT', name: 'Microsoft Corporation', quantity: 8000, avgCost: 285.00, currentPrice: 378.91, value: 3_031_280, pnl: 751_280, pnlPercent: 32.95, weight: 6.74, sector: 'Technology', assetClass: 'US Equities' },
      { id: 'pos-003', symbol: 'NVDA', name: 'NVIDIA Corporation', quantity: 5000, avgCost: 250.00, currentPrice: 467.70, value: 2_338_500, pnl: 1_088_500, pnlPercent: 87.08, weight: 5.20, sector: 'Technology', assetClass: 'US Equities' },
      { id: 'pos-004', symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 12000, avgCost: 105.00, currentPrice: 141.80, value: 1_701_600, pnl: 441_600, pnlPercent: 35.05, weight: 3.78, sector: 'Communication Services', assetClass: 'US Equities' },
      { id: 'pos-005', symbol: 'AMZN', name: 'Amazon.com Inc.', quantity: 10000, avgCost: 98.50, currentPrice: 153.42, value: 1_534_200, pnl: 549_200, pnlPercent: 55.76, weight: 3.41, sector: 'Consumer Discretionary', assetClass: 'US Equities' },
      { id: 'pos-006', symbol: 'SPY', name: 'SPDR S&P 500 ETF', quantity: 18000, avgCost: 412.00, currentPrice: 467.50, value: 8_415_000, pnl: 999_000, pnlPercent: 13.47, weight: 18.70, sector: 'Broad Market', assetClass: 'US Equities' },
      { id: 'pos-007', symbol: 'VXUS', name: 'Vanguard Total International', quantity: 115000, avgCost: 52.00, currentPrice: 58.42, value: 6_718_300, pnl: 738_300, pnlPercent: 12.35, weight: 14.93, sector: 'International', assetClass: 'International Equities' },
      { id: 'pos-008', symbol: 'AGG', name: 'iShares Core US Aggregate Bond', quantity: 85000, avgCost: 98.50, currentPrice: 96.80, value: 8_228_000, pnl: -144_500, pnlPercent: -1.73, weight: 18.28, sector: 'Fixed Income', assetClass: 'Fixed Income' },
      { id: 'pos-009', symbol: 'BRK.B', name: 'Berkshire Hathaway B', quantity: 4500, avgCost: 320.00, currentPrice: 358.92, value: 1_615_140, pnl: 175_140, pnlPercent: 12.16, weight: 3.59, sector: 'Financials', assetClass: 'US Equities' },
      { id: 'pos-010', symbol: 'CASH', name: 'Cash & Equivalents', quantity: 1, avgCost: 3_600_000, currentPrice: 3_600_000, value: 3_600_000, pnl: 0, pnlPercent: 0, weight: 8.00, assetClass: 'Cash' },
    ],
  },
  {
    id: 'portfolio-002',
    clientId: 'client-002',
    name: 'Morrison Family Office',
    value: 125_000_000,
    allocation: [
      { asset: 'US Equities', percentage: 35, value: 43_750_000, color: '#3b82f6' },
      { asset: 'International Equities', percentage: 20, value: 25_000_000, color: '#8b5cf6' },
      { asset: 'Fixed Income', percentage: 30, value: 37_500_000, color: '#22c55e' },
      { asset: 'Real Estate', percentage: 10, value: 12_500_000, color: '#ef4444' },
      { asset: 'Cash', percentage: 5, value: 6_250_000, color: '#6b7280' },
    ],
    performance: {
      ytd: 9.8,
      oneYear: 11.2,
      threeYear: 7.8,
      fiveYear: 9.2,
      inception: 8.5,
      benchmark: '60/40 Portfolio',
      benchmarkYtd: 14.2,
    },
    positions: [],
  },
  {
    id: 'portfolio-003',
    clientId: 'client-003',
    name: 'Growth Portfolio',
    value: 8_500_000,
    allocation: [
      { asset: 'US Equities', percentage: 60, value: 5_100_000, color: '#3b82f6' },
      { asset: 'International Equities', percentage: 20, value: 1_700_000, color: '#8b5cf6' },
      { asset: 'Fixed Income', percentage: 10, value: 850_000, color: '#22c55e' },
      { asset: 'Crypto', percentage: 5, value: 425_000, color: '#f59e0b' },
      { asset: 'Cash', percentage: 5, value: 425_000, color: '#6b7280' },
    ],
    performance: {
      ytd: 15.2,
      oneYear: 18.5,
      threeYear: 12.4,
      fiveYear: 14.8,
      inception: 13.2,
      benchmark: 'NASDAQ 100',
      benchmarkYtd: 48.5,
    },
    positions: [],
  },
  {
    id: 'portfolio-004',
    clientId: 'client-004',
    name: 'Conservative Income',
    value: 12_300_000,
    allocation: [
      { asset: 'US Equities', percentage: 25, value: 3_075_000, color: '#3b82f6' },
      { asset: 'Fixed Income', percentage: 55, value: 6_765_000, color: '#22c55e' },
      { asset: 'Alternatives', percentage: 10, value: 1_230_000, color: '#f59e0b' },
      { asset: 'Cash', percentage: 10, value: 1_230_000, color: '#6b7280' },
    ],
    performance: {
      ytd: -2.1,
      oneYear: 1.5,
      threeYear: 3.2,
      fiveYear: 4.8,
      inception: 5.5,
      benchmark: 'Barclays Aggregate',
      benchmarkYtd: 1.2,
    },
    positions: [],
  },
]

export function getPortfolioByClientId(clientId: string): Portfolio | undefined {
  return portfolios.find(portfolio => portfolio.clientId === clientId)
}

export function getPortfolioById(id: string): Portfolio | undefined {
  return portfolios.find(portfolio => portfolio.id === id)
}

export function calculateTotalAUM(): number {
  return portfolios.reduce((sum, portfolio) => sum + portfolio.value, 0)
}
