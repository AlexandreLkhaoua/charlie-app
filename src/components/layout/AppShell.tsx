import { ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { Topbar } from './Topbar';
import { BottomTabBar } from './BottomTabBar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 flex">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <SidebarNav />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="max-w-6xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
        <footer className="hidden md:block px-6 py-3 bg-white/80 backdrop-blur border-t border-slate-200">
          <p className="text-[11px] text-slate-500 text-center">
            For educational purposes only. Not investment advice. Demo data is simulated.
          </p>
        </footer>
      </div>
      
      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
}
