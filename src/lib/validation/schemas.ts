import { z } from 'zod';

/**
 * Copilot Structured Output Schema avec Zod
 * Validation type-safe pour les réponses structurées
 */

// ============================================
// Key Number Schema
// ============================================

export const keyNumberSchema = z.object({
  label: z.string().min(1).describe('Nom du métrique (ex: "Concentration top 1")'),
  value: z.string().min(1).describe('Valeur formatée (ex: "18.5%", "€46,250")'),
  unit: z.string().describe('Unité ou contexte court (ex: "du portefeuille", "de P&L")'),
  evidence: z.string().describe('Source ou explication de ce chiffre'),
});

export type KeyNumber = z.infer<typeof keyNumberSchema>;

// ============================================
// Action Schema
// ============================================

export const actionSchema = z.object({
  action: z.string().min(1).describe('Description de la piste (ex: "Réduire l\'exposition tech")'),
  why: z.string().min(1).describe('Justification basée sur les données'),
  tradeoff: z.string().describe('Contrepartie ou risque de cette action'),
});

export type Action = z.infer<typeof actionSchema>;

// ============================================
// Copilot Response Schema
// ============================================

export const copilotResponseSchema = z.object({
  summary: z
    .string()
    .min(10)
    .max(500)
    .describe('Résumé concis en 2 phrases maximum de la réponse principale'),
  
  key_numbers: z
    .tuple([keyNumberSchema, keyNumberSchema, keyNumberSchema])
    .describe('Exactement 3 chiffres clés tirés des données du portefeuille'),
  
  interpretation: z
    .string()
    .min(20)
    .max(1000)
    .describe("Explication détaillée de ce que ces chiffres signifient pour l'investisseur"),
  
  possible_actions: z
    .tuple([actionSchema, actionSchema])
    .describe('Exactement 2 pistes de réflexion (pas de recommandations)'),
  
  missing_data: z
    .array(z.string())
    .max(5)
    .describe('Liste des données manquantes qui amélioreraient la réponse'),
  
  confidence: z
    .enum(['low', 'medium', 'high'])
    .describe('Niveau de confiance de la réponse'),
  
  disclaimers: z
    .tuple([z.string(), z.string()])
    .describe('Exactement 2 avertissements réglementaires'),
});

export type CopilotResponse = z.infer<typeof copilotResponseSchema>;

// ============================================
// Chat Message Schemas
// ============================================

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.coerce.date(),
  structured: copilotResponseSchema.optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

// ============================================
// Portfolio Schemas
// ============================================

export const positionSchema = z.object({
  id: z.string(),
  symbol: z.string().min(1).max(10),
  name: z.string().min(1),
  quantity: z.number().positive(),
  avgCost: z.number().positive(),
  currentPrice: z.number().positive(),
  sector: z.string().optional(),
  assetType: z.enum(['stock', 'etf', 'bond', 'crypto', 'cash', 'other']),
});

export type Position = z.infer<typeof positionSchema>;

export const portfolioSchema = z.object({
  id: z.string(),
  name: z.string(),
  positions: z.array(positionSchema),
  totalValue: z.number().nonnegative(),
  cashBalance: z.number().nonnegative(),
  lastUpdated: z.coerce.date(),
});

export type Portfolio = z.infer<typeof portfolioSchema>;

// ============================================
// User Profile Schemas
// ============================================

export const riskProfileSchema = z.enum(['conservative', 'moderate', 'aggressive']);
export type RiskProfile = z.infer<typeof riskProfileSchema>;

export const investmentHorizonSchema = z.enum(['short', 'medium', 'long']);
export type InvestmentHorizon = z.infer<typeof investmentHorizonSchema>;

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  riskProfile: riskProfileSchema,
  investmentHorizon: investmentHorizonSchema,
  goals: z.array(z.string()),
  preferences: z.object({
    currency: z.string().default('EUR'),
    locale: z.string().default('fr-FR'),
    notifications: z.boolean().default(true),
  }),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// ============================================
// API Request/Response Schemas
// ============================================

export const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
  context: z.object({
    portfolioId: z.string().optional(),
    includeHistory: z.boolean().default(true),
  }).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const apiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

// ============================================
// Validation Helpers
// ============================================

export function validateCopilotResponse(data: unknown): CopilotResponse {
  return copilotResponseSchema.parse(data);
}

export function safeParseCopilotResponse(data: unknown) {
  return copilotResponseSchema.safeParse(data);
}

export function validateChatMessage(data: unknown): ChatMessage {
  return chatMessageSchema.parse(data);
}

export function validatePosition(data: unknown): Position {
  return positionSchema.parse(data);
}

export function validatePortfolio(data: unknown): Portfolio {
  return portfolioSchema.parse(data);
}

// ============================================
// JSON Schema Export (for OpenAI)
// ============================================

import { zodToJsonSchema } from 'zod-to-json-schema';

export const COPILOT_JSON_SCHEMA = {
  name: 'copilot_response',
  strict: true,
  schema: zodToJsonSchema(copilotResponseSchema, {
    name: 'CopilotResponse',
    $refStrategy: 'none',
  }),
};
