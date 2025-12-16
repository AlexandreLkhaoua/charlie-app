import { AnalyticsOutput } from './analytics';
import { NewsItem } from './news';
import { Portfolio } from './portfolio';
import { CopilotStructuredResponse } from '@/lib/copilot';

// Re-export for convenience
export type { CopilotStructuredResponse };

// Chat message role
export type ChatRole = 'user' | 'assistant' | 'system';

// Legacy structured response (V1.0 - deprecated)
export interface LegacyStructuredOutput {
  tldr?: string;
  bullets?: string[];
  actions?: string[];
  data_points?: {
    label: string;
    value: string;
  }[];
}

// Chat message
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  
  // V1.1 Structured response (from CopilotAnswerCard)
  structured?: CopilotStructuredResponse;
  
  // V1.0 Legacy structured response (deprecated)
  legacyStructured?: LegacyStructuredOutput;
}

// Import UserProfile type for personalization
import type { UserProfile } from '@/lib/profile/profileStore';

// Context provided to chat
export interface ChatContext {
  portfolio?: Portfolio;
  analytics?: AnalyticsOutput;
  selected_news?: NewsItem;
  user_question_type?: 'exposure' | 'risk' | 'scenario' | 'general';
  userProfile?: UserProfile | null;
}

// Chat session
export interface ChatSession {
  id: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
  context?: ChatContext;
}

// Quick prompt suggestion
export interface QuickPrompt {
  id: string;
  text: string;
  category: 'exposure' | 'risk' | 'scenario' | 'general';
  icon?: string;
}
