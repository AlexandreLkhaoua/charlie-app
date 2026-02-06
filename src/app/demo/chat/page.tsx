'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePortfolioContext } from '@/components/providers/PortfolioProvider';
import { useProfile } from '@/components/providers/ProfileProvider';
import { dataProvider } from '@/lib';
import { Portfolio, AnalyticsOutput } from '@/types';
import { quickPrompts } from '@/lib/mock/data';
import { ChatScreen } from '@/features/chat/ChatScreen';

function ChatLoading() {
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

function ChatContent() {
  const { profile } = usePortfolioContext();
  const { profile: userProfile } = useProfile();
  const searchParams = useSearchParams();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOutput | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function loadContext() {
      setIsInitializing(true);
      try {
        const [portfolioData, analyticsData] = await Promise.all([
          dataProvider.getPortfolio(profile),
          dataProvider.getAnalytics(profile),
        ]);
        setPortfolio(portfolioData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Failed to load context:', err);
      } finally {
        setIsInitializing(false);
      }
    }
    loadContext();
  }, [profile]);

  return (
    <ChatScreen
      portfolio={portfolio}
      analytics={analytics}
      userProfile={userProfile}
      quickPrompts={quickPrompts}
      onSendMessage={dataProvider.sendChat}
      initialPrompt={searchParams.get('prompt')}
      isInitializing={isInitializing}
      backLink="/demo/dashboard"
      isDemoMode={true}
    />
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatContent />
    </Suspense>
  );
}
