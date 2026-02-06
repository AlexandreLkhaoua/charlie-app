'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortfolioProfile } from '@/types';
import { usePortfolioContext } from '@/components/providers/PortfolioProvider';
import { useProfile } from '@/components/providers/ProfileProvider';
import { createClient } from '@/lib/supabase/client';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const profileLabels: Record<PortfolioProfile, string> = {
  prudent: 'Conservative',
  balanced: 'Balanced',
  aggressive: 'Growth',
};

export function Topbar() {
  const { profile, setProfile, isLoading } = usePortfolioContext();
  const { profile: userProfile, isAuthenticated, userEmail } = useProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="h-14 px-4 flex items-center justify-between">
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
            <label htmlFor="portfolio-select" className="hidden md:block text-sm text-slate-600">
              Portfolio:
            </label>
            <select
              id="portfolio-select"
              title="Select portfolio profile"
              value={profile}
              onChange={(e) => setProfile(e.target.value as PortfolioProfile)}
              disabled={isLoading}
              className="rounded-md border border-slate-200 px-2 md:px-3 py-1.5 text-sm text-slate-900 bg-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              {Object.entries(profileLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {!isAuthenticated && (
            <span className="hidden md:inline text-[10px] text-slate-400 font-medium uppercase tracking-wide px-2 py-1 bg-slate-100 rounded">
              Demo
            </span>
          )}

          {isAuthenticated && userProfile && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-3 py-1.5 transition-colors duration-200">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="text-slate-900 text-xs font-medium">
                    {userProfile?.displayName && userProfile.displayName.length > 0
                      ? userProfile.displayName.charAt(0).toUpperCase()
                      : '?'}
                  </span>
                </div>
                <span className="hidden md:inline text-sm text-slate-900 font-medium">
                  {userEmail || userProfile?.displayName || 'User'}
                </span>
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[220px] bg-white rounded-lg shadow-lg border border-slate-200 p-1 z-50"
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded hover:bg-slate-50 cursor-pointer outline-none"
                  onSelect={() => router.push('/demo/profile')}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-px bg-slate-200 my-1" />

                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded hover:bg-red-50 cursor-pointer outline-none"
                  onSelect={handleLogout}
                  disabled={isLoggingOut}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          )}
        </div>
      </div>
    </header>
  );
}
