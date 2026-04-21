import type { GeocomptaGoogleBusinessProfile } from "@/lib/api/geocomptaSchemas";
import { isGeocomptaConfigured } from "@/lib/api/geocomptaClient";
import { getCachedGeocomptaReviewBundle } from "@/lib/api/geocomptaCached";
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
 * Même source que l’accueil : cache bundle `/api/public/reviews` + rotation.
 * Si le pool est vide → témoignages manuels ; l’agrégat fiche Google peut quand même venir de l’API.
 */
export async function getSatelliteTestimonialsFromGeocomptaOrFallback(
  fallback: SatelliteTestimonial[],
  displayCount = 3
): Promise<{
  items: SatelliteTestimonial[];
  fromGeocompta: boolean;
  googleBusinessProfile: GeocomptaGoogleBusinessProfile | null;
}> {
  if (!isGeocomptaConfigured()) {
    return { items: fallback, fromGeocompta: false, googleBusinessProfile: null };
  }
  try {
    const { pool, googleBusinessProfile } = await getCachedGeocomptaReviewBundle();
    if (pool.length === 0) {
      return { items: fallback, fromGeocompta: false, googleBusinessProfile };
    }
    const picked = pickRotatingReviews(pool, displayCount, Date.now());
    return {
      items: reviewEntriesToSatelliteTestimonials(picked),
      fromGeocompta: true,
      googleBusinessProfile,
    };
  } catch {
    return { items: fallback, fromGeocompta: false, googleBusinessProfile: null };
  }
}
