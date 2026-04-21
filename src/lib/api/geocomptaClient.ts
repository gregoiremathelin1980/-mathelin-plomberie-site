/**
 * Client unique GéoCompta — toutes les requêtes passent ici.
 * Timeout 8s, 2 retries, validation Zod.
 * **Jamais** `NEXT_PUBLIC_*` pour la clé : uniquement `GEOCOMPTA_API_KEY` côté serveur (Vercel / RSC / route handlers).
 * Appels uniquement depuis Server Components, Route Handlers ou Server Actions — pas depuis `"use client"`.
 */

import { z } from "zod";
import {
  GeocomptaConseilDetailSchema,
  type GeocomptaConseilDetail,
  GeocomptaFeaturedInterventionSchema,
  GeocomptaHomepageSchema,
  type GeocomptaHomepagePayload,
  type GeocomptaFeaturedReview,
  GeocomptaRealisationDetailSchema,
  type GeocomptaRealisationDetail,
  GeocomptaRealisationListItemSchema,
  parseGeocomptaReviewList,
  parseGoogleBusinessProfile,
  type GeocomptaGoogleBusinessProfile,
  GeocomptaSeoPageSchema,
  type GeocomptaSeoPage,
  GeocomptaSitemapDataSchema,
  type GeocomptaSitemapData,
} from "@/lib/api/geocomptaSchemas";

const DEFAULT_TIMEOUT_MS = 8000;
const MAX_RETRIES = 2;
const FETCH_REVALIDATE_SECONDS = 300;

let warnedMissingGeocomptaApiKey = false;

export class GeocomptaApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "GeocomptaApiError";
  }
}

/**
 * Origine API publique (sans slash final).
 * Ordre : `GEOCOMPTA_BASE_URL` (doc Terramaster / Funnel) → `GEOCOMPTA_API_BASE_URL` → `GEOCOMPTA_API_URL`.
 */
export function getGeocomptaApiBaseUrl(): string | undefined {
  const a = process.env.GEOCOMPTA_BASE_URL?.trim();
  if (a) return a;
  const b = process.env.GEOCOMPTA_API_BASE_URL?.trim();
  if (b) return b;
  return process.env.GEOCOMPTA_API_URL?.trim() || undefined;
}

export function isGeocomptaConfigured(): boolean {
  return Boolean(getGeocomptaApiBaseUrl());
}

function getBaseUrl(): string {
  const raw = getGeocomptaApiBaseUrl();
  if (!raw) {
    throw new Error(
      "GéoCompta : définir GEOCOMPTA_BASE_URL ou GEOCOMPTA_API_BASE_URL (HTTPS, sans slash final, ex. …:8443)"
    );
  }
  return raw.replace(/\/$/, "");
}

/** Bearer : obligatoire si le proxy Funnel l’exige ; jamais exposé au navigateur (pas de NEXT_PUBLIC_*). */
function getAuthHeaders(): Record<string, string> {
  const key = process.env.GEOCOMPTA_API_KEY?.trim();
  if (!key) {
    if (getGeocomptaApiBaseUrl() && !warnedMissingGeocomptaApiKey) {
      warnedMissingGeocomptaApiKey = true;
      console.warn(
        "[geocompta] GEOCOMPTA_BASE_URL (ou équivalent) est défini mais GEOCOMPTA_API_KEY est vide — le proxy peut répondre 401."
      );
    }
    return {};
  }
  return { Authorization: `Bearer ${key}` };
}

/** Joint base + chemin sans double slash (WHATWG URL). */
export function buildGeocomptaUrl(path: string): string {
  const base = getBaseUrl();
  const pathname = path.startsWith("/") ? path : `/${path}`;
  const baseForJoin = base.endsWith("/") ? base : `${base}/`;
  try {
    return new URL(pathname, baseForJoin).toString();
  } catch {
    throw new GeocomptaApiError(`URL GéoCompta invalide (base + path): ${base} + ${pathname}`);
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function abortSignalForTimeout(ms: number): AbortSignal {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

/**
 * GET JSON avec timeout, retry (2 tentatives après l’échec initial = 3 au total), parse Zod.
 * `next.revalidate` : cache fetch Next (5 min par défaut) pour ne pas surcharger le Trigkey.
 */
export async function geocomptaGetJson<S extends z.ZodTypeAny>(
  path: string,
  schema: S,
  options?: { timeoutMs?: number }
): Promise<z.output<S>> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const url = buildGeocomptaUrl(path);
  const headers: HeadersInit = {
    Accept: "application/json",
    ...getAuthHeaders(),
  };

  let lastErr: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const signal = abortSignalForTimeout(timeoutMs);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers,
        signal,
        next: { revalidate: FETCH_REVALIDATE_SECONDS },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        if (res.status === 401) {
          console.warn(
            "[geocompta] HTTP 401 — clé Bearer invalide ou GEOCOMPTA_API_KEY absente / incorrecte sur Vercel :",
            path
          );
        } else if (res.status === 404) {
          console.warn(
            "[geocompta] HTTP 404 — route non exposée côté GéoCompta (ne pas la créer dans le vitrine) :",
            path
          );
        } else if (res.status >= 500) {
          console.warn("[geocompta] HTTP", res.status, path);
        }
        throw new GeocomptaApiError(
          `GéoCompta HTTP ${res.status} ${path}${body ? `: ${body.slice(0, 200)}` : ""}`,
          res.status
        );
      }

      const json: unknown = await res.json();
      const parsed = schema.safeParse(json);
      if (!parsed.success) {
        throw new GeocomptaApiError(
          `GéoCompta schema ${path}: ${parsed.error.message}`,
          res.status,
          parsed.error
        );
      }
      return parsed.data as z.output<S>;
    } catch (e) {
      lastErr = e;
      if (attempt < MAX_RETRIES) {
        await sleep(300 * (attempt + 1));
        continue;
      }
    }
  }

  if (lastErr instanceof GeocomptaApiError) throw lastErr;
  if (lastErr instanceof Error) {
    if (lastErr.name === "AbortError" || lastErr.name === "TimeoutError") {
      console.warn("[geocompta] timeout ou annulation après", timeoutMs, "ms :", url);
    }
    throw new GeocomptaApiError(lastErr.message, undefined, lastErr);
  }
  throw new GeocomptaApiError("GéoCompta: requête échouée", undefined, lastErr);
}

// ——— Endpoints publics (chemins selon spec) ———

export async function fetchGeocomptaHomepage(): Promise<GeocomptaHomepagePayload> {
  const data = await geocomptaGetJson("/api/public/homepage", GeocomptaHomepageSchema);
  if (process.env.NODE_ENV === "development") {
    console.info(
      "[geocompta] GET /api/public/homepage → featuredReviews parsed count:",
      data.featuredReviews.length
    );
  }
  return data;
}

export async function fetchGeocomptaRealisationList(): Promise<z.infer<typeof GeocomptaRealisationListItemSchema>[]> {
  const data = await geocomptaGetJson("/api/public/realisations", z.unknown());
  if (Array.isArray(data)) {
    return z.array(GeocomptaRealisationListItemSchema).parse(data);
  }
  if (data && typeof data === "object" && Array.isArray((data as { items?: unknown }).items)) {
    return z.array(GeocomptaRealisationListItemSchema).parse((data as { items: unknown[] }).items);
  }
  if (data && typeof data === "object" && Array.isArray((data as { realisations?: unknown }).realisations)) {
    return z.array(GeocomptaRealisationListItemSchema).parse((data as { realisations: unknown[] }).realisations);
  }
  throw new GeocomptaApiError("GéoCompta /realisations: format inattendu");
}

export async function fetchGeocomptaRealisationBySlug(slug: string): Promise<GeocomptaRealisationDetail> {
  const encoded = encodeURIComponent(slug);
  return geocomptaGetJson(`/api/public/realisations/${encoded}`, GeocomptaRealisationDetailSchema);
}

export async function fetchGeocomptaConseilBySlug(slug: string): Promise<GeocomptaConseilDetail> {
  const encoded = encodeURIComponent(slug);
  return geocomptaGetJson(`/api/public/conseils/${encoded}`, GeocomptaConseilDetailSchema);
}

export async function fetchGeocomptaSeoPageBySlug(slug: string): Promise<GeocomptaSeoPage> {
  const encoded = encodeURIComponent(slug);
  return geocomptaGetJson(`/api/public/pages/${encoded}`, GeocomptaSeoPageSchema);
}

/** Extrait le tableau d’avis depuis la réponse JSON brute (tests + `fetchGeocomptaReviewsFull`). */
export function extractReviewsArrayFromPayload(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.reviews)) return o.reviews;
    if (Array.isArray(o.items)) return o.items;
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.featuredReviews)) return o.featuredReviews;
    return [];
  }
  throw new GeocomptaApiError("GéoCompta /reviews: format inattendu (racine non-tableau ni objet)");
}

export type GeocomptaReviewsBundle = {
  reviews: GeocomptaFeaturedReview[];
  googleBusinessProfile: GeocomptaGoogleBusinessProfile | null;
  /** Taille du tableau renvoyé par l’API (peut différer de `reviews.length` après filtrage Zod). */
  reviewsReturnedCount: number;
};

/**
 * Réponse v2 possible : `{ reviews, googleBusinessProfile, reviewsReturnedCount }` ; rétrocompat tableau racine.
 * Ne fait pas planter le rendu — bundle vide sur 401, 404, 5xx, timeout ou JSON invalide.
 */
export async function fetchGeocomptaReviewsFull(): Promise<GeocomptaReviewsBundle> {
  try {
    const data = await geocomptaGetJson("/api/public/reviews", z.unknown(), { timeoutMs: DEFAULT_TIMEOUT_MS });
    const raw = extractReviewsArrayFromPayload(data);
    const list = parseGeocomptaReviewList(raw);
    let reviewsReturnedCount = list.length;
    let googleBusinessProfile: GeocomptaGoogleBusinessProfile | null = null;
    if (data && typeof data === "object") {
      const o = data as Record<string, unknown>;
      const rrc = o.reviewsReturnedCount;
      if (typeof rrc === "number" && Number.isFinite(rrc)) {
        reviewsReturnedCount = Math.max(0, Math.floor(rrc));
      } else if (typeof rrc === "string" && /^\d+$/.test(rrc.trim())) {
        reviewsReturnedCount = parseInt(rrc.trim(), 10);
      }
      googleBusinessProfile = parseGoogleBusinessProfile(o.googleBusinessProfile);
    }
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[geocompta] GET /api/public/reviews → parsed:",
        list.length,
        "returnedCount:",
        reviewsReturnedCount,
        "gbp:",
        googleBusinessProfile ? "yes" : "no"
      );
    }
    return { reviews: list, googleBusinessProfile, reviewsReturnedCount };
  } catch (e) {
    const status = e instanceof GeocomptaApiError ? e.status : undefined;
    if (status !== 401 && status !== 404) {
      console.warn("[geocompta] GET /api/public/reviews — bundle vide (erreur):", e instanceof Error ? e.message : e);
    }
    return { reviews: [], googleBusinessProfile: null, reviewsReturnedCount: 0 };
  }
}

/**
 * Liste d’avis seulement — même sémantique qu’avant (dérivé de `fetchGeocomptaReviewsFull`).
 */
export async function fetchGeocomptaReviews(): Promise<GeocomptaFeaturedReview[]> {
  const b = await fetchGeocomptaReviewsFull();
  return b.reviews;
}

export async function fetchGeocomptaInterventions(): Promise<
  z.infer<typeof GeocomptaFeaturedInterventionSchema>[]
> {
  const data = await geocomptaGetJson("/api/public/interventions", z.unknown());
  if (Array.isArray(data)) {
    return z.array(GeocomptaFeaturedInterventionSchema).parse(data);
  }
  if (data && typeof data === "object" && Array.isArray((data as { interventions?: unknown }).interventions)) {
    return z.array(GeocomptaFeaturedInterventionSchema).parse((data as { interventions: unknown[] }).interventions);
  }
  throw new GeocomptaApiError("GéoCompta /interventions: format inattendu");
}

export async function fetchGeocomptaSitemap(): Promise<GeocomptaSitemapData> {
  const raw = await geocomptaGetJson("/api/public/sitemap", z.unknown());
  return GeocomptaSitemapDataSchema.parse(raw);
}
