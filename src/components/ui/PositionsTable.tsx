import { Position } from '@/types';

interface PositionsTableProps {
  positions: Position[];
  maxRows?: number;
  showActions?: boolean;
}

export function PositionsTable({
  positions,
  maxRows = 10,
  showActions = false,
}: PositionsTableProps) {
  const displayPositions = positions.slice(0, maxRows);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200">
        <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          Holdings
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Showing {Math.min(maxRows, positions.length)} of {positions.length} positions
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Security
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Market Value
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Weight
              </th>
              {showActions && (
                <th className="px-4 py-3 text-right text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {displayPositions.map((position) => (
              <tr key={position.id} className="hover:bg-slate-50 transition-colors duration-200">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {position.ticker}
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-50">
                      {position.name}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 uppercase">
                    {position.instrument_type}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="text-sm text-slate-900">
                    €{position.market_value_eur.toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-slate-900">
                    {position.weight_percent.toFixed(1)}%
                  </div>
                </td>
                {showActions && (
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <button className="text-slate-600 hover:text-slate-900 text-xs font-medium">
                      View Details
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
