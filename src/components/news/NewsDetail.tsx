import { NewsItem, NewsTag } from '@/types';

export interface NewsDetailProps {
  news: NewsItem;
  onClose: () => void;
  language: 'EN' | 'FR';
  onToggleLanguage: () => void;
  isTranslating?: boolean;
  translatedContent?: string;
  hideCloseButton?: boolean;
}

const tagColors: Record<NewsTag, string> = {
  rates: 'bg-slate-100 text-slate-700',
  inflation: 'bg-slate-100 text-slate-700',
  equity: 'bg-slate-100 text-slate-700',
  fx: 'bg-slate-100 text-slate-700',
  earnings: 'bg-slate-100 text-slate-700',
  geopolitics: 'bg-slate-100 text-slate-700',
  commodities: 'bg-slate-100 text-slate-700',
  crypto: 'bg-slate-100 text-slate-700',
  macro: 'bg-slate-100 text-slate-700',
  tech: 'bg-slate-100 text-slate-700',
};

export function NewsDetail({
  news,
  onClose,
  language,
  onToggleLanguage,
  isTranslating,
  translatedContent,
  hideCloseButton = false,
}: NewsDetailProps) {
  const displaySummary = translatedContent || news.summary;

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {news.title}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium">{news.source}</span>
              {news.author && (
                <>
                  <span className="text-slate-300">|</span>
                  <span>{news.author}</span>
                </>
              )}
              <span className="text-slate-300">|</span>
              <span>
                {new Date(news.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
          {!hideCloseButton && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {news.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase ${tagColors[tag]}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Summary</h3>
          <button
            onClick={onToggleLanguage}
            disabled={isTranslating}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
          >
            {isTranslating ? (
              <>
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Translating...
              </>
            ) : (
              <>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {language === 'EN' ? 'FR' : 'EN'}
              </>
            )}
          </button>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {displaySummary}
        </p>
        {news.full_text && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">
              {news.full_text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
