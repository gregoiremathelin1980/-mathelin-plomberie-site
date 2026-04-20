import { isGeocomptaConfigured } from "@/lib/api/geocomptaClient";
import { getCachedGeocomptaReviewPool } from "@/lib/api/geocomptaCached";
import { pickRotatingReviews } from "@/lib/reviewsRotation";
import type { ReviewEntry } from "@/lib/site-data";
import type { SatelliteTestimonial } from "@/lib/satelliteLandings";

export function reviewEntriesToSatelliteTestimonials(entries: ReviewEntry[]): SatelliteTestimonial[] {
  return entries.map((r) => ({
    firstName: (r.author && r.author.trim()) || "Client",
    rating: r.rating,
    text: r.text,
  }));
}

/**
 * Même source que l’accueil : `getCachedGeocomptaReviewPool` + rotation.
 * Si GéoCompta est absent ou le pool vide → témoignages manuels (`satellite-landings.json`).
 */
export async function getSatelliteTestimonialsFromGeocomptaOrFallback(
  fallback: SatelliteTestimonial[],
  displayCount = 3
): Promise<{ items: SatelliteTestimonial[]; fromGeocompta: boolean }> {
  if (!isGeocomptaConfigured()) {
    return { items: fallback, fromGeocompta: false };
  }
  try {
    const pool = await getCachedGeocomptaReviewPool();
    if (pool.length === 0) {
      return { items: fallback, fromGeocompta: false };
    }
    const picked = pickRotatingReviews(pool, displayCount, Date.now());
    return {
      items: reviewEntriesToSatelliteTestimonials(picked),
      fromGeocompta: true,
    };
  } catch {
    return { items: fallback, fromGeocompta: false };
  }
}
