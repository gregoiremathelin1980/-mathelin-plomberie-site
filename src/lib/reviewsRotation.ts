import type { ReviewEntry } from "@/lib/site-data";

/** PRNG déterministe (même graine → même suite) pour mélanger sans `Math.random` côté client. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Choisit jusqu’à `displayCount` avis dans un ordre mélangé selon `seed`.
 * Utilisé pour faire tourner l’affichage à partir d’un pool (ex. liste GMB via GéoCompta).
 */
export function pickRotatingReviews(pool: ReviewEntry[], displayCount: number, seed: number): ReviewEntry[] {
  if (pool.length === 0) return [];
  if (pool.length <= displayCount) return [...pool];
  const rand = mulberry32(seed);
  const idx = pool.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = idx[i]!;
    idx[i] = idx[j]!;
    idx[j] = tmp;
  }
  return idx.slice(0, displayCount).map((i) => pool[i]!);
}
