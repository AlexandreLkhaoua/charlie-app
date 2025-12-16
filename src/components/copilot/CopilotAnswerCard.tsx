'use client';

import { CopilotStructuredResponse } from '@/lib/copilot';

interface CopilotAnswerCardProps {
  response: CopilotStructuredResponse;
}

export function CopilotAnswerCard({ response }: CopilotAnswerCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Summary */}
      <div className="p-4 border-b border-slate-100">
        <p className="text-sm text-slate-800 leading-relaxed font-medium">
          {response.summary}
        </p>
      </div>

      {/* Key Numbers */}
      <div className="p-4 bg-slate-50 border-b border-slate-100">
        <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-3">
          Key Numbers
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {response.key_numbers.map((kn, idx) => (
            <div key={idx} className="bg-white rounded-md p-3 border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">{kn.label}</p>
              <p className="text-lg font-semibold text-slate-900">
                {kn.value}
                <span className="text-xs font-normal text-slate-500 ml-1">{kn.unit}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{kn.evidence}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interpretation */}
      <div className="p-4 border-b border-slate-100">
        <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-2">
          What This Means
        </h4>
        <p className="text-sm text-slate-700 leading-relaxed">
          {response.interpretation}
        </p>
      </div>

      {/* Possible Actions */}
      <div className="p-4 border-b border-slate-100">
        <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-3">
          Considerations
        </h4>
        <div className="space-y-3">
          {response.possible_actions.map((action, idx) => (
            <div key={idx} className="bg-slate-50 rounded-md p-3">
              <p className="text-sm font-medium text-slate-800 mb-1">
                {action.action}
              </p>
              <p className="text-xs text-slate-600 mb-2">
                <span className="font-medium">Why:</span> {action.why}
              </p>
              <p className="text-xs text-slate-500">
                <span className="font-medium">Trade-off:</span> {action.tradeoff}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence & Missing Data */}
      {response.missing_data.length > 0 && (
        <div className="p-4 border-b border-slate-100 bg-amber-50">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-xs font-medium text-amber-800 mb-1">
                Missing data for deeper analysis
              </p>
              <ul className="text-xs text-amber-700 space-y-0.5">
                {response.missing_data.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimers */}
      <div className="p-3 bg-slate-100">
        <div className="flex items-center gap-1.5 mb-1">
          <ConfidenceBadge confidence={response.confidence} />
        </div>
        <div className="text-[10px] text-slate-400 space-y-0.5">
          {response.disclaimers.map((disclaimer, idx) => (
            <p key={idx}>• {disclaimer}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: 'low' | 'medium' | 'high' }) {
  const config = {
    low: { label: 'Low confidence', bg: 'bg-red-100', text: 'text-red-700' },
    medium: { label: 'Medium confidence', bg: 'bg-amber-100', text: 'text-amber-700' },
    high: { label: 'High confidence', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  };
  
  const c = config[confidence];
  
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
