'use client';

import { useEffect, useState } from 'react';
import { usePortfolioContext } from '@/components/providers/PortfolioProvider';
import { dataProvider } from '@/lib';
import { Portfolio, AnalyticsOutput, NewsItem } from '@/types';
import { DashboardScreen } from '@/features/dashboard/DashboardScreen';

export default function DashboardPage() {
  const { profile } = usePortfolioContext();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOutput | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [portfolioData, analyticsData, newsData] = await Promise.all([
          dataProvider.getPortfolio(profile),
          dataProvider.getAnalytics(profile),
          dataProvider.getNews(),
        ]);
        setPortfolio(portfolioData);
        setAnalytics(analyticsData);
        setNews(newsData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [profile]);

  return (
    <DashboardScreen
      portfolio={portfolio}
      analytics={analytics}
      news={news}
      isLoading={isLoading}
      basePath="/demo"
    />
  );
}
