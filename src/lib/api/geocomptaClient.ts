/**
 * Client unique GéoCompta — toutes les requêtes passent ici.
 * Timeout 5s, 2 retries, validation Zod.
 * La clé API ne doit jamais être exposée au navigateur : appels depuis Server Components / Route Handlers uniquement.
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
  GeocomptaSeoPageSchema,
  type GeocomptaSeoPage,
  GeocomptaSitemapDataSchema,
  type GeocomptaSitemapData,
} from "@/lib/api/geocomptaSchemas";

const DEFAULT_TIMEOUT_MS = 5000;
const MAX_RETRIES = 2;

/** URL canonique ; `GEOCOMPTA_API_URL` = alias legacy (anciennes docs / Vercel mal nommé). */
function getGeocomptaApiBaseFromEnv(): string | undefined {
  const primary = process.env.GEOCOMPTA_API_BASE_URL?.trim();
  if (primary) return primary;
  return process.env.GEOCOMPTA_API_URL?.trim() || undefined;
}

export function isGeocomptaConfigured(): boolean {
  return Boolean(getGeocomptaApiBaseFromEnv());
}

function getBaseUrl(): string {
  const raw = getGeocomptaApiBaseFromEnv();
  if (!raw) throw new Error("GEOCOMPTA_API_BASE_URL (ou alias GEOCOMPTA_API_URL) is not set");
  return raw.replace(/\/$/, "");
}

/** Bearer optionnel (public API key GéoCompta). GeoVault / autres auth → à brancher séparément si besoin. */
function getAuthHeaders(): Record<string, string> {
  const key = process.env.GEOCOMPTA_API_KEY?.trim();
  if (!key) return {};
  return { Authorization: `Bearer ${key}` };
}

function buildUrl(path: string): string {
  const base = getBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

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
 * GET JSON avec timeout, retry (2 tentatives après l’échec initial = 3 au total), parse Zod.
 */
export async function geocomptaGetJson<S extends z.ZodTypeAny>(
  path: string,
  schema: S,
  options?: { timeoutMs?: number }
): Promise<z.output<S>> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const url = buildUrl(path);
  const headers: HeadersInit = {
    Accept: "application/json",
    ...getAuthHeaders(),
  };

  let lastErr: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers,
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timer);

      if (!res.ok) {
        const body = await res.text().catch(() => "");
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
      clearTimeout(timer);
      lastErr = e;
      if (attempt < MAX_RETRIES) {
        await sleep(300 * (attempt + 1));
        continue;
      }
    }
  }

  if (lastErr instanceof GeocomptaApiError) throw lastErr;
  if (lastErr instanceof Error) throw new GeocomptaApiError(lastErr.message, undefined, lastErr);
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

/** Extrait le tableau d’avis depuis la réponse JSON brute (tests + `fetchGeocomptaReviews`). */
export function extractReviewsArrayFromPayload(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.reviews)) return o.reviews;
    if (Array.isArray(o.items)) return o.items;
    if (Array.isArray(o.data)) return o.data;
  }
  throw new GeocomptaApiError("GéoCompta /reviews: format inattendu (attendu: tableau racine ou { reviews })");
}

export async function fetchGeocomptaReviews(): Promise<GeocomptaFeaturedReview[]> {
  const data = await geocomptaGetJson("/api/public/reviews", z.unknown());
  const raw = extractReviewsArrayFromPayload(data);
  const list = parseGeocomptaReviewList(raw);
  if (process.env.NODE_ENV === "development") {
    console.info(
      "[geocompta] GET /api/public/reviews → parsed count:",
      list.length,
      "(raw items:",
      raw.length,
      ")"
    );
  }
  return list;
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
