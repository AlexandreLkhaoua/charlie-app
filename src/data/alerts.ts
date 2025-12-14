import { MarketAlert } from '@/types'

export const marketAlerts: MarketAlert[] = [
  {
    id: 'alert-001',
    type: 'Macro',
    severity: 'critical',
    title: 'Fed Announces Surprise Rate Hold',
    description: 'Federal Reserve maintains rates at 5.25-5.50%, markets expecting cut. Dot plot suggests only 2 cuts in 2025.',
    impact: 'Bond portfolios may see volatility. Duration risk elevated.',
    affectedClients: ['client-001', 'client-002', 'client-004'],
    timestamp: '2024-12-14T09:30:00Z',
    read: false,
  },
  {
    id: 'alert-002',
    type: 'Stocks',
    severity: 'warning',
    title: 'NVDA Earnings Miss Expectations',
    description: 'Nvidia reports Q3 earnings below consensus. Data center revenue growth slowing.',
    impact: '3 clients have >5% allocation to NVDA. Consider rebalancing.',
    affectedClients: ['client-001', 'client-003', 'client-005'],
    timestamp: '2024-12-13T16:05:00Z',
    read: false,
  },
  {
    id: 'alert-003',
    type: 'FX',
    severity: 'info',
    title: 'EUR/USD Breaks 1.05 Support',
    description: 'Euro weakness continues as ECB signals more cuts. Dollar strength persists.',
    impact: 'Clients with EUR-denominated assets may see currency headwinds.',
    affectedClients: ['client-002', 'client-005'],
    timestamp: '2024-12-13T14:20:00Z',
    read: true,
  },
  {
    id: 'alert-004',
    type: 'Rates',
    severity: 'warning',
    title: '10Y Treasury Yield Spikes to 4.8%',
    description: 'Long-term yields rising on inflation concerns. Yield curve steepening.',
    impact: 'Duration exposure in bond portfolios at risk. Review fixed income allocation.',
    affectedClients: ['client-002', 'client-004', 'client-006'],
    timestamp: '2024-12-13T11:45:00Z',
    read: false,
  },
  {
    id: 'alert-005',
    type: 'Stocks',
    severity: 'info',
    title: 'Apple Announces $100B Buyback',
    description: 'Apple announces largest buyback program in corporate history. Dividend increased 5%.',
    impact: 'Positive for AAPL holders. Consider adding on dips.',
    affectedClients: ['client-001', 'client-002', 'client-003', 'client-005'],
    timestamp: '2024-12-12T20:00:00Z',
    read: true,
  },
  {
    id: 'alert-006',
    type: 'Macro',
    severity: 'warning',
    title: 'China GDP Growth Below Target',
    description: 'Q4 GDP growth at 4.2% vs 5% target. Property sector continues to weigh on economy.',
    impact: 'Emerging market exposure may underperform. Review EM allocation.',
    affectedClients: ['client-002', 'client-005'],
    timestamp: '2024-12-12T08:00:00Z',
    read: true,
  },
  {
    id: 'alert-007',
    type: 'Commodities',
    severity: 'critical',
    title: 'Oil Prices Surge 8% on OPEC+ Cuts',
    description: 'OPEC+ announces deeper production cuts. Brent crude crosses $95/barrel.',
    impact: 'Energy sector poised to outperform. Inflation concerns may resurface.',
    affectedClients: ['client-001', 'client-004'],
    timestamp: '2024-12-11T15:30:00Z',
    read: false,
  },
  {
    id: 'alert-008',
    type: 'Stocks',
    severity: 'info',
    title: 'Microsoft Cloud Revenue Beats',
    description: 'Azure growth accelerates to 35% YoY. AI services driving enterprise adoption.',
    impact: 'MSFT positions benefiting. Tech allocation performing well.',
    affectedClients: ['client-001', 'client-003', 'client-005', 'client-006'],
    timestamp: '2024-12-11T16:30:00Z',
    read: true,
  },
  {
    id: 'alert-009',
    type: 'FX',
    severity: 'warning',
    title: 'JPY Weakness Continues',
    description: 'USD/JPY breaks 155. BoJ maintaining ultra-loose policy despite inflation.',
    impact: 'Japanese equity positions may see currency drag for USD investors.',
    affectedClients: ['client-002'],
    timestamp: '2024-12-10T09:00:00Z',
    read: true,
  },
  {
    id: 'alert-010',
    type: 'Rates',
    severity: 'info',
    title: 'Corporate Spreads Tighten',
    description: 'Investment grade spreads at 18-month lows. High yield also benefiting.',
    impact: 'Credit positions performing well. May be time to take profits.',
    affectedClients: ['client-002', 'client-004', 'client-006'],
    timestamp: '2024-12-10T14:00:00Z',
    read: true,
  },
]

export function getUnreadAlerts(): MarketAlert[] {
  return marketAlerts.filter(alert => !alert.read)
}

export function getAlertsByType(type: MarketAlert['type']): MarketAlert[] {
  return marketAlerts.filter(alert => alert.type === type)
}

export function getAlertsBySeverity(severity: MarketAlert['severity']): MarketAlert[] {
  return marketAlerts.filter(alert => alert.severity === severity)
}

export function getAlertsForClient(clientId: string): MarketAlert[] {
  return marketAlerts.filter(alert => alert.affectedClients.includes(clientId))
}
