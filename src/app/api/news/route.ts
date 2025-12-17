import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { fetchMarketauxNews } from '@/lib/news/providers/marketaux';
import { fetchFinnhubNews } from '@/lib/news/providers/finnhub';
import type { NormalizedNewsItem } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const limitParam = searchParams.get('limit');
  const symbolsParam = searchParams.get('symbols');
  const languageParam = searchParams.get('language');
  const providerParam = searchParams.get('provider');

  const limit = limitParam ? Number.parseInt(limitParam, 10) || 50 : 50;
  const symbols = symbolsParam
    ? symbolsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const language = languageParam || 'en';

  const provider = (providerParam || env.MARKET_NEWS_PROVIDER) as 'marketaux' | 'finnhub';

  try {
    let items: NormalizedNewsItem[] = [];

    if (provider === 'marketaux') {
      items = await fetchMarketauxNews({ symbols, limit, language });
    } else if (provider === 'finnhub') {
      items = await fetchFinnhubNews({ symbols, limit, language });
    } else {
      return NextResponse.json(
        { error: `Unsupported market news provider: ${provider}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ provider, items });
  } catch (error) {
    console.error('[GET /api/news] Error fetching market news:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch market news',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


