'use client';

import { PortfolioProfile } from '@/types';
import { usePortfolioContext } from '@/components/providers/PortfolioProvider';

const profileLabels: Record<PortfolioProfile, string> = {
  prudent: 'Conservative',
  balanced: 'Balanced',
  aggressive: 'Growth',
};

export function Topbar() {
  const { profile, setProfile, isLoading } = usePortfolioContext();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
      {/* Mobile: Logo */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
          <span className="text-white font-bold text-xs">PC</span>
        </div>
        <span className="text-sm font-semibold text-slate-900">Copilot</span>
      </div>
      
      {/* Desktop: Empty (title in sidebar) */}
      <div className="hidden md:block" />
      
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2">
          <label htmlFor="portfolio-select" className="hidden md:block text-sm text-slate-500">
            Portfolio:
          </label>
          <select
            id="portfolio-select"
            title="Select portfolio profile"
            value={profile}
            onChange={(e) => setProfile(e.target.value as PortfolioProfile)}
            disabled={isLoading}
            className="rounded-md border border-slate-300 px-2 md:px-3 py-1.5 text-sm bg-white focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {Object.entries(profileLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <span className="hidden md:inline text-[10px] text-slate-400 font-medium uppercase tracking-wide px-2 py-1 bg-slate-100 rounded">
          Demo
        </span>
      </div>
    </header>
  );
}
