// News tags
export type NewsTag = 
  | 'rates' 
  | 'inflation' 
  | 'equity' 
  | 'fx' 
  | 'earnings' 
  | 'geopolitics' 
  | 'commodities'
  | 'crypto'
  | 'macro'
  | 'tech';

// News item (front-end view model)
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  author?: string;
  published_at: string;
  tags: NewsTag[];
  image_url?: string;
  full_text?: string;
  url?: string;
}

// Normalized market news item (backend/storage model)
// Aligné sur la table `news_items` de Supabase et les providers externes.
export interface NormalizedNewsItem {
  provider: string;
  provider_id: string | null;
  url: string;
  title: string;
  summary: string | null;
  source: string | null;
  image_url: string | null;
  published_at: string; // ISO string
  lang: string | null;
  tickers: string[];
  content_hash: string;
}

// Impact sentiment
export type ImpactSentiment = 'positive' | 'negative' | 'neutral' | 'mixed';

// News impact on portfolio
export interface NewsImpactPack {
  news_id: string;
  sentiment: ImpactSentiment;
  confidence: 'high' | 'medium' | 'low';
  
  // Qualitative impact
  summary: string;
  bullets: string[];
  
  // Quantitative estimates
  estimated_impact_percent: number;
  estimated_impact_eur: number;
  
  // Affected positions
  affected_positions: {
    ticker: string;
    name: string;
    impact_direction: 'up' | 'down' | 'neutral';
    reason: string;
  }[];
  
  // Recommended actions (educational)
  recommendations: string[];
}
