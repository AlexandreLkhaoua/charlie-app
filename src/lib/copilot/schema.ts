/**
 * Copilot Structured Output Schema
 * JSON Schema strict pour forcer des réponses structurées depuis OpenAI
 */

// Types TypeScript correspondant au schema
export interface CopilotKeyNumber {
  label: string;
  value: string;
  unit: string;
  evidence: string;
}

export interface CopilotAction {
  action: string;
  why: string;
  tradeoff: string;
}

export interface CopilotStructuredResponse {
  summary: string;
  key_numbers: [CopilotKeyNumber, CopilotKeyNumber, CopilotKeyNumber]; // Exactly 3
  interpretation: string;
  possible_actions: [CopilotAction, CopilotAction]; // Exactly 2
  missing_data: string[];
  confidence: 'low' | 'medium' | 'high';
  disclaimers: [string, string]; // Exactly 2
}

// JSON Schema pour OpenAI Structured Outputs
export const COPILOT_SCHEMA = {
  name: 'copilot_response',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      summary: {
        type: 'string',
        description: 'Résumé concis en 2 phrases maximum de la réponse principale',
      },
      key_numbers: {
        type: 'array',
        description: 'Exactement 3 chiffres clés tirés des données du portefeuille',
        items: {
          type: 'object',
          properties: {
            label: {
              type: 'string',
              description: 'Nom du métrique (ex: "Concentration top 1")',
            },
            value: {
              type: 'string',
              description: 'Valeur formatée (ex: "18.5%", "€46,250")',
            },
            unit: {
              type: 'string',
              description: 'Unité ou contexte court (ex: "du portefeuille", "de P&L")',
            },
            evidence: {
              type: 'string',
              description: 'Source ou explication de ce chiffre',
            },
          },
          required: ['label', 'value', 'unit', 'evidence'],
          additionalProperties: false,
        },
        minItems: 3,
        maxItems: 3,
      },
      interpretation: {
        type: 'string',
        description: 'Explication détaillée de ce que ces chiffres signifient pour l\'investisseur, en 2-5 phrases',
      },
      possible_actions: {
        type: 'array',
        description: 'Exactement 2 pistes de réflexion (pas de recommandations d\'achat/vente)',
        items: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              description: 'Description de l\'action ou réflexion suggérée',
            },
            why: {
              type: 'string',
              description: 'Pourquoi cette piste est pertinente',
            },
            tradeoff: {
              type: 'string',
              description: 'Contrepartie ou point d\'attention',
            },
          },
          required: ['action', 'why', 'tradeoff'],
          additionalProperties: false,
        },
        minItems: 2,
        maxItems: 2,
      },
      missing_data: {
        type: 'array',
        description: 'Liste des informations manquantes pour une analyse plus complète',
        items: {
          type: 'string',
        },
      },
      confidence: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        description: 'Niveau de confiance dans l\'analyse basé sur les données disponibles',
      },
      disclaimers: {
        type: 'array',
        description: 'Exactement 2 avertissements légaux/prudentiels',
        items: {
          type: 'string',
        },
        minItems: 2,
        maxItems: 2,
      },
    },
    required: [
      'summary',
      'key_numbers',
      'interpretation',
      'possible_actions',
      'missing_data',
      'confidence',
      'disclaimers',
    ],
    additionalProperties: false,
  },
} as const;

// Validation helper
export function validateCopilotResponse(data: unknown): data is CopilotStructuredResponse {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as Record<string, unknown>;
  
  // Check required fields
  if (typeof obj.summary !== 'string') return false;
  if (!Array.isArray(obj.key_numbers) || obj.key_numbers.length !== 3) return false;
  if (typeof obj.interpretation !== 'string') return false;
  if (!Array.isArray(obj.possible_actions) || obj.possible_actions.length !== 2) return false;
  if (!Array.isArray(obj.missing_data)) return false;
  if (!['low', 'medium', 'high'].includes(obj.confidence as string)) return false;
  if (!Array.isArray(obj.disclaimers) || obj.disclaimers.length !== 2) return false;
  
  // Validate key_numbers structure
  for (const kn of obj.key_numbers) {
    if (!kn || typeof kn !== 'object') return false;
    const knObj = kn as Record<string, unknown>;
    if (typeof knObj.label !== 'string' || typeof knObj.value !== 'string' ||
        typeof knObj.unit !== 'string' || typeof knObj.evidence !== 'string') return false;
  }
  
  // Validate possible_actions structure
  for (const pa of obj.possible_actions) {
    if (!pa || typeof pa !== 'object') return false;
    const paObj = pa as Record<string, unknown>;
    if (typeof paObj.action !== 'string' || typeof paObj.why !== 'string' ||
        typeof paObj.tradeoff !== 'string') return false;
  }
  
  return true;
}
