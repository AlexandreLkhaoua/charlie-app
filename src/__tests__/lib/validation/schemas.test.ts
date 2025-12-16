import { describe, it, expect } from 'vitest';
import {
  keyNumberSchema,
  actionSchema,
  copilotResponseSchema,
  chatMessageSchema,
  positionSchema,
  portfolioSchema,
  riskProfileSchema,
  userProfileSchema,
  chatRequestSchema,
  apiErrorSchema,
  validateCopilotResponse,
  safeParseCopilotResponse,
  validateChatMessage,
  validatePosition,
  validatePortfolio,
} from '@/lib/validation/schemas';

describe('keyNumberSchema', () => {
  it('should validate a valid key number', () => {
    const validKeyNumber = {
      label: 'Concentration top 1',
      value: '18.5%',
      unit: 'du portefeuille',
      evidence: 'Calculé sur les positions actuelles',
    };
    expect(() => keyNumberSchema.parse(validKeyNumber)).not.toThrow();
  });

  it('should reject empty label', () => {
    const invalid = {
      label: '',
      value: '18.5%',
      unit: 'du portefeuille',
      evidence: 'Source',
    };
    expect(() => keyNumberSchema.parse(invalid)).toThrow();
  });

  it('should reject empty value', () => {
    const invalid = {
      label: 'Test',
      value: '',
      unit: 'du portefeuille',
      evidence: 'Source',
    };
    expect(() => keyNumberSchema.parse(invalid)).toThrow();
  });
});

describe('actionSchema', () => {
  it('should validate a valid action', () => {
    const validAction = {
      action: "Réduire l'exposition tech",
      why: 'La concentration est trop élevée',
      tradeoff: 'Risque de manquer la reprise du secteur',
    };
    expect(() => actionSchema.parse(validAction)).not.toThrow();
  });

  it('should reject empty action', () => {
    const invalid = {
      action: '',
      why: 'Raison',
      tradeoff: 'Risque',
    };
    expect(() => actionSchema.parse(invalid)).toThrow();
  });
});

describe('copilotResponseSchema', () => {
  const validResponse = {
    summary: 'Votre portefeuille est bien diversifié avec une allocation équilibrée.',
    key_numbers: [
      { label: 'Volatilité', value: '12.5%', unit: 'annualisée', evidence: 'Historique 1 an' },
      { label: 'Sharpe', value: '1.2', unit: 'ratio', evidence: 'Sans risque: 3%' },
      { label: 'Concentration', value: '15%', unit: 'top holding', evidence: 'Position max' },
    ],
    interpretation: 'Votre portefeuille montre une bonne diversification avec un ratio de Sharpe attractif.',
    possible_actions: [
      { action: 'Rééquilibrer', why: 'Dérive des poids', tradeoff: 'Frais de transaction' },
      { action: 'Augmenter obligations', why: 'Réduire volatilité', tradeoff: 'Rendement potentiel' },
    ],
    missing_data: ['Historique complet'],
    confidence: 'high' as const,
    disclaimers: [
      'Ceci ne constitue pas un conseil financier.',
      'Les performances passées ne préjugent pas des performances futures.',
    ],
  };

  it('should validate a complete valid response', () => {
    expect(() => copilotResponseSchema.parse(validResponse)).not.toThrow();
  });

  it('should reject summary too short', () => {
    const invalid = { ...validResponse, summary: 'Court' };
    expect(() => copilotResponseSchema.parse(invalid)).toThrow();
  });

  it('should reject wrong number of key_numbers', () => {
    const invalid = {
      ...validResponse,
      key_numbers: [validResponse.key_numbers[0]], // Only 1 instead of 3
    };
    expect(() => copilotResponseSchema.parse(invalid)).toThrow();
  });

  it('should reject wrong number of possible_actions', () => {
    const invalid = {
      ...validResponse,
      possible_actions: [validResponse.possible_actions[0]], // Only 1 instead of 2
    };
    expect(() => copilotResponseSchema.parse(invalid)).toThrow();
  });

  it('should reject invalid confidence level', () => {
    const invalid = { ...validResponse, confidence: 'super' };
    expect(() => copilotResponseSchema.parse(invalid)).toThrow();
  });

  it('should reject wrong number of disclaimers', () => {
    const invalid = {
      ...validResponse,
      disclaimers: ['Only one disclaimer'],
    };
    expect(() => copilotResponseSchema.parse(invalid)).toThrow();
  });
});

describe('chatMessageSchema', () => {
  it('should validate user message', () => {
    const message = {
      id: '123',
      role: 'user' as const,
      content: 'Analyse mon portefeuille',
      timestamp: new Date(),
    };
    expect(() => chatMessageSchema.parse(message)).not.toThrow();
  });

  it('should validate assistant message', () => {
    const message = {
      id: '124',
      role: 'assistant' as const,
      content: 'Voici mon analyse...',
      timestamp: '2024-01-15T10:30:00Z',
    };
    expect(() => chatMessageSchema.parse(message)).not.toThrow();
  });

  it('should coerce string to date', () => {
    const message = {
      id: '125',
      role: 'system' as const,
      content: 'System message',
      timestamp: '2024-01-15T10:30:00Z',
    };
    const parsed = chatMessageSchema.parse(message);
    expect(parsed.timestamp).toBeInstanceOf(Date);
  });
});

describe('positionSchema', () => {
  it('should validate a valid position', () => {
    const position = {
      id: 'pos-1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 100,
      avgCost: 150.50,
      currentPrice: 175.25,
      sector: 'Technology',
      assetType: 'stock' as const,
    };
    expect(() => positionSchema.parse(position)).not.toThrow();
  });

  it('should reject negative quantity', () => {
    const invalid = {
      id: 'pos-1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: -10,
      avgCost: 150.50,
      currentPrice: 175.25,
      assetType: 'stock',
    };
    expect(() => positionSchema.parse(invalid)).toThrow();
  });

  it('should reject zero price', () => {
    const invalid = {
      id: 'pos-1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 100,
      avgCost: 0,
      currentPrice: 175.25,
      assetType: 'stock',
    };
    expect(() => positionSchema.parse(invalid)).toThrow();
  });

  it('should reject invalid asset type', () => {
    const invalid = {
      id: 'pos-1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 100,
      avgCost: 150.50,
      currentPrice: 175.25,
      assetType: 'invalid',
    };
    expect(() => positionSchema.parse(invalid)).toThrow();
  });
});

describe('portfolioSchema', () => {
  const validPortfolio = {
    id: 'port-1',
    name: 'Mon Portefeuille',
    positions: [
      {
        id: 'pos-1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 100,
        avgCost: 150.50,
        currentPrice: 175.25,
        assetType: 'stock' as const,
      },
    ],
    totalValue: 17525,
    cashBalance: 5000,
    lastUpdated: new Date(),
  };

  it('should validate a valid portfolio', () => {
    expect(() => portfolioSchema.parse(validPortfolio)).not.toThrow();
  });

  it('should allow empty positions array', () => {
    const emptyPortfolio = { ...validPortfolio, positions: [] };
    expect(() => portfolioSchema.parse(emptyPortfolio)).not.toThrow();
  });

  it('should reject negative totalValue', () => {
    const invalid = { ...validPortfolio, totalValue: -1000 };
    expect(() => portfolioSchema.parse(invalid)).toThrow();
  });
});

describe('riskProfileSchema', () => {
  it('should accept valid risk profiles', () => {
    expect(riskProfileSchema.parse('conservative')).toBe('conservative');
    expect(riskProfileSchema.parse('moderate')).toBe('moderate');
    expect(riskProfileSchema.parse('aggressive')).toBe('aggressive');
  });

  it('should reject invalid risk profile', () => {
    expect(() => riskProfileSchema.parse('risky')).toThrow();
  });
});

describe('userProfileSchema', () => {
  it('should validate a valid user profile', () => {
    const profile = {
      id: 'user-1',
      name: 'Jean Dupont',
      email: 'jean@example.com',
      riskProfile: 'moderate' as const,
      investmentHorizon: 'long' as const,
      goals: ['Retraite', 'Immobilier'],
      preferences: {
        currency: 'EUR',
        locale: 'fr-FR',
        notifications: true,
      },
    };
    expect(() => userProfileSchema.parse(profile)).not.toThrow();
  });

  it('should use defaults for preferences', () => {
    const profile = {
      id: 'user-1',
      name: 'Jean Dupont',
      riskProfile: 'moderate' as const,
      investmentHorizon: 'long' as const,
      goals: [],
      preferences: {},
    };
    const parsed = userProfileSchema.parse(profile);
    expect(parsed.preferences.currency).toBe('EUR');
    expect(parsed.preferences.locale).toBe('fr-FR');
    expect(parsed.preferences.notifications).toBe(true);
  });
});

describe('chatRequestSchema', () => {
  it('should validate a simple request', () => {
    const request = { message: 'Analyse mon portefeuille' };
    expect(() => chatRequestSchema.parse(request)).not.toThrow();
  });

  it('should reject empty message', () => {
    const request = { message: '' };
    expect(() => chatRequestSchema.parse(request)).toThrow();
  });

  it('should reject too long message', () => {
    const request = { message: 'a'.repeat(2001) };
    expect(() => chatRequestSchema.parse(request)).toThrow();
  });
});

describe('apiErrorSchema', () => {
  it('should validate a simple error', () => {
    const error = { error: 'Something went wrong' };
    expect(() => apiErrorSchema.parse(error)).not.toThrow();
  });

  it('should validate error with code and details', () => {
    const error = {
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: { field: 'email', issue: 'invalid format' },
    };
    expect(() => apiErrorSchema.parse(error)).not.toThrow();
  });
});

describe('Validation helpers', () => {
  const validCopilotResponse = {
    summary: 'Votre portefeuille est bien diversifié avec une allocation équilibrée.',
    key_numbers: [
      { label: 'Volatilité', value: '12.5%', unit: 'annualisée', evidence: 'Historique 1 an' },
      { label: 'Sharpe', value: '1.2', unit: 'ratio', evidence: 'Sans risque: 3%' },
      { label: 'Concentration', value: '15%', unit: 'top holding', evidence: 'Position max' },
    ],
    interpretation: 'Votre portefeuille montre une bonne diversification.',
    possible_actions: [
      { action: 'Rééquilibrer', why: 'Dérive des poids', tradeoff: 'Frais de transaction' },
      { action: 'Augmenter obligations', why: 'Réduire volatilité', tradeoff: 'Rendement potentiel' },
    ],
    missing_data: [],
    confidence: 'high' as const,
    disclaimers: ['Pas un conseil.', 'Performance passée non garantie.'],
  };

  it('validateCopilotResponse should return parsed data', () => {
    const result = validateCopilotResponse(validCopilotResponse);
    expect(result.confidence).toBe('high');
  });

  it('validateCopilotResponse should throw on invalid data', () => {
    expect(() => validateCopilotResponse({})).toThrow();
  });

  it('safeParseCopilotResponse should return success on valid data', () => {
    const result = safeParseCopilotResponse(validCopilotResponse);
    expect(result.success).toBe(true);
  });

  it('safeParseCopilotResponse should return error on invalid data', () => {
    const result = safeParseCopilotResponse({});
    expect(result.success).toBe(false);
  });

  it('validateChatMessage should parse valid message', () => {
    const message = {
      id: '1',
      role: 'user',
      content: 'Hello',
      timestamp: new Date(),
    };
    expect(() => validateChatMessage(message)).not.toThrow();
  });

  it('validatePosition should parse valid position', () => {
    const position = {
      id: 'pos-1',
      symbol: 'AAPL',
      name: 'Apple',
      quantity: 10,
      avgCost: 100,
      currentPrice: 150,
      assetType: 'stock',
    };
    expect(() => validatePosition(position)).not.toThrow();
  });

  it('validatePortfolio should parse valid portfolio', () => {
    const portfolio = {
      id: 'port-1',
      name: 'Test',
      positions: [],
      totalValue: 0,
      cashBalance: 0,
      lastUpdated: new Date(),
    };
    expect(() => validatePortfolio(portfolio)).not.toThrow();
  });
});
