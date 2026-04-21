/**
 * Fallback fichier (site-data + content) si l’API GéoCompta est indisponible ou non configurée.
 */

import { getPhotoUrl } from "@/lib/config";
import { getRealisations, getRandomConseils } from "@/lib/content";
import { GeocomptaHomepageSchema, type GeocomptaHomepagePayload } from "@/lib/api/geocomptaSchemas";
import { getRecentInterventions } from "@/lib/site-data";

export function buildHomepagePayloadFromFiles(): GeocomptaHomepagePayload {
  const rawRealisations = getRealisations();
  const featuredRealisations = rawRealisations.slice(0, 12).map((r) => ({
    slug: r.slug,
    title: r.title,
    city: r.city,
    description: r.description,
    image: r.images?.[0] != null ? r.images[0] : null,
    images: r.images,
  }));

  const conseils = getRandomConseils(6);
  const featuredAdvice = conseils.map((c) => ({
    slug: c.slug,
    title: c.title,
    excerpt: c.excerpt,
    category: c.category,
    city: c.city,
    date: c.date,
    image: null as string | null,
  }));

  /** Avis : uniquement via API GéoCompta (`/api/public/reviews`, alimenté GMB) — pas de copie locale ici. */
  const featuredReviews: { rating: number; text: string; author?: string; date?: string }[] = [];

  const recent = getRecentInterventions();
  const featuredInterventions = recent.map((i) => ({
    city: i.city,
    label: i.label,
    slug: i.slug,
    date: i.date,
  }));

  /** Mini-galerie optionnelle à partir des premières images de réalisations */
  const featuredPhotos: { url: string; alt: string; caption?: string }[] = [];
  for (const r of featuredRealisations) {
    const url = getPhotoUrl(r.image ?? r.images?.[0]);
    if (!url) continue;
    featuredPhotos.push({ url, alt: r.title, caption: r.city });
    if (featuredPhotos.length >= 8) break;
  }

  const raw = {
    featuredRealisations,
    featuredAdvice,
    featuredReviews,
    featuredInterventions,
    featuredPhotos,
  };
  const parsed = GeocomptaHomepageSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn("[geocompta] fallback homepage — schéma invalide, contenu minimal:", parsed.error.message);
    return GeocomptaHomepageSchema.parse({
      featuredRealisations: [],
      featuredAdvice: [],
      featuredReviews: [],
      featuredInterventions: [],
      featuredPhotos: [],
      googleBusinessProfile: null,
    });
  }
  return parsed.data;
}
