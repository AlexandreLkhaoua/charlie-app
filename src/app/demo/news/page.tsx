'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePortfolioContext } from '@/components/providers/PortfolioProvider';
import { dataProvider } from '@/lib';
import type { NewsItem, NewsImpactPack, NormalizedNewsItem } from '@/types';
import { NewsList } from '@/components/news/NewsList';
import { NewsDetail } from '@/components/news/NewsDetail';
import { ImpactPanel } from '@/components/news/ImpactPanel';

export default function NewsPage() {
  const { profile } = usePortfolioContext();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [impact, setImpact] = useState<NewsImpactPack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingImpact, setIsLoadingImpact] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  useEffect(() => {
    async function loadNews() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error(`Failed to load news: ${response.status}`);
        }

        const json: { provider: string; items: NormalizedNewsItem[] } = await response.json();

        const newsData: NewsItem[] = json.items.map((item, index) => ({
          id: item.content_hash || `${item.provider}-${index}`,
          title: item.title,
          summary: item.summary ?? '',
          source: item.source ?? item.provider,
          published_at: item.published_at,
          tags: [], // TODO: mapper les tags à partir des tickers / catégories provider
          image_url: item.image_url ?? undefined,
          url: item.url,
        }));

        // Sort by date (newest first)
        const sorted = [...newsData].sort((a, b) => {
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        });
        setNews(sorted);
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadNews();
  }, []);

  useEffect(() => {
    async function loadImpact() {
      if (!selectedNews) {
        setImpact(null);
        return;
      }
      setIsLoadingImpact(true);
      setTranslatedContent(null);
      setLanguage('EN');
      try {
        const impactData = await dataProvider.getNewsImpact(selectedNews.id, profile);
        setImpact(impactData);
      } catch (err) {
        console.error('Failed to load impact:', err);
      } finally {
        setIsLoadingImpact(false);
      }
    }
    loadImpact();
  }, [selectedNews, profile]);

  const handleToggleLanguage = async () => {
    if (!selectedNews) return;
    
    const targetLang = language === 'EN' ? 'FR' : 'EN';
    setIsTranslating(true);
    try {
      const translated = await dataProvider.translate(selectedNews.summary, targetLang);
      setTranslatedContent(translated);
      setLanguage(targetLang);
    } catch (err) {
      console.error('Failed to translate:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Mobile-first: Show detail view or list view
  if (selectedNews) {
    const copilotPrompt = encodeURIComponent(`Analyze this news for my portfolio: "${selectedNews.title}". Which of my holdings are affected and what's the potential impact?`);
    
    return (
      <div className="space-y-4 pb-4">
        {/* Back button */}
        <button
          onClick={() => setSelectedNews(null)}
          className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to news
        </button>

        {/* Impact Panel First - Most important info */}
        <div>
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            Portfolio Impact
          </h3>
          <ImpactPanel impact={impact} isLoading={isLoadingImpact} />
        </div>

        {/* Ask Copilot CTA */}
        <Link
          href={`/demo/chat?prompt=${copilotPrompt}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Ask Copilot
        </Link>

        {/* News Detail */}
        <NewsDetail
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          isTranslating={isTranslating}
          translatedContent={translatedContent || undefined}
          hideCloseButton
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link href="/demo/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Market News</h1>
          <p className="text-sm text-slate-500">
            {news.length} articles relevant to your holdings
          </p>
        </div>
      </div>

      {/* News List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <NewsList
          news={news}
          onSelect={setSelectedNews}
        />
      </div>
    </div>
  );
}
