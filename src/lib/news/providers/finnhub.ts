import type { NormalizedNewsItem } from '@/types';

/**
 * Paramètres pour fetchFinnhubNews
 */
export interface FetchFinnhubNewsParams {
  symbols?: string[];
  limit?: number;
  language?: string;
}

/**
 * Stub pour le provider Finnhub
 * 
 * Cette fonction n'est pas encore implémentée mais expose la même signature
 * que fetchMarketauxNews pour permettre un fallback futur.
 * 
 * @param params - Paramètres optionnels (symbols, limit, language)
 * @returns Tableau de news normalisées (vide pour l'instant)
 * @throws Error indiquant que l'implémentation n'est pas encore disponible
 */
export async function fetchFinnhubNews(
  params?: FetchFinnhubNewsParams
): Promise<NormalizedNewsItem[]> {
  // TODO: Implémenter l'intégration avec l'API Finnhub
  throw new Error('Finnhub provider is not yet implemented');
}

