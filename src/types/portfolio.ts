// Instrument types
export type InstrumentType = 'Stock' | 'ETF' | 'Bond' | 'MMF' | 'Cash' | 'Crypto';

// Asset classes
export type AssetClass = 'Equities' | 'Fixed Income' | 'Cash & MMF' | 'Alternatives' | 'Crypto';

// Regions
export type Region = 'North America' | 'Europe' | 'Asia Pacific' | 'Emerging Markets' | 'Global';

// Currencies
export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'JPY' | 'Other';

// Single position in portfolio
export interface Position {
  id: string;
  isin: string;
  name: string;
  ticker: string;
  instrument_type: InstrumentType;
  asset_class: AssetClass;
  region: Region;
  currency: Currency;
  quantity: number;
  price_eur: number;
  market_value_eur: number;
  weight_percent: number;
  cost_basis_eur?: number;
  pnl_eur?: number;
  pnl_percent?: number;
}

// Portfolio profile types
export type PortfolioProfile = 'prudent' | 'balanced' | 'aggressive';

// Portfolio summary
export interface Portfolio {
  id: string;
  name: string;
  profile: PortfolioProfile;
  owner: string;
  created_at: string;
  updated_at: string;
  total_value_eur: number;
  total_pnl_eur: number;
  total_pnl_percent: number;
  positions: Position[];
  position_count: number;
}
