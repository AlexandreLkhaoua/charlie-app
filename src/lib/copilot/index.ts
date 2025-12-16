// Export all copilot utilities
export { COPILOT_SCHEMA, validateCopilotResponse } from './schema';
export type { CopilotStructuredResponse, CopilotKeyNumber, CopilotAction } from './schema';
export { COPILOT_SYSTEM_PROMPT, buildUserContext, buildSystemPromptWithProfile } from './systemPrompt';
