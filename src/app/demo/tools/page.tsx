const tools = [
  {
    title: 'Portfolio Rebalancing',
    description: 'Optimize allocations to target weights while minimizing trades',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    status: 'coming-soon',
  },
  {
    title: 'Tax Optimization',
    description: 'Identify tax-loss harvesting opportunities',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
    status: 'coming-soon',
  },
  {
    title: 'Scenario Builder',
    description: 'Create custom stress tests for your portfolio',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    status: 'coming-soon',
  },
  {
    title: 'Dividend Tracker',
    description: 'Monitor dividend income and ex-dates',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    status: 'coming-soon',
  },
  {
    title: 'Performance Attribution',
    description: 'Analyze returns by sector, factor, and time period',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    status: 'coming-soon',
  },
  {
    title: 'Export Reports',
    description: 'Generate PDF reports for advisors or records',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    status: 'coming-soon',
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-4 pb-4">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Tools</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Advanced portfolio analysis capabilities
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className="bg-white rounded-lg border border-slate-200 p-4 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
              {tool.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-slate-900">{tool.title}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wide flex-shrink-0">
                  Soon
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{tool.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pro Features CTA */}
      <div className="bg-slate-900 rounded-lg p-4 md:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-sm md:text-base font-medium">
              Premium Tools
            </h3>
            <p className="text-xs md:text-sm text-slate-300 mt-0.5">
              Advanced features available with Portfolio Copilot Pro.
            </p>
          </div>
          <button
            disabled
            className="px-4 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg opacity-50 cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
