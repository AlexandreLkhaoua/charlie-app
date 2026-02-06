import { NewsItem, NewsTag } from '@/types';

interface NewsListProps {
  news: NewsItem[];
  selectedId?: string;
  onSelect: (news: NewsItem) => void;
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function NewsList({ news, selectedId, onSelect }: NewsListProps) {
  return (
    <div className="divide-y divide-slate-100">
      {news.map((item) => (
        <div
          key={item.id}
          className={`p-4 cursor-pointer transition-colors ${
            selectedId === item.id 
              ? 'bg-slate-100 border-l-2 border-slate-900' 
              : 'hover:bg-slate-50'
          }`}
          onClick={() => onSelect(item)}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-slate-900 line-clamp-2">
              {item.title}
            </h3>
            <span className="text-[10px] text-slate-500 whitespace-nowrap uppercase tracking-wide">
              {formatDate(item.published_at)}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.summary}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase">{item.source}</span>
            <span className="text-slate-200">|</span>
            <div className="flex gap-1">
              {item.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${tagColors[tag]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
