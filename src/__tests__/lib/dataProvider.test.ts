import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredProfile,
  setStoredProfile,
  PORTFOLIO_PROFILE_KEY,
} from '@/lib/dataProvider';

describe('Profile Storage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('getStoredProfile', () => {
    it('should return "balanced" as default when no profile stored', () => {
      expect(getStoredProfile()).toBe('balanced');
    });

    it('should return stored "prudent" profile', () => {
      localStorage.setItem(PORTFOLIO_PROFILE_KEY, 'prudent');
      expect(getStoredProfile()).toBe('prudent');
    });

    it('should return stored "balanced" profile', () => {
      localStorage.setItem(PORTFOLIO_PROFILE_KEY, 'balanced');
      expect(getStoredProfile()).toBe('balanced');
    });

    it('should return stored "aggressive" profile', () => {
      localStorage.setItem(PORTFOLIO_PROFILE_KEY, 'aggressive');
      expect(getStoredProfile()).toBe('aggressive');
    });

    it('should return "balanced" for invalid stored values', () => {
      localStorage.setItem(PORTFOLIO_PROFILE_KEY, 'invalid');
      expect(getStoredProfile()).toBe('balanced');
    });
  });

  describe('setStoredProfile', () => {
    it('should store "prudent" profile', () => {
      setStoredProfile('prudent');
      expect(localStorage.getItem(PORTFOLIO_PROFILE_KEY)).toBe('prudent');
    });

    it('should store "balanced" profile', () => {
      setStoredProfile('balanced');
      expect(localStorage.getItem(PORTFOLIO_PROFILE_KEY)).toBe('balanced');
    });

    it('should store "aggressive" profile', () => {
      setStoredProfile('aggressive');
      expect(localStorage.getItem(PORTFOLIO_PROFILE_KEY)).toBe('aggressive');
    });

    it('should overwrite existing profile', () => {
      setStoredProfile('prudent');
      expect(localStorage.getItem(PORTFOLIO_PROFILE_KEY)).toBe('prudent');
      
      setStoredProfile('aggressive');
      expect(localStorage.getItem(PORTFOLIO_PROFILE_KEY)).toBe('aggressive');
    });
  });

  describe('integration', () => {
    it('should round-trip profile storage correctly', () => {
      setStoredProfile('prudent');
      expect(getStoredProfile()).toBe('prudent');

      setStoredProfile('balanced');
      expect(getStoredProfile()).toBe('balanced');

      setStoredProfile('aggressive');
      expect(getStoredProfile()).toBe('aggressive');
    });
  });
});
