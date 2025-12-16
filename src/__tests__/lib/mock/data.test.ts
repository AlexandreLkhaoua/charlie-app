import { describe, it, expect } from 'vitest';
import { demoPortfolios, demoNews, quickPrompts } from '@/lib/mock/data';

describe('demoPortfolios', () => {
  it('should have all portfolio profiles', () => {
    expect(demoPortfolios.prudent).toBeDefined();
    expect(demoPortfolios.balanced).toBeDefined();
    expect(demoPortfolios.aggressive).toBeDefined();
  });

  it('each portfolio should have required fields', () => {
    Object.values(demoPortfolios).forEach((portfolio) => {
      expect(portfolio.id).toBeDefined();
      expect(portfolio.name).toBeDefined();
      expect(portfolio.profile).toBeDefined();
      expect(portfolio.positions).toBeInstanceOf(Array);
      expect(portfolio.total_value_eur).toBeGreaterThan(0);
    });
  });

  it('portfolio positions should have required fields', () => {
    Object.values(demoPortfolios).forEach((portfolio) => {
      portfolio.positions.forEach((position) => {
        expect(position.id).toBeDefined();
        expect(position.isin).toBeDefined();
        expect(position.name).toBeDefined();
        expect(position.ticker).toBeDefined();
        expect(position.instrument_type).toBeDefined();
        expect(position.asset_class).toBeDefined();
        expect(position.quantity).toBeGreaterThan(0);
        expect(position.price_eur).toBeGreaterThan(0);
        expect(position.market_value_eur).toBeGreaterThan(0);
        expect(position.weight_percent).toBeDefined();
      });
    });
  });

  it('portfolio weights should sum close to 100%', () => {
    Object.values(demoPortfolios).forEach((portfolio) => {
      const totalWeight = portfolio.positions.reduce(
        (sum, pos) => sum + pos.weight_percent,
        0
      );
      // Allow some tolerance for rounding
      expect(totalWeight).toBeGreaterThan(95);
      expect(totalWeight).toBeLessThan(105);
    });
  });

  it('prudent portfolio should be conservative', () => {
    const portfolio = demoPortfolios.prudent;
    expect(portfolio.profile).toBe('prudent');
    
    // Should have more fixed income than equities
    const fixedIncome = portfolio.positions
      .filter((p) => p.asset_class === 'Fixed Income')
      .reduce((sum, p) => sum + p.weight_percent, 0);
    const equities = portfolio.positions
      .filter((p) => p.asset_class === 'Equities')
      .reduce((sum, p) => sum + p.weight_percent, 0);
    
    expect(fixedIncome).toBeGreaterThan(equities);
  });

  it('aggressive portfolio should have more equities', () => {
    const portfolio = demoPortfolios.aggressive;
    expect(portfolio.profile).toBe('aggressive');
    
    const equities = portfolio.positions
      .filter((p) => p.asset_class === 'Equities')
      .reduce((sum, p) => sum + p.weight_percent, 0);
    
    // Aggressive should have at least 60% equities
    expect(equities).toBeGreaterThan(60);
  });
});

describe('demoNews', () => {
  it('should be an array of news items', () => {
    expect(demoNews).toBeInstanceOf(Array);
    expect(demoNews.length).toBeGreaterThan(0);
  });

  it('each news item should have required fields', () => {
    demoNews.forEach((news) => {
      expect(news.id).toBeDefined();
      expect(news.title).toBeDefined();
      expect(news.summary).toBeDefined();
      expect(news.source).toBeDefined();
      expect(news.published_at).toBeDefined();
    });
  });

  it('news items should have tags', () => {
    demoNews.forEach((news) => {
      expect(news.tags).toBeDefined();
      expect(news.tags).toBeInstanceOf(Array);
    });
  });
});

describe('quickPrompts', () => {
  it('should be an array', () => {
    expect(quickPrompts).toBeInstanceOf(Array);
    expect(quickPrompts.length).toBeGreaterThan(0);
  });

  it('each prompt should have required fields', () => {
    quickPrompts.forEach((prompt) => {
      expect(prompt.id).toBeDefined();
      expect(prompt.text).toBeDefined();
      expect(typeof prompt.text).toBe('string');
      expect(prompt.category).toBeDefined();
    });
  });

  it('prompts should have unique ids', () => {
    const ids = quickPrompts.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('prompts should cover common investment queries', () => {
    const promptTexts = quickPrompts.map((p) => p.text.toLowerCase());
    
    // Should have prompts about portfolio analysis
    const hasPortfolioAnalysis = promptTexts.some(
      (p) => p.includes('portfolio') || p.includes('portefeuille') || p.includes('exposures') || p.includes('risk')
    );
    expect(hasPortfolioAnalysis).toBe(true);
  });
});
