'use client';

import { useEffect, useState } from 'react';
import { usePortfolioContext } from '@/components/providers/PortfolioProvider';
import { dataProvider } from '@/lib';
import { Portfolio, AnalyticsOutput } from '@/types';
import { RisksScreen } from '@/features/risks/RisksScreen';

export default function RisksPage() {
  const { profile } = usePortfolioContext();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [portfolioData, analyticsData] = await Promise.all([
          dataProvider.getPortfolio(profile),
          dataProvider.getAnalytics(profile),
        ]);
        setPortfolio(portfolioData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [profile]);

  return (
    <RisksScreen
      portfolio={portfolio}
      analytics={analytics}
      isLoading={isLoading}
      backLink="/demo/dashboard"
    />
  );
}
