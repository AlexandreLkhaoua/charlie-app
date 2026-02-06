/**
 * OnboardingWrapper Component
 * ----------------------------
 * Client wrapper that mounts the OnboardingModal and OnboardingBanner.
 * Handles login count increment and user detection.
 * Only activates on non-demo pages.
 */

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { OnboardingModal } from './OnboardingModal';
import { OnboardingBanner } from './OnboardingBanner';
import { incrementLoginCount } from '@/lib/supabase/actions';
import { createClient } from '@/lib/supabase/client';

const LOGIN_TRACKED_KEY = 'charlie_login_tracked';

export function OnboardingWrapper() {
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  // Don't show on demo pages, auth, or landing
  const shouldShow =
    pathname &&
    !pathname.startsWith('/demo') &&
    !pathname.startsWith('/auth') &&
    pathname !== '/';

  useEffect(() => {
    if (!shouldShow) return;

    // Get current user and track login
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Track login only once per session
        const tracked = sessionStorage.getItem(LOGIN_TRACKED_KEY);
        if (!tracked) {
          await incrementLoginCount(user.id);
          sessionStorage.setItem(LOGIN_TRACKED_KEY, 'true');
        }
      }
    };

    initAuth();
  }, [supabase, shouldShow]);

  if (!shouldShow || !userId) return null;

  return (
    <>
      <OnboardingBanner 
        userId={userId} 
        onStartOnboarding={() => setShowModal(true)} 
      />
      <OnboardingModal 
        userId={userId} 
        forceShow={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
