import { describe, it, expect } from 'vitest';
import { onboardingAnswersSchema } from '@/lib/validation/schemas';

describe('onboardingAnswersSchema', () => {
  it('validates correct onboarding answers', () => {
    const validAnswers = {
      goal: 'growth',
      horizon: '3-7years',
      drawdown_reaction: 'wait',
    };

    const result = onboardingAnswersSchema.safeParse(validAnswers);
    expect(result.success).toBe(true);
  });

  it('rejects invalid goal', () => {
    const invalidAnswers = {
      goal: 'invalid',
      horizon: '3-7years',
      drawdown_reaction: 'wait',
    };

    const result = onboardingAnswersSchema.safeParse(invalidAnswers);
    expect(result.success).toBe(false);
  });

  it('rejects invalid horizon', () => {
    const invalidAnswers = {
      goal: 'growth',
      horizon: 'invalid',
      drawdown_reaction: 'wait',
    };

    const result = onboardingAnswersSchema.safeParse(invalidAnswers);
    expect(result.success).toBe(false);
  });

  it('rejects invalid drawdown_reaction', () => {
    const invalidAnswers = {
      goal: 'growth',
      horizon: '3-7years',
      drawdown_reaction: 'invalid',
    };

    const result = onboardingAnswersSchema.safeParse(invalidAnswers);
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const incompleteAnswers = {
      goal: 'growth',
      horizon: '3-7years',
    };

    const result = onboardingAnswersSchema.safeParse(incompleteAnswers);
    expect(result.success).toBe(false);
  });

  it('validates all goal options', () => {
    const goals = ['growth', 'income', 'preservation'];
    
    goals.forEach((goal) => {
      const answers = {
        goal,
        horizon: '3-7years',
        drawdown_reaction: 'wait',
      };
      const result = onboardingAnswersSchema.safeParse(answers);
      expect(result.success).toBe(true);
    });
  });

  it('validates all horizon options', () => {
    const horizons = ['<1year', '1-3years', '3-7years', '7+years'];
    
    horizons.forEach((horizon) => {
      const answers = {
        goal: 'growth',
        horizon,
        drawdown_reaction: 'wait',
      };
      const result = onboardingAnswersSchema.safeParse(answers);
      expect(result.success).toBe(true);
    });
  });

  it('validates all drawdown_reaction options', () => {
    const reactions = ['sell', 'wait', 'buy'];
    
    reactions.forEach((drawdown_reaction) => {
      const answers = {
        goal: 'growth',
        horizon: '3-7years',
        drawdown_reaction,
      };
      const result = onboardingAnswersSchema.safeParse(answers);
      expect(result.success).toBe(true);
    });
  });
});
