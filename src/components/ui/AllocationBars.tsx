import { Allocation } from '@/types';

interface AllocationBarsProps {
  allocations: Allocation[];
  title: string;
  showValues?: boolean;
}

const colorMap: Record<string, string> = {
  'Equities': 'bg-slate-700',
  'Fixed Income': 'bg-slate-500',
  'Cash & MMF': 'bg-slate-300',
  'Alternatives': 'bg-slate-600',
  'Crypto': 'bg-slate-400',
  'EUR': 'bg-slate-700',
  'USD': 'bg-slate-500',
  'GBP': 'bg-slate-400',
  'CHF': 'bg-slate-300',
  'JPY': 'bg-slate-600',
  'Other': 'bg-slate-400',
  'North America': 'bg-slate-700',
  'Europe': 'bg-slate-500',
  'Asia Pacific': 'bg-slate-400',
  'Emerging Markets': 'bg-slate-600',
  'Global': 'bg-slate-300',
};

export function AllocationBars({
  allocations,
  title,
  showValues = true,
}: AllocationBarsProps) {
  const sortedAllocations = [...allocations].sort(
    (a, b) => b.weight_percent - a.weight_percent
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-xs font-medium text-slate-600 uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-3">
        {sortedAllocations.map((allocation) => (
          <div key={allocation.category}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-slate-600">{allocation.category}</span>
              <span className="font-medium text-slate-900">
                {allocation.weight_percent.toFixed(1)}%
                {showValues && (
                  <span className="ml-2 text-slate-500 text-xs">
                    €{allocation.value_eur.toLocaleString()}
                  </span>
                )}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  colorMap[allocation.category] || 'bg-slate-400'
                }`}
                style={{ width: `${allocation.weight_percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
