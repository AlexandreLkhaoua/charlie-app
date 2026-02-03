'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';
import { 
  UserProfile, 
  getProfile as getLocalProfile, 
  getPersonalizationContext,
} from '@/lib/profile/profileStore';

interface ProfileContextType {
  profile: UserProfile | null;
  isLoaded: boolean;
  isAuthenticated: boolean;
  saveProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetProfile: () => Promise<void>;
  getPersonalizationContext: () => string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  // Load profile on mount
  useEffect(() => {
    loadProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setIsAuthenticated(false);
        setIsLoaded(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // User not authenticated - load from localStorage for demo mode
        const localProfile = getLocalProfile();
        setProfile(localProfile);
        setIsAuthenticated(false);
        setIsLoaded(true);
        return;
      }

      // User authenticated - load from database
      const { data: dbProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single<Database['public']['Tables']['profiles']['Row']>();

      if (error) {
        console.error('Failed to load profile from database:', error);
        // Fallback to localStorage if DB fails
        const localProfile = getLocalProfile();
        setProfile(localProfile);
      } else {
        // Map database columns to UserProfile interface
        const userProfile: UserProfile = {
          displayName: dbProfile.display_name || '',
          investingExperience: (dbProfile.investing_experience as UserProfile['investingExperience']) || 'intermediate',
          preferredLanguage: (dbProfile.preferred_language as UserProfile['preferredLanguage']) || 'EN',
          investmentHorizon: (dbProfile.investment_horizon as UserProfile['investmentHorizon']) || '3-7y',
          riskComfort: (dbProfile.risk_comfort as UserProfile['riskComfort']) || 'medium',
          goals: (dbProfile.goals as UserProfile['goals']) || ['balanced'],
          answerStyle: (dbProfile.answer_style as UserProfile['answerStyle']) || 'standard',
          contentPriority: (dbProfile.content_priority as UserProfile['contentPriority']) || 'risk',
          avoidJargon: dbProfile.avoid_jargon ?? true,
          createdAt: dbProfile.created_at,
          updatedAt: dbProfile.updated_at,
        };
        setProfile(userProfile);
      }

      setIsAuthenticated(true);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading profile:', error);
      const localProfile = getLocalProfile();
      setProfile(localProfile);
      setIsAuthenticated(false);
      setIsLoaded(true);
    }
  };

  const saveProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not authenticated - save to localStorage
        const localProfile = getLocalProfile();
        const updated = { ...localProfile, ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem('charlie_user_profile', JSON.stringify(updated));
        setProfile(updated);
        return;
      }

      // Authenticated - save to database
      type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
      const dbUpdates: ProfileUpdate = {
        updated_at: new Date().toISOString(),
      };
      
      if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
      if (updates.investingExperience !== undefined) dbUpdates.investing_experience = updates.investingExperience;
      if (updates.preferredLanguage !== undefined) dbUpdates.preferred_language = updates.preferredLanguage;
      if (updates.investmentHorizon !== undefined) dbUpdates.investment_horizon = updates.investmentHorizon;
      if (updates.riskComfort !== undefined) dbUpdates.risk_comfort = updates.riskComfort;
      if (updates.goals !== undefined) dbUpdates.goals = updates.goals;
      if (updates.answerStyle !== undefined) dbUpdates.answer_style = updates.answerStyle;
      if (updates.contentPriority !== undefined) dbUpdates.content_priority = updates.contentPriority;
      if (updates.avoidJargon !== undefined) dbUpdates.avoid_jargon = updates.avoidJargon;

      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase type inference issue
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) {
        console.error('Failed to update profile:', error);
        throw error;
      }

      // Reload profile after update
      await loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }, [supabase]);

  const resetProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not authenticated - reset localStorage
        localStorage.removeItem('charlie_user_profile');
        const fresh = getLocalProfile();
        setProfile(fresh);
        return;
      }

      // Authenticated - reset in database
      type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
      const defaultValues: ProfileUpdate = {
        investing_experience: 'intermediate',
        preferred_language: 'EN',
        investment_horizon: '3-7y',
        risk_comfort: 'medium',
        goals: ['balanced'],
        answer_style: 'standard',
        content_priority: 'risk',
        avoid_jargon: true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error - Supabase type inference issue
        .update(defaultValues)
        .eq('id', user.id);

      if (error) {
        console.error('Failed to reset profile:', error);
        throw error;
      }

      await loadProfile();
    } catch (error) {
      console.error('Error resetting profile:', error);
      throw error;
    }
  }, [supabase]);

  const getContext = useCallback(() => {
    if (!profile) return '';
    return getPersonalizationContext(profile);
  }, [profile]);

  // Show loading state
  if (!isLoaded) {
    return null;
  }

  return (
    <ProfileContext.Provider 
      value={{ 
        profile, 
        isLoaded,
        isAuthenticated,
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
