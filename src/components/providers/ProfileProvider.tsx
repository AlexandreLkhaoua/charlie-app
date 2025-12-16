'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  UserProfile, 
  getProfile, 
  saveProfile as saveProfileToStore, 
  resetProfile as resetProfileInStore,
  getPersonalizationContext,
} from '@/lib/profile/profileStore';

interface ProfileContextType {
  profile: UserProfile;
  isLoaded: boolean;
  saveProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
  getPersonalizationContext: () => string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const loaded = getProfile();
    setProfile(loaded);
    setIsLoaded(true);
  }, []);

  const saveProfile = useCallback((updates: Partial<UserProfile>) => {
    const updated = saveProfileToStore(updates);
    setProfile(updated);
  }, []);

  const resetProfile = useCallback(() => {
    const fresh = resetProfileInStore();
    setProfile(fresh);
  }, []);

  const getContext = useCallback(() => {
    if (!profile) return '';
    return getPersonalizationContext(profile);
  }, [profile]);

  // Don't render children until profile is loaded
  if (!isLoaded || !profile) {
    return null;
  }

  return (
    <ProfileContext.Provider 
      value={{ 
        profile, 
        isLoaded,
        saveProfile, 
        resetProfile,
        getPersonalizationContext: getContext,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
