/**
 * OnboardingBanner Component
 * ---------------------------
 * Gentle banner that appears at the top when onboarding is incomplete.
 * Can be dismissed or clicked to open the full onboarding modal.
 */

'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getProfileOnboardingState } from '@/lib/supabase/actions';

interface OnboardingBannerProps {
  userId: string;
  onStartOnboarding: () => void;
}

const BANNER_DISMISSED_KEY = 'charlie_onboarding_banner_dismissed';

export function OnboardingBanner({ userId, onStartOnboarding }: OnboardingBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      console.log('[Banner] Checking onboarding for user:', userId);
      
      // Check if banner was dismissed this session
      const dismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY);
      if (dismissed) {
        console.log('[Banner] Banner was dismissed');
        setIsDismissed(true);
        return;
      }

      // Check onboarding status
      const state = await getProfileOnboardingState(userId);
      console.log('[Banner] Onboarding state:', state);
      
      // Show banner only if onboarding is incomplete
      if (state.status === 'incomplete') {
        console.log('[Banner] Showing banner');
        setIsVisible(true);
      } else {
        console.log('[Banner] Onboarding complete, not showing banner');
      }
    };

    checkOnboardingStatus();
  }, [userId]);

  const handleDismiss = () => {
    sessionStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleStartOnboarding = () => {
    setIsVisible(false);
    onStartOnboarding();
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
              <span className="text-lg">✨</span>
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-medium">
                Want clear answers that fit your goals?
              </p>
              <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                Answer 3 quick questions to personalize your experience
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartOnboarding}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Get Started
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
