import { AssetClass, Currency, Region, Position } from './portfolio';

// Allocation breakdown
export interface Allocation {
  category: string;
  value_eur: number;
  weight_percent: number;
}

// Concentration metrics
export interface ConcentrationMetrics {
  top1_weight: number;
  top5_weight: number;
  top10_weight: number;
  top_positions: {
    name: string;
    ticker: string;
    weight_percent: number;
  }[];
}

// FX Exposure
export interface FxExposure {
  currency: Currency;
  value_eur: number;
  weight_percent: number;
}

// Risk flag severity
export type FlagSeverity = 'high' | 'medium' | 'low' | 'info';

// Risk flag
export interface RiskFlag {
  id: string;
  severity: FlagSeverity;
  category: string;
  title: string;
  explanation: string;
  recommendation?: string;
}

// Scenario impact
export interface ScenarioImpact {
  scenario_name: string;
  description: string;
  impact_percent: number;
  impact_eur: number;
  confidence: 'high' | 'medium' | 'low';
}

// Complete analytics output
export interface AnalyticsOutput {
  portfolio_id: string;
  computed_at: string;
  
  // Allocations
  allocations_by_asset_class: Allocation[];
  allocations_by_currency: Allocation[];
  allocations_by_region: Allocation[];
  
  // Concentration
  concentration: ConcentrationMetrics;
  
  // FX Exposure
  fx_exposure: FxExposure[];
  
  // Risk flags
  flags: RiskFlag[];
  
  // Scenario analysis
  scenarios: {
    rate_cut: ScenarioImpact;
    rate_hike: ScenarioImpact;
    equity_crash: ScenarioImpact;
    equity_rally: ScenarioImpact;
    usd_depreciation: ScenarioImpact;
    usd_appreciation: ScenarioImpact;
  };
}
