/**
 * Cache Next (ISR) + fallback fichier pour les lectures GéoCompta.
 */

import { unstable_cache } from "next/cache";
import {
  fetchGeocomptaConseilBySlug,
  fetchGeocomptaHomepage,
  fetchGeocomptaRealisationBySlug,
  fetchGeocomptaRealisationList,
  fetchGeocomptaReviewsFull,
  fetchGeocomptaSeoPageBySlug,
  fetchGeocomptaSitemap,
  isGeocomptaConfigured,
} from "@/lib/api/geocomptaClient";
import { buildHomepagePayloadFromFiles } from "@/lib/api/geocomptaHomepageFallback";
import type {
  GeocomptaConseilDetail,
  GeocomptaGoogleBusinessProfile,
  GeocomptaRealisationDetail,
  GeocomptaSeoPage,
  GeocomptaSitemapData,
} from "@/lib/api/geocomptaSchemas";
import type { ReviewEntry } from "@/lib/site-data";

const DEFAULT_REVIEWS_CACHE_SECONDS = 900;
const DEFAULT_HOME_REVALIDATE_SECONDS = 1800;

/**
 * ISR de la page `/` et durée `unstable_cache` pour `GET /api/public/homepage`.
 * Doit être **≤** au créneau de sync GéoCompta (ex. avis toutes les 30 min → 1800 s),
 * sinon la rotation d’avis ne suit pas les nouvelles données malgré un pool `/reviews` à jour.
 */
export function getGeocomptaHomeRevalidateSeconds(): number {
  const raw = process.env.GEOCOMPTA_HOME_REVALIDATE_SECONDS;
  const n = raw != null && raw.trim() !== "" ? Number(raw) : NaN;
  if (Number.isFinite(n) && n >= 60 && n <= 86_400) return Math.floor(n);
  return DEFAULT_HOME_REVALIDATE_SECONDS;
}

function getReviewsCacheRevalidate(): number {
  const raw = process.env.GEOCOMPTA_REVIEWS_CACHE_SECONDS;
  const n = raw != null && raw.trim() !== "" ? Number(raw) : NaN;
  if (Number.isFinite(n) && n >= 60 && n <= 86_400) return Math.floor(n);
  return DEFAULT_REVIEWS_CACHE_SECONDS;
}

function mapGeocomptaReviewsToEntries(
  list: Awaited<ReturnType<typeof fetchGeocomptaReviewsFull>>["reviews"]
): ReviewEntry[] {
  return list.map((r) => ({
    author: r.author,
    rating: r.rating,
    text: r.text,
    date: r.date,
    source: r.source,
  }));
}

export type GeocomptaReviewCacheBundle = {
  pool: ReviewEntry[];
  googleBusinessProfile: GeocomptaGoogleBusinessProfile | null;
};

async function loadReviewBundleFromApi(): Promise<GeocomptaReviewCacheBundle> {
  const full = await fetchGeocomptaReviewsFull();
  return {
    pool: mapGeocomptaReviewsToEntries(full.reviews),
    googleBusinessProfile: full.googleBusinessProfile,
  };
}

/**
 * Pool `/api/public/reviews` + agrégat fiche Google (même cache ISR).
 * Si le cache contient un pool vide alors que l’API peut répondre, on retente sans `unstable_cache`.
 */
export async function getCachedGeocomptaReviewBundle(): Promise<GeocomptaReviewCacheBundle> {
  if (!isGeocomptaConfigured()) return { pool: [], googleBusinessProfile: null };
  const revalidate = getReviewsCacheRevalidate();
  const cached = await unstable_cache(
    async () => loadReviewBundleFromApi(),
    ["geocompta-reviews-bundle-v1"],
    { revalidate, tags: ["geocompta-reviews"] }
  )();

  if (cached.pool.length > 0) return cached;
  return loadReviewBundleFromApi();
}

export async function getCachedGeocomptaReviewPool(): Promise<ReviewEntry[]> {
  const { pool } = await getCachedGeocomptaReviewBundle();
  return pool;
}

export async function getCachedGeocomptaHomepage() {
  const revalidate = getGeocomptaHomeRevalidateSeconds();
  try {
    return await unstable_cache(
      async () => {
        try {
          return await fetchGeocomptaHomepage();
        } catch (e) {
          console.warn("[geocompta] GET /api/public/homepage échoué → fallback fichiers:", e);
          return buildHomepagePayloadFromFiles();
        }
      },
      ["geocompta-homepage-v3"],
      { revalidate, tags: ["geocompta-homepage"] }
    )();
  } catch (e) {
    console.warn("[geocompta] cache homepage (unstable_cache) échoué → fallback fichiers:", e);
    return buildHomepagePayloadFromFiles();
  }
}

export async function tryGetCachedGeocomptaRealisation(slug: string): Promise<GeocomptaRealisationDetail | null> {
  if (!isGeocomptaConfigured()) return null;
  try {
    return await unstable_cache(
      async () => fetchGeocomptaRealisationBySlug(slug),
      ["geocompta-realisation", slug],
      { revalidate: 86400, tags: ["geocompta-realisations"] }
    )();
  } catch {
    return null;
  }
}

export async function tryGetCachedGeocomptaConseil(slug: string): Promise<GeocomptaConseilDetail | null> {
  if (!isGeocomptaConfigured()) return null;
  try {
    return await unstable_cache(
      async () => fetchGeocomptaConseilBySlug(slug),
      ["geocompta-conseil", slug],
      { revalidate: 86400, tags: ["geocompta-conseils"] }
    )();
  } catch {
    return null;
  }
}

export async function tryGetCachedGeocomptaSeoPage(slug: string): Promise<GeocomptaSeoPage | null> {
  if (!isGeocomptaConfigured()) return null;
  try {
    return await unstable_cache(
      async () => fetchGeocomptaSeoPageBySlug(slug),
      ["geocompta-seo-page", slug],
      { revalidate: 86400, tags: ["geocompta-seo-pages"] }
    )();
  } catch {
    return null;
  }
}

/** Slugs pour /p/[slug] dérivés du sitemap API */
/** Slugs réalisations connus côté API (pré-rendu) */
export async function getCachedGeocomptaRealisationSlugs(): Promise<string[]> {
  if (!isGeocomptaConfigured()) return [];
  try {
    const list = await unstable_cache(
      async () => fetchGeocomptaRealisationList(),
      ["geocompta-realisations-list-v1"],
      { revalidate: 3600, tags: ["geocompta-realisations"] }
    )();
    return list.map((r) => r.slug).filter(Boolean);
  } catch {
    return [];
  }
}

/** Données `GET /api/public/sitemap` (pages, réalisations, conseils + dates). */
export async function getCachedGeocomptaSitemapData(): Promise<GeocomptaSitemapData | null> {
  if (!isGeocomptaConfigured()) return null;
  try {
    return await unstable_cache(
      async () => fetchGeocomptaSitemap(),
      ["geocompta-sitemap-data-v2"],
      { revalidate: 3600, tags: ["geocompta-sitemap"] }
    )();
  } catch {
    return null;
  }
}

export async function getCachedGeocomptaPPageSlugs(): Promise<string[]> {
  const data = await getCachedGeocomptaSitemapData();
  return data?.pages.map((p) => p.slug).filter(Boolean) ?? [];
}
