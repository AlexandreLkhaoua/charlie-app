import { NextResponse } from 'next/server';
import { fetchMarketauxNews } from '@/lib/news/providers/marketaux';
import { upsertNewsItems } from '@/lib/news/ingest';
import { getSupabaseAdminClient, type NewsItem as StoredNewsItem } from '@/lib/supabase/server';
import type { NormalizedNewsItem } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const limitParam = searchParams.get('limit');
  const symbolsParam = searchParams.get('symbols');
  const languageParam = searchParams.get('language');

  const limit = limitParam ? Number.parseInt(limitParam, 10) || 50 : 50;
  const symbols = symbolsParam
    ? symbolsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const language = languageParam || 'en';

  try {
    let items: NormalizedNewsItem[] = [];

    // V1 : provider unique = Marketaux
    // On ignore pour l'instant les autres providers potentiels (Finnhub, etc.)
    items = await fetchMarketauxNews({ symbols, limit, language });

    // Persist les items pour constituer un feed cumulatif
    await upsertNewsItems(items);

    // Retourne le feed stocké (le plus récent d'abord)
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .rpc('get_latest_news' as never, { p_limit: limit } as never);

    if (error) {
      console.error('[GET /api/news] Error fetching stored news:', error);
      // Fallback : renvoyer les items frais si la lecture échoue
      return NextResponse.json({ provider: 'marketaux', items });
    }

    const storedItems = (data || []) as StoredNewsItem[];

    return NextResponse.json({ provider: 'marketaux', items: storedItems });
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


