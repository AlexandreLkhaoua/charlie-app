'use client';

import { ReactNode } from 'react';
import { PortfolioProvider } from '@/components/providers/PortfolioProvider';
import { ProfileProvider } from '@/components/providers/ProfileProvider';
import { AppShell } from '@/components/layout/AppShell';

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <PortfolioProvider>
        <AppShell>{children}</AppShell>
      </PortfolioProvider>
    </ProfileProvider>
  );
}
