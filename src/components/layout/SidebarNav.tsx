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
    const names = profile.displayName.trim().split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };
  
  const displayName = profile?.displayName || 'Demo User';

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="block">
          <span className="text-xl font-semibold tracking-tight">Charlie</span>
          <span className="block text-xs text-slate-400 mt-1">AI Wealth Management</span>
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
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <Link href="/demo/profile" className="flex items-center gap-3 hover:bg-slate-800/50 rounded-lg p-2 -m-2 transition-colors">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium">
            {getInitials()}
          </div>
          <div>
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-slate-400">View profile</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
