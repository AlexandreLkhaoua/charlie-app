import {
  Portfolio,
  PortfolioProfile,
  AnalyticsOutput,
  NewsItem,
  NewsImpactPack,
  ChatMessage,
  ChatContext,
} from '@/types';

/**
 * DataProvider Interface
 * 
 * This is the adapter pattern interface for data access.
 * All data in the app flows through this interface.
 * 
 * Current implementation: MockProvider (lib/mock/mockProvider.ts)
 * Future implementation: ApiProvider (to be created by backend team)
 * 
 * To swap providers, update the export in this file.
 */
export interface DataProvider {
  // Portfolio
  getPortfolio(profile?: PortfolioProfile): Promise<Portfolio>;
  
  // Analytics
  getAnalytics(profile?: PortfolioProfile): Promise<AnalyticsOutput>;
  
  // News
  getNews(): Promise<NewsItem[]>;
  getNewsById(id: string): Promise<NewsItem | null>;
  getNewsImpact(newsId: string, profile?: PortfolioProfile): Promise<NewsImpactPack>;
  
  // Chat / AI
  sendChat(
    messages: ChatMessage[],
    context: ChatContext
  ): Promise<ChatMessage>;
  
  // Translation
  translate(text: string, to: 'EN' | 'FR'): Promise<string>;
}

// Storage key for selected portfolio profile
export const PORTFOLIO_PROFILE_KEY = 'charlie-copilot-portfolio-profile';

// Get selected profile from localStorage (client-side only)
export function getStoredProfile(): PortfolioProfile {
  if (typeof window === 'undefined') return 'balanced';
  const stored = localStorage.getItem(PORTFOLIO_PROFILE_KEY);
  if (stored === 'prudent' || stored === 'balanced' || stored === 'aggressive') {
    return stored;
  }
  return 'balanced';
}

// Set profile in localStorage
export function setStoredProfile(profile: PortfolioProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PORTFOLIO_PROFILE_KEY, profile);
}
