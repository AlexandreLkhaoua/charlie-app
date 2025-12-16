import { NewsImpactPack } from '@/types';

interface ImpactPanelProps {
  impact: NewsImpactPack | null;
  isLoading?: boolean;
}

const sentimentConfig = {
  positive: { label: 'Positive', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  negative: { label: 'Negative', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
  neutral: { label: 'Neutral', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  mixed: { label: 'Mixed', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
};

export function ImpactPanel({ impact, isLoading }: ImpactPanelProps) {
  if (isLoading || !impact) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-100 rounded w-1/3"></div>
          <div className="h-3 bg-slate-100 rounded w-full"></div>
          <div className="h-3 bg-slate-100 rounded w-2/3"></div>
          <div className="h-3 bg-slate-100 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const config = sentimentConfig[impact.sentiment];
  const isPositive = impact.estimated_impact_percent >= 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className={`p-4 ${config.bg} border-b ${config.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <div>
              <p className={`text-sm font-semibold ${config.color}`}>
                {config.label} Impact
              </p>
              <p className="text-xs text-slate-500">
                Confidence: {impact.confidence}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{impact.estimated_impact_percent.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500">
              {isPositive ? '+' : ''}€{impact.estimated_impact_eur.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-b border-slate-100">
        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Analysis</h4>
        <p className="text-sm text-slate-600 leading-relaxed">{impact.summary}</p>
      </div>

      <div className="p-4 border-b border-slate-100">
        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Key Points</h4>
        <ul className="space-y-2">
          {impact.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-slate-300 mt-0.5">—</span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {impact.affected_positions.length > 0 && (
        <div className="p-4 border-b border-slate-100">
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Affected Positions</h4>
          <div className="space-y-2">
            {impact.affected_positions.map((pos, index) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    pos.impact_direction === 'up' ? 'bg-emerald-500' : 
                    pos.impact_direction === 'down' ? 'bg-red-500' : 'bg-slate-400'
                  }`} />
                  <span className="font-medium text-slate-900">{pos.ticker}</span>
                  <span className="text-slate-500 text-xs">{pos.name}</span>
                </div>
                <span className={`text-xs font-medium ${
                  pos.impact_direction === 'up' ? 'text-emerald-600' : 
                  pos.impact_direction === 'down' ? 'text-red-600' : 'text-slate-500'
                }`}>
                  {pos.impact_direction === 'up' ? 'Positive' : 
                   pos.impact_direction === 'down' ? 'Negative' : 'Neutral'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {impact.recommendations.length > 0 && (
        <div className="p-4 bg-slate-50">
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Considerations</h4>
          <ul className="space-y-1.5">
            {impact.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-slate-600 leading-relaxed">
                {rec}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            These considerations are for informational purposes only and do not constitute investment advice.
          </p>
        </div>
      )}
    </div>
  );
}
