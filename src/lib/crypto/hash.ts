import { createHash } from 'crypto';

/**
 * Génère un hash SHA256 d'une chaîne de caractères
 * @param input - La chaîne à hasher
 * @returns Le hash hexadécimal en minuscules
 */
export function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Génère un content_hash pour une news item
 * Basé sur title + source + published_at pour identifier les doublons
 * @param title - Le titre de la news
 * @param source - La source de la news (peut être null)
 * @param published_at - La date de publication (ISO string)
 * @returns Le hash SHA256
 */
export function generateContentHash(
  title: string,
  source: string | null,
  published_at: string
): string {
  const content = `${title}|${source || ''}|${published_at}`;
  return sha256(content);
}

