import { describe, it, expect } from 'vitest';

// Test that types are exported correctly
describe('Type exports', () => {
  it('should export portfolio types', async () => {
    const types = await import('@/types/portfolio');
    expect(types).toBeDefined();
  });

  it('should export analytics types', async () => {
    const types = await import('@/types/analytics');
    expect(types).toBeDefined();
  });

  it('should export news types', async () => {
    const types = await import('@/types/news');
    expect(types).toBeDefined();
  });

  it('should export chat types', async () => {
    const types = await import('@/types/chat');
    expect(types).toBeDefined();
  });

  it('should re-export all types from index', async () => {
    const allTypes = await import('@/types');
    expect(allTypes).toBeDefined();
  });
});

// Test that lib modules are exported correctly
describe('Lib exports', () => {
  it('should export utils', async () => {
    const utils = await import('@/lib/utils');
    expect(utils.cn).toBeDefined();
    expect(utils.formatCurrency).toBeDefined();
    expect(utils.formatPercent).toBeDefined();
    expect(utils.formatCompactNumber).toBeDefined();
    expect(utils.delay).toBeDefined();
    expect(utils.generateId).toBeDefined();
  });

  it('should export validation schemas', async () => {
    const schemas = await import('@/lib/validation/schemas');
    expect(schemas.copilotResponseSchema).toBeDefined();
    expect(schemas.chatMessageSchema).toBeDefined();
    expect(schemas.positionSchema).toBeDefined();
    expect(schemas.portfolioSchema).toBeDefined();
  });

  it('should export mock data', async () => {
    const mockData = await import('@/lib/mock/data');
    expect(mockData.demoPortfolios).toBeDefined();
    expect(mockData.demoNews).toBeDefined();
  });

  it('should export data provider', async () => {
    const dataProvider = await import('@/lib/dataProvider');
    expect(dataProvider.getStoredProfile).toBeDefined();
    expect(dataProvider.setStoredProfile).toBeDefined();
    expect(dataProvider.PORTFOLIO_PROFILE_KEY).toBeDefined();
  });
});

// Test that components are exported correctly
describe('Component exports', () => {
  it('should export UI components', async () => {
    const button = await import('@/components/ui/button');
    expect(button.Button).toBeDefined();
    
    const card = await import('@/components/ui/card');
    expect(card.Card).toBeDefined();
    expect(card.CardHeader).toBeDefined();
    expect(card.CardContent).toBeDefined();
  });
});
