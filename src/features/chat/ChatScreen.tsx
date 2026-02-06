'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { ChatMessage, Portfolio, AnalyticsOutput, QuickPrompt } from '@/types';
import type { UserProfile } from '@/lib/profile/profileStore';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { QuickPrompts } from '@/components/chat/QuickPrompts';

export interface ChatScreenProps {
  /** Portfolio data */
  portfolio: Portfolio | null;
  /** Analytics data */
  analytics: AnalyticsOutput | null;
  /** User profile */
  userProfile?: UserProfile | null;
  /** Quick prompts to display */
  quickPrompts: QuickPrompt[];
  /** Function to send a chat message */
  onSendMessage: (messages: ChatMessage[], context: { portfolio: Portfolio; analytics: AnalyticsOutput; userProfile?: UserProfile | null }) => Promise<ChatMessage>;
  /** Initial prompt (from URL param) */
  initialPrompt?: string | null;
  /** Whether data is still loading */
  isInitializing?: boolean;
  /** Back link URL */
  backLink?: string;
  /** Show demo badge */
  isDemoMode?: boolean;
}

/**
 * ChatScreen - Pure UI component for chat interface
 * Handles message state and interaction, delegates data fetching to parent
 */
export function ChatScreen({
  portfolio,
  analytics,
  userProfile,
  quickPrompts,
  onSendMessage,
  initialPrompt,
  isInitializing = false,
  backLink = '/dashboard',
  isDemoMode = false,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasProcessedPrompt = useRef(false);

  // Reset chat when portfolio changes
  useEffect(() => {
    setMessages([]);
    hasProcessedPrompt.current = false;
  }, [portfolio?.id]);

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt && portfolio && analytics && !hasProcessedPrompt.current && messages.length === 0) {
      hasProcessedPrompt.current = true;
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, portfolio, analytics, messages.length]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!portfolio || !analytics) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await onSendMessage(
          [...messages, userMessage],
          { portfolio, analytics, userProfile }
        );
        setMessages((prev) => [...prev, response]);
      } catch (err) {
        console.error('Failed to send message:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: 'Unable to process your request at this time. Please try again.',
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, portfolio, analytics, userProfile, onSendMessage]
  );

  const handleQuickPrompt = (prompt: QuickPrompt) => {
    sendMessage(prompt.text);
  };

  if (isInitializing) {
    return (
      <div className="h-full flex flex-col">
        <div className="animate-pulse mb-4">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
        <div className="flex-1 bg-slate-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-180px)] flex flex-col pb-2">
      {/* Page Header */}
      <div className="mb-3 flex items-center gap-3">
        <a href={backLink} title="Back to dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-slate-900">Charlie</h1>
          <p className="text-xs md:text-sm text-slate-600">
            {userProfile?.displayName 
              ? `Hello ${userProfile.displayName}, ask me about your portfolio` 
              : 'Ask about your holdings, risks, or market conditions'}
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-0">
        {/* Context Badge */}
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-700">
              {portfolio?.name}
            </span>
            <span className="hidden md:inline text-xs text-slate-400">
              {portfolio?.position_count} positions · €{portfolio?.total_value_eur.toLocaleString()}
            </span>
          </div>
          {isDemoMode && (
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Demo</span>
          )}
        </div>

        {/* Chat Messages */}
        <ChatWindow messages={messages} isLoading={isLoading} />

        {/* Quick Prompts - Only when no messages */}
        {messages.length === 0 && (
          <QuickPrompts
            prompts={quickPrompts}
            onSelect={handleQuickPrompt}
            disabled={isLoading}
          />
        )}

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          disabled={isLoading || !portfolio}
          placeholder="Ask a question about your portfolio..."
        />
      </div>

      {/* Disclaimer */}
      <p className="mt-2 text-[10px] text-slate-500 text-center">
        For informational purposes only. Not financial advice.
      </p>
    </div>
  );
}
