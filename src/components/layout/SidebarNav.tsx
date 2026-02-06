'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProfile } from '@/components/providers/ProfileProvider';

const navItems = [
  { href: '/demo/dashboard', label: 'Dashboard' },
  { href: '/demo/portfolio', label: 'Portfolio' },
  { href: '/demo/risks', label: 'Risk Analysis' },
  { href: '/demo/news', label: 'Market News' },
  { href: '/demo/chat', label: 'Charlie' },
  { href: '/demo/scenarios', label: 'Scenarios' },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { profile } = useProfile();
  
  // Get initials from display name
  const getInitials = () => {
    if (!profile?.displayName) return 'DU';
    const names = profile.displayName.trim().split(' ').filter(Boolean);
    if (names.length === 0) return 'DU';
    const firstName = names[0] ?? '';
    if (names.length === 1) return firstName.substring(0, 2).toUpperCase();
    const lastName = names[names.length - 1] ?? '';
    return ((firstName[0] ?? '') + (lastName[0] ?? '')).toUpperCase();
  };
  
  const displayName = profile?.displayName || 'Demo User';

  return (
    <aside className="w-64 shrink-0 bg-slate-950 text-slate-100 sticky top-0 h-[100dvh] border-r border-white/10 overflow-y-auto flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="block">
          <span className="text-xl font-semibold tracking-tight text-white">Charlie</span>
          <span className="block text-xs text-slate-400 mt-1 opacity-80">AI Wealth Management</span>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/5 hover:text-white transition-colors duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white ring-1 ring-white/10'
                      : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link href="/demo/profile" className="flex items-center gap-3 hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white">
            {getInitials()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{displayName}</p>
            <p className="text-xs text-slate-400 opacity-80">View profile</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
