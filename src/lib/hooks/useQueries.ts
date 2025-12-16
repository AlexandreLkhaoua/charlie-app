import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Portfolio, Position } from '@/lib/validation/schemas';

// ============================================
// Query Keys - Centralized key management
// ============================================

export const queryKeys = {
  // Portfolio
  portfolio: ['portfolio'] as const,
  portfolioById: (id: string) => ['portfolio', id] as const,
  portfolioPositions: (id: string) => ['portfolio', id, 'positions'] as const,
  
  // Market data
  marketData: ['market'] as const,
  stockPrice: (symbol: string) => ['market', 'stock', symbol] as const,
  
  // News
  news: ['news'] as const,
  newsById: (id: string) => ['news', id] as const,
  newsByCategory: (category: string) => ['news', 'category', category] as const,
  
  // User
  user: ['user'] as const,
  userProfile: ['user', 'profile'] as const,
  
  // Chat
  chatHistory: ['chat', 'history'] as const,
  chatConversation: (id: string) => ['chat', 'conversation', id] as const,
} as const;

// ============================================
// Portfolio Hooks
// ============================================

export function usePortfolio() {
  return useQuery({
    queryKey: queryKeys.portfolio,
    queryFn: async (): Promise<Portfolio> => {
      // Replace with actual API call
      const response = await fetch('/api/portfolio');
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      return response.json();
    },
  });
}

export function usePortfolioPositions(portfolioId: string) {
  return useQuery({
    queryKey: queryKeys.portfolioPositions(portfolioId),
    queryFn: async (): Promise<Position[]> => {
      const response = await fetch(`/api/portfolio/${portfolioId}/positions`);
      if (!response.ok) throw new Error('Failed to fetch positions');
      return response.json();
    },
    enabled: !!portfolioId,
  });
}

// ============================================
// Market Data Hooks
// ============================================

export function useStockPrice(symbol: string) {
  return useQuery({
    queryKey: queryKeys.stockPrice(symbol),
    queryFn: async () => {
      const response = await fetch(`/api/market/stock/${symbol}`);
      if (!response.ok) throw new Error('Failed to fetch stock price');
      return response.json();
    },
    enabled: !!symbol,
    // Stock prices should be more frequently updated
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Auto-refetch every minute
  });
}

// ============================================
// News Hooks
// ============================================

export function useNews(category?: string) {
  return useQuery({
    queryKey: category ? queryKeys.newsByCategory(category) : queryKeys.news,
    queryFn: async () => {
      const url = category ? `/api/news?category=${category}` : '/api/news';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch news');
      return response.json();
    },
  });
}

// ============================================
// Chat Hooks
// ============================================

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SendMessageParams {
  message: string;
  conversationId?: string;
}

export function useChatHistory() {
  return useQuery({
    queryKey: queryKeys.chatHistory,
    queryFn: async (): Promise<ChatMessage[]> => {
      const response = await fetch('/api/chat/history');
      if (!response.ok) throw new Error('Failed to fetch chat history');
      return response.json();
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message, conversationId }: SendMessageParams) => {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationId }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate chat history to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.chatHistory });
    },
  });
}

// ============================================
// Prefetch Utilities
// ============================================

export function usePrefetchPortfolio() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.portfolio,
      queryFn: async () => {
        const response = await fetch('/api/portfolio');
        return response.json();
      },
    });
  };
}

// Re-export TanStack Query hooks for convenience
export { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
