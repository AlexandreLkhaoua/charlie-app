import { ScenarioImpact } from '@/types';

interface ScenarioCardsProps {
  scenarios: {
    rate_cut: ScenarioImpact;
    rate_hike: ScenarioImpact;
    equity_crash: ScenarioImpact;
    equity_rally: ScenarioImpact;
    usd_depreciation: ScenarioImpact;
    usd_appreciation: ScenarioImpact;
  };
}

export function ScenarioCards({ scenarios }: ScenarioCardsProps) {
  const displayScenarios = [
    { key: 'rate_cut', scenario: scenarios.rate_cut, label: 'Rate Cut' },
    { key: 'equity_crash', scenario: scenarios.equity_crash, label: 'Market Correction' },
    { key: 'usd_depreciation', scenario: scenarios.usd_depreciation, label: 'USD Weakness' },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
        Stress Scenarios
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        Estimated portfolio impact under adverse conditions
      </p>
      <div className="grid gap-3">
        {displayScenarios.map(({ key, scenario, label }) => {
          const isPositive = scenario.impact_percent >= 0;
          return (
            <div
              key={key}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {scenario.scenario_name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p
                    className={`text-sm font-semibold ${
                      isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {scenario.impact_percent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-400">
                    {isPositive ? '+' : ''}€{scenario.impact_eur.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
        These projections are based on historical correlations and simplified models. 
        Actual market behavior may differ significantly. This is not investment advice.
      </p>
    </div>
  );
}
