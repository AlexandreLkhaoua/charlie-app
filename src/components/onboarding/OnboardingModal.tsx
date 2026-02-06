/**
 * OnboardingModal Component
 * --------------------------
 * Client component that displays onboarding questions 10s after page load
 * if the user hasn't completed onboarding or is due for a reminder.
 */

'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { completeOnboarding, getProfileOnboardingState } from '@/lib/supabase/actions';
import type { OnboardingAnswers } from '@/lib/validation/schemas';

interface OnboardingModalProps {
  userId: string;
  /** @internal For testing only - overrides the default 10s delay */
  _testDelay?: number;
}

const SNOOZE_KEY = 'charlie_onboarding_snooze_until';
const SNOOZE_DAYS = 7;
const SHOW_DELAY_MS = 10_000; // 10 seconds
const REMINDER_INTERVAL = 2; // Show reminder every 2 logins

export function OnboardingModal({ userId, _testDelay }: OnboardingModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});

  // Fetch onboarding state
  const { data: onboardingState } = useQuery({
    queryKey: ['onboarding-state', userId],
    queryFn: () => getProfileOnboardingState(userId),
    enabled: !!userId,
  });

  // Save onboarding mutation
  const saveMutation = useMutation({
    mutationFn: (answers: OnboardingAnswers) => completeOnboarding(userId, answers),
    onSuccess: (result) => {
      if (result.success) {
        setIsVisible(false);
        // Show toast (you can integrate with a toast system here)
        console.log('[Onboarding] Profil enregistré');
      } else {
        console.error('[Onboarding] Error:', result.error);
      }
    },
  });

  // Check if should show modal
  useEffect(() => {
    if (!onboardingState || !userId) return;

    const { status, login_count } = onboardingState;

    // Don't show if completed (unless reminder is due)
    const isCompleted = status === 'complete';
    const shouldShowReminder = isCompleted && login_count > 0 && login_count % REMINDER_INTERVAL === 0;

    if (!isCompleted || shouldShowReminder) {
      // Check localStorage snooze
      const snoozeUntil = localStorage.getItem(SNOOZE_KEY);
      if (snoozeUntil && new Date(snoozeUntil) > new Date()) {
        return; // Still snoozed
      }

      // Show modal after delay
      const delay = _testDelay !== undefined ? _testDelay : SHOW_DELAY_MS;
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [onboardingState, userId]);

  const handleSnooze = () => {
    const snoozeUntil = new Date();
    snoozeUntil.setDate(snoozeUntil.getDate() + SNOOZE_DAYS);
    localStorage.setItem(SNOOZE_KEY, snoozeUntil.toISOString());
    setIsVisible(false);
  };

  const handleSubmit = () => {
    if (isFormComplete) {
      saveMutation.mutate(answers as OnboardingAnswers);
    }
  };

  const isFormComplete =
    answers.goal && answers.horizon && answers.drawdown_reaction;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleSnooze}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Bienvenue sur Charlie
          </h2>
          <p className="text-muted-foreground">
            Aidez-nous à personnaliser votre expérience en répondant à 3 questions rapides.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {/* Question 1: Objectif */}
          <div>
            <h3 className="font-medium mb-3">
              Quel est votre objectif principal ?
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={answers.goal === 'growth' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, goal: 'growth' })}
                className="h-auto py-3"
              >
                Croissance
              </Button>
              <Button
                variant={answers.goal === 'income' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, goal: 'income' })}
                className="h-auto py-3"
              >
                Revenu
              </Button>
              <Button
                variant={answers.goal === 'preservation' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, goal: 'preservation' })}
                className="h-auto py-3"
              >
                Préservation
              </Button>
            </div>
          </div>

          {/* Question 2: Horizon */}
          <div>
            <h3 className="font-medium mb-3">
              Quel est votre horizon de placement ?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={answers.horizon === '<1year' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, horizon: '<1year' })}
                className="h-auto py-3"
              >
                {'<1 an'}
              </Button>
              <Button
                variant={answers.horizon === '1-3years' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, horizon: '1-3years' })}
                className="h-auto py-3"
              >
                1–3 ans
              </Button>
              <Button
                variant={answers.horizon === '3-7years' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, horizon: '3-7years' })}
                className="h-auto py-3"
              >
                3–7 ans
              </Button>
              <Button
                variant={answers.horizon === '7+years' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, horizon: '7+years' })}
                className="h-auto py-3"
              >
                7+ ans
              </Button>
            </div>
          </div>

          {/* Question 3: Drawdown reaction */}
          <div>
            <h3 className="font-medium mb-3">
              Si votre portefeuille baisse de -20% en 1 mois, que faites-vous ?
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={answers.drawdown_reaction === 'sell' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, drawdown_reaction: 'sell' })}
                className="h-auto py-3"
              >
                Je vends
              </Button>
              <Button
                variant={answers.drawdown_reaction === 'wait' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, drawdown_reaction: 'wait' })}
                className="h-auto py-3"
              >
                J&apos;attends
              </Button>
              <Button
                variant={answers.drawdown_reaction === 'buy' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, drawdown_reaction: 'buy' })}
                className="h-auto py-3"
              >
                J&apos;achète un peu
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            onClick={handleSnooze}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Plus tard
          </button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormComplete || saveMutation.isPending}
            size="lg"
          >
            {saveMutation.isPending ? 'Enregistrement...' : 'Continuer'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
