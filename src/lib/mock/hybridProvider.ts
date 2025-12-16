import {
  Portfolio,
  PortfolioProfile,
  AnalyticsOutput,
  NewsItem,
  NewsImpactPack,
  ChatMessage,
  ChatContext,
} from '@/types';
import { DataProvider } from '../dataProvider';
import { mockProvider } from './mockProvider';

/**
 * Hybrid Provider v2
 * 
 * Uses mock data for portfolio/analytics/news
 * Uses real OpenAI API for chat (via server route) with Structured Outputs
 * 
 * The chat responses are now structured JSON that can be rendered
 * as UI components instead of plain text.
 */

async function sendChatToAPI(
  messages: ChatMessage[],
  context: ChatContext
): Promise<ChatMessage> {
  try {
    const response = await fetch('/api/copilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        portfolio: context.portfolio,
        analytics: context.analytics,
        selectedNews: context.selected_news,
        userProfile: context.userProfile,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    // New structured response format
    if (data.structured) {
      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.structured.summary, // Fallback content
        timestamp: data.timestamp || new Date().toISOString(),
        structured: data.structured,
      };
    }

    // Legacy format fallback
    return {
      id: data.id || `assistant-${Date.now()}`,
      role: 'assistant',
      content: data.content || 'Réponse reçue',
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Hybrid provider chat error:', error);
    // Fallback to mock if API fails
    console.warn('Falling back to mock chat response');
    return mockProvider.sendChat(messages, context);
  }
}

export const hybridProvider: DataProvider = {
  // Portfolio - use mock
  getPortfolio: (profile?: PortfolioProfile) => mockProvider.getPortfolio(profile),
  
  // Analytics - use mock
  getAnalytics: (profile?: PortfolioProfile) => mockProvider.getAnalytics(profile),
  
  // News - use mock
  getNews: () => mockProvider.getNews(),
  getNewsById: (id: string) => mockProvider.getNewsById(id),
  getNewsImpact: (newsId: string, profile?: PortfolioProfile) => 
    mockProvider.getNewsImpact(newsId, profile),
  
  // Chat - use real API with structured outputs
  sendChat: sendChatToAPI,
  
  // Translation - use mock for now
  translate: (text: string, to: 'EN' | 'FR') => mockProvider.translate(text, to),
};
