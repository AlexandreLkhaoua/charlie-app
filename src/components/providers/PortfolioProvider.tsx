'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PortfolioProfile } from '@/types';
import { getStoredProfile, setStoredProfile } from '@/lib/dataProvider';

interface PortfolioContextType {
  profile: PortfolioProfile;
  setProfile: (profile: PortfolioProfile) => void;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<PortfolioProfile>('balanced');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = getStoredProfile();
    setProfileState(stored);
    setIsLoading(false);
  }, []);

  const setProfile = (newProfile: PortfolioProfile) => {
    setProfileState(newProfile);
    setStoredProfile(newProfile);
  };

  return (
    <PortfolioContext.Provider value={{ profile, setProfile, isLoading }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioContext must be used within PortfolioProvider');
  }
  return context;
}
