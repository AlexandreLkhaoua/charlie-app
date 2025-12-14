// Types pour les clients
export interface Client {
  id: string
  name: string
  type: 'Private Client' | 'Family Office' | 'UHNW'
  email: string
  phone: string
  relationshipManager: string
  totalAUM: number
  ytdReturn: number
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive'
  lastReview: string
  nextReview: string
  status: 'Active' | 'Review Pending' | 'At Risk'
  avatar?: string
  createdAt: string
}

// Types pour les portefeuilles
export interface Portfolio {
  id: string
  clientId: string
  name: string
  value: number
  allocation: AllocationItem[]
  performance: PerformanceData
  positions: Position[]
}

export interface AllocationItem {
  asset: string
  percentage: number
  value: number
  color: string
}

export interface PerformanceData {
  ytd: number
  oneYear: number
  threeYear: number
  fiveYear: number
  inception: number
  benchmark: string
  benchmarkYtd: number
}

export interface Position {
  id: string
  symbol: string
  name: string
  quantity: number
  avgCost: number
  currentPrice: number
  value: number
  pnl: number
  pnlPercent: number
  weight: number
  sector?: string
  assetClass: string
}

// Types pour les alertes marché
export interface MarketAlert {
  id: string
  type: 'Macro' | 'Stocks' | 'Rates' | 'FX' | 'Crypto' | 'Commodities'
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  impact: string
  affectedClients: string[]
  timestamp: string
  read: boolean
}

// Types pour les produits
export interface Product {
  id: string
  isin: string
  name: string
  type: 'Equity' | 'Bond' | 'ETF' | 'Fund' | 'Structured'
  currency: string
  price: number
  change: number
  changePercent: number
  ytdReturn: number
  sector?: string
  rating?: string
  maturity?: string
  coupon?: number
}

// Types pour la compliance
export interface ComplianceStatus {
  clientId: string
  kycStatus: 'Valid' | 'Expiring' | 'Expired'
  kycExpiry: string
  amlCheck: 'Clear' | 'Review' | 'Flag'
  fatcaStatus: 'Compliant' | 'Pending' | 'Non-Compliant'
  suitability: 'Appropriate' | 'Review Required'
  lastReview: string
  issues: ComplianceIssue[]
}

export interface ComplianceIssue {
  type: string
  severity: 'Low' | 'Medium' | 'High'
  description: string
  dueDate: string
}

// Types pour la fiscalité US
export interface TaxInfo {
  clientId: string
  taxStatus: 'US Person' | 'Non-US Person'
  ssn?: string
  w9Status?: 'On File' | 'Pending' | 'Required'
  estimatedTax: number
  realizedGains: number
  unrealizedGains: number
  taxLossHarvesting: TaxLossOpportunity[]
}

export interface TaxLossOpportunity {
  positionId: string
  symbol: string
  currentLoss: number
  potentialTaxSavings: number
  washSaleRisk: boolean
}

// Types pour les comptes US
export interface USAccount {
  id: string
  clientId: string
  type: '401k' | 'IRA' | 'Roth IRA' | 'Brokerage' | 'Trust' | 'Custodial'
  value: number
  contributions: number
  withdrawals: number
  rmdRequired: boolean
  rmdAmount?: number
}

// Types pour les transactions
export interface Transaction {
  id: string
  clientId: string
  type: 'Buy' | 'Sell' | 'Dividend' | 'Interest' | 'Fee' | 'Transfer'
  symbol?: string
  name: string
  quantity?: number
  price?: number
  amount: number
  date: string
  status: 'Pending' | 'Executed' | 'Settled' | 'Cancelled'
}

// Types pour les messages du chatbot
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  context?: {
    type: 'client' | 'market' | 'product' | 'general'
    references?: string[]
  }
}

// Types pour les simulations
export interface SimulationResult {
  currentAllocation: AllocationItem[]
  proposedAllocation: AllocationItem[]
  expectedReturn: number
  expectedRisk: number
  sharpeRatio: number
  maxDrawdown: number
  rebalancingCost: number
}

// Types pour les KPIs
export interface DashboardKPIs {
  totalAUM: number
  totalClients: number
  avgReturn: number
  clientsAtRisk: number
  pendingReviews: number
  complianceIssues: number
  newAlerts: number
}

// Types API Response
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
