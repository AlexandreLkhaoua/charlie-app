import { describe, it, expect } from 'vitest';
import {
  cn,
  formatCurrency,
  formatPercent,
  formatCompactNumber,
  delay,
  generateId,
} from '@/lib/utils';

describe('cn (className merge)', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz');
  });

  it('should handle Tailwind conflicts', () => {
    // tailwind-merge should resolve conflicts
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('should handle objects', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });
});

describe('formatCurrency', () => {
  it('should format EUR currency by default', () => {
    const result = formatCurrency(1234.56);
    // Format varies by locale, but should contain the value
    expect(result).toContain('1');
    expect(result).toContain('234');
  });

  it('should format with different currencies', () => {
    const usd = formatCurrency(1000, 'USD', 'en-US');
    expect(usd).toContain('$');
    expect(usd).toContain('1,000');
  });

  it('should handle zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('should handle negative numbers', () => {
    const result = formatCurrency(-500);
    expect(result).toContain('500');
  });

  it('should handle large numbers', () => {
    const result = formatCurrency(1000000);
    expect(result).toBeTruthy();
  });
});

describe('formatPercent', () => {
  it('should format basic percentage', () => {
    expect(formatPercent(12.345)).toBe('12.35%');
  });

  it('should respect decimal precision', () => {
    expect(formatPercent(12.345, { decimals: 1 })).toBe('12.3%');
    expect(formatPercent(12.345, { decimals: 0 })).toBe('12%');
  });

  it('should show sign when requested', () => {
    expect(formatPercent(5.5, { showSign: true })).toBe('+5.50%');
    expect(formatPercent(-5.5, { showSign: true })).toBe('-5.50%');
    expect(formatPercent(0, { showSign: true })).toBe('0.00%');
  });

  it('should handle negative numbers', () => {
    expect(formatPercent(-3.5)).toBe('-3.50%');
  });

  it('should handle zero', () => {
    expect(formatPercent(0)).toBe('0.00%');
  });
});

describe('formatCompactNumber', () => {
  it('should format thousands with K', () => {
    const result = formatCompactNumber(1500);
    expect(result).toMatch(/1\.?5?K/i);
  });

  it('should format millions with M', () => {
    const result = formatCompactNumber(2500000);
    expect(result).toMatch(/2\.?5?M/i);
  });

  it('should format billions with B', () => {
    const result = formatCompactNumber(1000000000);
    expect(result).toMatch(/1B/i);
  });

  it('should keep small numbers as-is', () => {
    expect(formatCompactNumber(100)).toBe('100');
    expect(formatCompactNumber(999)).toBe('999');
  });
});

describe('delay', () => {
  it('should return a promise', () => {
    expect(delay(100)).toBeInstanceOf(Promise);
  });

  it('should resolve after specified time', async () => {
    const start = Date.now();
    await delay(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(45); // Allow some tolerance
  });
});

describe('generateId', () => {
  it('should generate a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('should generate unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('should contain timestamp prefix', () => {
    const id = generateId();
    const timestampPart = id.split('-')[0];
    expect(Number(timestampPart)).toBeGreaterThan(0);
  });
});
