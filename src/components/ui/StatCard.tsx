interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  description?: string; // Pedagogical explanation
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatCard({
  title,
  value,
  subtitle,
  description,
  trend,
  variant = 'default',
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-white border-slate-200',
    success: 'bg-white border-slate-200',
    warning: 'bg-white border-slate-200',
    danger: 'bg-white border-slate-200',
  };

  const trendStyles = {
    default: '',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    danger: 'text-red-600',
  };

  const trendColor = trend
    ? trend.value >= 0
      ? 'text-emerald-600'
      : 'text-red-600'
    : '';

  return (
    <div
      className={`rounded-lg border p-3 md:p-4 shadow-sm ${variantStyles[variant]}`}
    >
      <p className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wide truncate">
        {title}
      </p>
      <p className={`mt-1 md:mt-2 text-lg md:text-2xl font-semibold text-slate-900 ${trendStyles[variant]}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-slate-500 truncate">{subtitle}</p>
      )}
      {trend && (
        <p className={`mt-1 text-xs md:text-sm font-medium ${trendColor}`}>
          {trend.value >= 0 ? '+' : ''}{trend.value.toFixed(1)}%
          <span className="hidden md:inline font-normal text-slate-400"> {trend.label}</span>
        </p>
      )}
      {/* Description hidden on mobile for compactness */}
      {description && (
        <p className="hidden md:block mt-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-2">
          {description}
        </p>
      )}
    </div>
  );
}
