import type { NormalizedNewsItem } from '@/types';
import { getSupabaseAdminClient, type NewsItemInsert } from '@/lib/supabase/server';

export interface UpsertResult {
  inserted: number;
  updated: number;
  skipped: number;
}

/**
 * Upsert d'une liste de news normalisées dans Supabase.
 *
 * - Déduplication par contrainte unique sur `url`
 * - Si une news existe déjà avec la même `url`, on met à jour uniquement :
 *   - summary (si non null)
 *   - image_url (si non null)
 *   - tickers (si non vide)
 *   - published_at (si défini)
 * - On ne modifie jamais : title, url, provider, provider_id, content_hash.
 */
export async function upsertNewsItems(items: NormalizedNewsItem[]): Promise<UpsertResult> {
  const supabase = getSupabaseAdminClient();

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of items) {
    // Sécurité : on ignore les items sans URL ou sans titre
    if (!item.url || !item.title) {
      skipped += 1;
      continue;
    }

    // 1) On regarde s'il existe déjà une news avec la même URL
    const {
      data: existing,
      error: selectError,
    } = await supabase
      // Cast léger pour éviter les problèmes de typage avec le client Supabase
      .from('news_items' as never)
      .select('*')
      .eq('url', item.url)
      .maybeSingle();

    if (selectError) {
      console.error('[news.ingest] Failed to select existing news_item by url:', {
        url: item.url,
        error: selectError.message,
      });
      skipped += 1;
      continue;
    }

    if (!existing) {
      // 2) Pas d'existant -> INSERT
      const payload: NewsItemInsert = {
        provider: item.provider,
        provider_id: item.provider_id,
        url: item.url,
        title: item.title,
        summary: item.summary,
        source: item.source,
        image_url: item.image_url,
        published_at: item.published_at,
        lang: item.lang,
        tickers: item.tickers,
        content_hash: item.content_hash,
      };

      const { error: insertError } = await supabase
        .from('news_items' as never)
        .insert(payload as never);

      if (insertError) {
        console.error('[news.ingest] Failed to insert news_item:', {
          url: item.url,
          error: insertError.message,
        });
        skipped += 1;
        continue;
      }

      inserted += 1;
    } else {
      // 3) Existant -> UPDATE partiel si on a quelque chose de nouveau à écrire
      const update: Partial<NewsItemInsert> = {};

      if (item.summary != null) {
        update.summary = item.summary;
      }

      if (item.image_url != null) {
        update.image_url = item.image_url;
      }

      if (Array.isArray(item.tickers) && item.tickers.length > 0) {
        update.tickers = item.tickers;
      }

      if (item.published_at) {
        update.published_at = item.published_at;
      }

      // Rien à mettre à jour -> on considère comme "skipped"
      if (Object.keys(update).length === 0) {
        skipped += 1;
        continue;
      }

      const existingRecord = existing as { id: string; url: string };

      const { error: updateError } = await supabase
        .from('news_items' as never)
        .update(update as never)
        .eq('id', existingRecord.id);

      if (updateError) {
        console.error('[news.ingest] Failed to update news_item:', {
          id: existingRecord.id,
          url: existingRecord.url,
          error: updateError.message,
        });
        skipped += 1;
        continue;
      }

      updated += 1;
    }
  }

  const result: UpsertResult = { inserted, updated, skipped };

  // Log minimal côté serveur
  console.log('[news.ingest] Upsert result:', result);

  return result;
}


