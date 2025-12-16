/**
 * User Profile Store
 * Handles user preferences for ultra-personalization
 * Currently uses localStorage, designed to be replaceable with backend later
 */

export type InvestingExperience = 'beginner' | 'intermediate' | 'advanced';
export type PreferredLanguage = 'EN' | 'FR';
export type InvestmentHorizon = '<1y' | '1-3y' | '3-7y' | '7y+';
export type RiskComfort = 'low' | 'medium' | 'high';
export type InvestmentGoal = 'preserve' | 'grow' | 'income' | 'balanced';
export type AnswerStyle = 'concise' | 'standard' | 'detailed';
export type ContentPriority = 'risk' | 'opportunities' | 'education';

export interface UserProfile {
  displayName: string;
  investingExperience: InvestingExperience;
  preferredLanguage: PreferredLanguage;
  investmentHorizon: InvestmentHorizon;
  riskComfort: RiskComfort;
  goals: InvestmentGoal[];
  answerStyle: AnswerStyle;
  contentPriority: ContentPriority;
  avoidJargon: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'charlie_user_profile';

const DEFAULT_PROFILE: UserProfile = {
  displayName: '',
  investingExperience: 'intermediate',
  preferredLanguage: 'EN',
  investmentHorizon: '3-7y',
  riskComfort: 'medium',
  goals: ['balanced'],
  answerStyle: 'standard',
  contentPriority: 'risk',
  avoidJargon: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Get the current user profile from localStorage
 */
export function getProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return DEFAULT_PROFILE;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
  
  return DEFAULT_PROFILE;
}

/**
 * Save user profile to localStorage
 */
export function saveProfile(profile: Partial<UserProfile>): UserProfile {
  if (typeof window === 'undefined') {
    return DEFAULT_PROFILE;
  }
  
  try {
    const current = getProfile();
    const updated: UserProfile = {
      ...current,
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save profile:', error);
    return getProfile();
  }
}

/**
 * Reset profile to defaults
 */
export function resetProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return DEFAULT_PROFILE;
  }
  
  try {
    const fresh: UserProfile = {
      ...DEFAULT_PROFILE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  } catch (error) {
    console.error('Failed to reset profile:', error);
    return DEFAULT_PROFILE;
  }
}

/**
 * Check if user has completed profile setup
 */
export function hasCompletedProfile(): boolean {
  const profile = getProfile();
  return profile.displayName.length > 0;
}

/**
 * Generate personalization context for Charlie
 */
export function getPersonalizationContext(profile: UserProfile): string {
  const parts: string[] = [];
  
  // Experience level
  const expMap = {
    beginner: 'The user is new to investing. Use simple language, explain concepts, avoid technical jargon.',
    intermediate: 'The user has some investing experience. Balance clarity with appropriate terminology.',
    advanced: 'The user is experienced. You can use technical terms and assume financial literacy.',
  };
  parts.push(expMap[profile.investingExperience]);
  
  // Jargon preference
  if (profile.avoidJargon) {
    parts.push('Avoid financial jargon. If you must use a technical term, briefly explain it.');
  }
  
  // Answer style
  const styleMap = {
    concise: 'Be concise and direct. Lead with the key insight, keep explanations brief.',
    standard: 'Provide balanced responses with clear explanations.',
    detailed: 'Provide comprehensive explanations with context and examples.',
  };
  parts.push(styleMap[profile.answerStyle]);
  
  // Content priority
  const priorityMap = {
    risk: 'Prioritize risk-related information and potential downsides.',
    opportunities: 'Focus on opportunities and potential upsides.',
    education: 'Take an educational approach, helping the user learn.',
  };
  parts.push(priorityMap[profile.contentPriority]);
  
  // Investment horizon
  parts.push(`User investment horizon: ${profile.investmentHorizon}. Frame advice accordingly.`);
  
  // Risk comfort
  const riskMap = {
    low: 'User has low risk tolerance. Emphasize stability and capital preservation.',
    medium: 'User has moderate risk tolerance. Balance growth and stability.',
    high: 'User has high risk tolerance. Can discuss higher-risk strategies.',
  };
  parts.push(riskMap[profile.riskComfort]);
  
  // Goals
  if (profile.goals.length > 0) {
    const goalDescriptions = profile.goals.map(g => {
      const map = {
        preserve: 'capital preservation',
        grow: 'wealth growth',
        income: 'income generation',
        balanced: 'balanced approach',
      };
      return map[g];
    });
    parts.push(`User goals: ${goalDescriptions.join(', ')}.`);
  }
  
  // Language
  if (profile.preferredLanguage === 'FR') {
    parts.push('Respond in French.');
  } else {
    parts.push('Respond in English.');
  }
  
  return parts.join(' ');
}
