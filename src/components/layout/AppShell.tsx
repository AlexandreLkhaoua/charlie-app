import { ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { Topbar } from './Topbar';
import { BottomTabBar } from './BottomTabBar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <SidebarNav />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
        <footer className="hidden md:block px-6 py-3 bg-white border-t border-slate-200">
          <p className="text-[11px] text-slate-400 text-center">
            For educational purposes only. Not investment advice. Demo data is simulated.
          </p>
        </footer>
      </div>
      
      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
}
