/**
 * OnboardingModal Component
 * --------------------------
 * Client component that displays onboarding questions 10s after page load
 * if the user hasn't completed onboarding or is due for a reminder.
 */

'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { completeOnboarding, getProfileOnboardingState } from '@/lib/supabase/actions';
import type { OnboardingAnswers } from '@/lib/validation/schemas';

interface OnboardingModalProps {
  userId: string;
  /** Force show the modal (used when triggered from banner) */
  forceShow?: boolean;
  /** Callback when modal is closed */
  onClose?: () => void;
  /** @internal For testing only - overrides the default 10s delay */
  _testDelay?: number;
}

const SHOW_DELAY_MS = 2000; // 2 seconds for testing (originally 10 seconds)
const REMINDER_INTERVAL = 2; // Show reminder every 2 logins

export function OnboardingModal({ userId, forceShow, onClose, _testDelay }: OnboardingModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const queryClient = useQueryClient();

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
        // Invalidate query to update banner and other components
        queryClient.invalidateQueries({ queryKey: ['onboarding-state', userId] });
        setShowSuccess(true);
        // Close after showing success message
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        console.error('[Onboarding] Error:', result.error);
      }
    },
  });

  // Show modal if forceShow is true
  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
    }
  }, [forceShow]);

  // Check if should show modal automatically
  useEffect(() => {
    if (forceShow || !onboardingState || !userId) return;

    const { status, login_count } = onboardingState;

    // Don't show if completed (unless reminder is due)
    const isCompleted = status === 'complete';
    const shouldShowReminder = isCompleted && login_count > 0 && login_count % REMINDER_INTERVAL === 0;

    if (!isCompleted || shouldShowReminder) {
      // Show modal after delay
      const delay = _testDelay !== undefined ? _testDelay : SHOW_DELAY_MS;
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [onboardingState, userId, forceShow, _testDelay]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleSubmit = () => {
    if (isFormComplete) {
      saveMutation.mutate(answers as OnboardingAnswers);
    }
  };

  const isFormComplete =
    answers.goal && answers.horizon && answers.drawdown_reaction;

  if (!isVisible) return null;

  // Success state
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md">
        <Card data-testid="onboarding-success" className="relative w-full max-w-md p-8 shadow-2xl text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              All done!
            </h2>
            <p className="text-muted-foreground">
              Let&apos;s dig into your invests
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md">
      <Card data-testid="onboarding-modal" className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        {/* Close button */}
        <button
          data-testid="onboarding-close"
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Welcome to Charlie
          </h2>
          <p className="text-muted-foreground">
            Help us personalize your experience by answering 3 quick questions.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {/* Question 1: Objectif */}
          <div>
            <h3 className="font-medium mb-3">
              What is your primary goal?
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={answers.goal === 'growth' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, goal: 'growth' })}
                className="h-auto py-3"
              >
                Growth
              </Button>
              <Button
                variant={answers.goal === 'income' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, goal: 'income' })}
                className="h-auto py-3"
              >
                Income
              </Button>
              <Button
                variant={answers.goal === 'preservation' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, goal: 'preservation' })}
                className="h-auto py-3"
              >
                Preservation
              </Button>
            </div>
          </div>

          {/* Question 2: Horizon */}
          <div>
            <h3 className="font-medium mb-3">
              What is your investment horizon?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={answers.horizon === '<1year' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, horizon: '<1year' })}
                className="h-auto py-3"
              >
                {'<1 year'}
              </Button>
              <Button
                variant={answers.horizon === '1-3years' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, horizon: '1-3years' })}
                className="h-auto py-3"
              >
                1–3 years
              </Button>
              <Button
                variant={answers.horizon === '3-7years' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, horizon: '3-7years' })}
                className="h-auto py-3"
              >
                3–7 years
              </Button>
              <Button
                variant={answers.horizon === '7+years' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, horizon: '7+years' })}
                className="h-auto py-3"
              >
                7+ years
              </Button>
            </div>
          </div>

          {/* Question 3: Drawdown reaction */}
          <div>
            <h3 className="font-medium mb-3">
              If your portfolio drops -20% in 1 month, what do you do?
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={answers.drawdown_reaction === 'sell' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, drawdown_reaction: 'sell' })}
                className="h-auto py-3"
              >
                I sell
              </Button>
              <Button
                variant={answers.drawdown_reaction === 'wait' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, drawdown_reaction: 'wait' })}
                className="h-auto py-3"
              >
                I wait
              </Button>
              <Button
                variant={answers.drawdown_reaction === 'buy' ? 'default' : 'outline'}
                onClick={() => setAnswers({ ...answers, drawdown_reaction: 'buy' })}
                className="h-auto py-3"
              >
                I buy a bit
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            data-testid="onboarding-snooze"
            onClick={handleClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Later
          </button>
          <Button
            data-testid="onboarding-submit"
            onClick={handleSubmit}
            disabled={!isFormComplete || saveMutation.isPending}
            size="lg"
          >
            {saveMutation.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
