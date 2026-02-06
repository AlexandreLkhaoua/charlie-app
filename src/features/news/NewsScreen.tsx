'use client';

import Link from 'next/link';
import { NewsItem, NewsImpactPack, Portfolio } from '@/types';
import { NewsList } from '@/components/news/NewsList';
import { NewsDetail } from '@/components/news/NewsDetail';
import { ImpactPanel } from '@/components/news/ImpactPanel';

export interface NewsScreenProps {
  news: NewsItem[];
  selectedNews: NewsItem | null;
  impact: NewsImpactPack | null;
  portfolio: Portfolio | null;
  language: 'EN' | 'FR';
  isLoading?: boolean;
  isLoadingImpact?: boolean;
  onSelectNews: (item: NewsItem) => void;
  onToggleLanguage: () => void;
  backLink?: string;
}

export function NewsScreen({
  news,
  selectedNews,
  impact,
  portfolio,
  language,
  isLoading = false,
  isLoadingImpact = false,
  onSelectNews,
  onToggleLanguage,
  backLink = '/dashboard',
}: NewsScreenProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={backLink} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Market News</h1>
            <p className="text-sm text-slate-600">Relevant to your holdings</p>
          </div>
        </div>
        <button
          onClick={onToggleLanguage}
          className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          {language}
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* News List */}
        <div className="lg:col-span-1">
          <NewsList
            news={news}
            selectedId={selectedNews?.id || undefined}
            onSelect={onSelectNews}
          />
        </div>

        {/* Detail & Impact */}
        <div className="lg:col-span-2 space-y-4">
          {selectedNews && (
            <>
              <NewsDetail 
                news={selectedNews} 
                language={language}
                onClose={() => onSelectNews(selectedNews)}
                onToggleLanguage={onToggleLanguage}
                hideCloseButton={true}
              />
              {impact && (
                <ImpactPanel
                  impact={impact}
                  isLoading={isLoadingImpact}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
