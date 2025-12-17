import { env } from '@/lib/env';
import { generateContentHash } from '@/lib/crypto/hash';
import type { NormalizedNewsItem } from '@/types';

/**
 * Type pour la réponse de l'API Marketaux
 */
interface MarketauxNewsItem {
  uuid?: string;
  title: string;
  description?: string;
  snippet?: string;
  url: string;
  image_url?: string;
  language?: string;
  published_at: string;
  source?: string;
  categories?: string[];
  relevance_score?: number;
  entities?: Array<{
    symbol?: string;
    name?: string;
    exchange?: string;
    exchange_long?: string;
    country?: string;
    type?: string;
    industry?: string;
    match_score?: number;
    sentiment_score?: number;
  }>;
  similar?: Array<{
    uuid?: string;
    title?: string;
    published_at?: string;
    url?: string;
  }>;
}

interface MarketauxResponse {
  data?: MarketauxNewsItem[];
  meta?: {
    found?: number;
    returned?: number;
    limit?: number;
    page?: number;
  };
  errors?: Array<{
    message?: string;
    code?: string;
  }>;
}

/**
 * Paramètres pour fetchMarketauxNews
 */
export interface FetchMarketauxNewsParams {
  symbols?: string[];
  limit?: number;
  language?: string;
}

/**
 * Récupère les news depuis l'API Marketaux et les normalise
 * 
 * @param params - Paramètres optionnels (symbols, limit, language)
 * @returns Tableau de news normalisées
 * @throws Error si l'API key n'est pas configurée ou en cas d'erreur API
 */
export async function fetchMarketauxNews(
  params?: FetchMarketauxNewsParams
): Promise<NormalizedNewsItem[]> {
  const { symbols = [], limit = 50, language = 'en' } = params || {};

  if (!env.MARKETAUX_API_KEY) {
    throw new Error('MARKETAUX_API_KEY is not configured');
  }

  // Construction de l'URL avec les paramètres
  const baseUrl = 'https://api.marketaux.com/v1/news/all';
  const urlParams = new URLSearchParams({
    api_token: env.MARKETAUX_API_KEY,
    limit: limit.toString(),
    language,
  });

  // Ajout des symbols si fournis
  if (symbols.length > 0) {
    urlParams.append('symbols', symbols.join(','));
  }

  const url = `${baseUrl}?${urlParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Marketaux API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data: MarketauxResponse = await response.json();

    // Vérification des erreurs dans la réponse
    if (data.errors && data.errors.length > 0) {
      const errorMessages = data.errors.map((e) => e.message || e.code).join(', ');
      throw new Error(`Marketaux API errors: ${errorMessages}`);
    }

    // Normalisation des news
    const newsItems = (data.data || []).map((item) => {
      // Extraction des tickers depuis les entities
      const tickers: string[] = [];
      if (item.entities) {
        for (const entity of item.entities) {
          if (entity.symbol) {
            tickers.push(entity.symbol.toUpperCase());
          }
        }
      }

      // Déduplication des tickers
      const uniqueTickers = Array.from(new Set(tickers));

      // Utilisation de description ou snippet comme summary
      const summary = item.description || item.snippet || null;

      // Génération du content_hash
      const content_hash = generateContentHash(
        item.title,
        item.source || null,
        item.published_at
      );

      return {
        provider: 'marketaux' as const,
        provider_id: item.uuid || null,
        url: item.url,
        title: item.title,
        summary,
        source: item.source || null,
        image_url: item.image_url || null,
        published_at: item.published_at,
        lang: item.language || null,
        tickers: uniqueTickers,
        content_hash,
      };
    });

    // Déduplication côté provider
    // 1. Retirer les items sans url ou sans title
    const filtered = newsItems.filter(
      (item) => item.url && item.title && item.url.trim() !== '' && item.title.trim() !== ''
    );

    // 2. Unique par url (garder le premier en cas de doublon)
    const seenUrls = new Set<string>();
    const deduplicated: NormalizedNewsItem[] = [];

    for (const item of filtered) {
      if (!seenUrls.has(item.url)) {
        seenUrls.add(item.url);
        deduplicated.push(item);
      }
    }

    return deduplicated;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to fetch Marketaux news: ${String(error)}`);
  }
}

