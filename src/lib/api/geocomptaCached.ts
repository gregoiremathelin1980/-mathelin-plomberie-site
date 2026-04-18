/**
 * Cache Next (ISR) + fallback fichier pour les lectures GéoCompta.
 */

import { unstable_cache } from "next/cache";
import {
  fetchGeocomptaConseilBySlug,
  fetchGeocomptaHomepage,
  fetchGeocomptaRealisationBySlug,
  fetchGeocomptaRealisationList,
  fetchGeocomptaReviews,
  fetchGeocomptaSeoPageBySlug,
  fetchGeocomptaSitemap,
  isGeocomptaConfigured,
} from "@/lib/api/geocomptaClient";
import { buildHomepagePayloadFromFiles } from "@/lib/api/geocomptaHomepageFallback";
import type { GeocomptaConseilDetail } from "@/lib/api/geocomptaSchemas";
import type { GeocomptaRealisationDetail } from "@/lib/api/geocomptaSchemas";
import type { GeocomptaSeoPage } from "@/lib/api/geocomptaSchemas";
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

/**
 * Pool d’avis synchronisés côté GéoCompta (ex. depuis Google Business Profile).
 * Liste complète ; la page d’accueil en extrait un sous-ensemble avec rotation (voir `pickRotatingReviews`).
 */
export async function getCachedGeocomptaReviewPool(): Promise<ReviewEntry[]> {
  if (!isGeocomptaConfigured()) return [];
  const revalidate = getReviewsCacheRevalidate();
  return unstable_cache(
    async () => {
      try {
        const list = await fetchGeocomptaReviews();
        return list.map((r) => ({
          author: r.author ?? r.name,
          rating: r.rating,
          text: r.text,
          date: r.date,
        }));
      } catch {
        return [];
      }
    },
    ["geocompta-reviews-pool-v1"],
    { revalidate, tags: ["geocompta-reviews"] }
  )();
}

export async function getCachedGeocomptaHomepage() {
  const revalidate = getGeocomptaHomeRevalidateSeconds();
  return unstable_cache(
    async () => {
      try {
        return await fetchGeocomptaHomepage();
      } catch {
        return buildHomepagePayloadFromFiles();
      }
    },
    ["geocompta-homepage-v2"],
    { revalidate, tags: ["geocompta-homepage"] }
  )();
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

export async function getCachedGeocomptaPPageSlugs(): Promise<string[]> {
  if (!isGeocomptaConfigured()) return [];
  try {
    const { paths } = await unstable_cache(
      async () => fetchGeocomptaSitemap(),
      ["geocompta-sitemap-v1"],
      { revalidate: 3600, tags: ["geocompta-sitemap"] }
    )();
    return paths
      .map((p) => {
        const normalized = p.replace(/^https?:\/\/[^/]+/i, "");
        const m = normalized.match(/\/p\/([^/?#]+)\/?$/);
        return m ? decodeURIComponent(m[1]) : null;
      })
      .filter((x): x is string => Boolean(x));
  } catch {
    return [];
  }
}
