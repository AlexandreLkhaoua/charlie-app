import Link from 'next/link';
import { RiskFlag, FlagSeverity } from '@/types';

interface FlagsListProps {
  flags: RiskFlag[];
  onFlagClick?: (flag: RiskFlag) => void;
  showAskCopilot?: boolean;
}

const severityConfig: Record<
  FlagSeverity,
  { label: string; bgColor: string; textColor: string; borderColor: string; dotColor: string }
> = {
  high: {
    label: 'High',
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    dotColor: 'bg-red-500',
  },
  medium: {
    label: 'Medium',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
  },
  low: {
    label: 'Low',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
    dotColor: 'bg-slate-400',
  },
  info: {
    label: 'Info',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    dotColor: 'bg-blue-500',
  },
};

export function FlagsList({ flags, onFlagClick, showAskCopilot = true }: FlagsListProps) {
  if (flags.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">
          Risk Assessment
        </h3>
        <div className="flex flex-col items-center justify-center py-6 text-slate-500">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-700">No significant risks detected</p>
          <p className="text-xs text-slate-400 mt-1">Your portfolio appears well-balanced</p>
        </div>
      </div>
    );
  }

  // Sort by severity
  const sortedFlags = [...flags].sort((a, b) => {
    const order: Record<FlagSeverity, number> = { high: 0, medium: 1, low: 2, info: 3 };
    return order[a.severity] - order[b.severity];
  });

  const highCount = flags.filter(f => f.severity === 'high').length;
  const mediumCount = flags.filter(f => f.severity === 'medium').length;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Key Risk Indicators
        </h3>
        <div className="flex items-center gap-2 text-xs">
          {highCount > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-medium">
              {highCount} High
            </span>
          )}
          {mediumCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
              {mediumCount} Medium
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedFlags.map((flag) => {
          const config = severityConfig[flag.severity];
          // Generate a prompt for this specific flag
          const copilotPrompt = encodeURIComponent(`Analyze this risk for my portfolio: "${flag.title}". What's the € impact and what should I consider?`);
          
          return (
            <div
              key={flag.id}
              className={`rounded-lg border p-4 ${config.bgColor} ${config.borderColor} ${
                onFlagClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
              }`}
              onClick={() => onFlagClick?.(flag)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${config.dotColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${config.textColor}`}>
                        {flag.title}
                      </p>
                      <span className={`hidden md:inline text-[10px] px-1.5 py-0.5 rounded ${config.bgColor} ${config.textColor} border ${config.borderColor} uppercase font-medium`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* What it means */}
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    <span className="font-medium text-slate-700">What it means: </span>
                    {flag.explanation}
                  </p>
                  
                  {/* Portfolio impact example */}
                  {flag.recommendation && (
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      <span className="font-medium text-slate-700">Impact: </span>
                      {flag.recommendation}
                    </p>
                  )}
                  
                  {/* Ask Copilot CTA */}
                  {showAskCopilot && (
                    <Link
                      href={`/demo/chat?prompt=${copilotPrompt}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Ask Copilot
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
