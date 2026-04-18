import { z } from "zod";

/** Lien interne suggéré par l’API */
export const GeocomptaRelatedLinkSchema = z.object({
  slug: z.string(),
  title: z.string(),
  /** Chemin absolu site, ex. /p/plombier-lyon */
  path: z.string().optional(),
});

export type GeocomptaRelatedLink = z.infer<typeof GeocomptaRelatedLinkSchema>;

export const GeocomptaFeaturedRealisationSchema = z.object({
  slug: z.string(),
  title: z.string(),
  city: z.string().optional(),
  description: z.string().optional(),
  image: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),
});

export const GeocomptaFeaturedAdviceSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  date: z.string().optional(),
  /** Image de couverture (URL absolue ou chemin relatif NAS) */
  image: z.string().nullable().optional(),
});

export const GeocomptaFeaturedReviewSchema = z.object({
  rating: z.number(),
  text: z.string(),
  author: z.string().optional(),
  name: z.string().optional(),
  date: z.string().optional(),
});

export const GeocomptaFeaturedInterventionSchema = z.object({
  city: z.string(),
  label: z.string(),
  slug: z.string().optional(),
  date: z.string().optional(),
});

export const GeocomptaFeaturedPhotoSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const GeocomptaHomepageSchema = z.object({
  featuredRealisations: z.array(GeocomptaFeaturedRealisationSchema).default([]),
  featuredAdvice: z.array(GeocomptaFeaturedAdviceSchema).default([]),
  featuredReviews: z.array(GeocomptaFeaturedReviewSchema).default([]),
  featuredInterventions: z.array(GeocomptaFeaturedInterventionSchema).default([]),
  featuredPhotos: z.array(GeocomptaFeaturedPhotoSchema).default([]),
});

export type GeocomptaHomepagePayload = z.output<typeof GeocomptaHomepageSchema>;

export const GeocomptaRealisationListItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  city: z.string().optional(),
  description: z.string().optional(),
  image: z.string().nullable().optional(),
  date: z.string().optional(),
});

export const GeocomptaRealisationDetailSchema = z.object({
  slug: z.string(),
  title: z.string(),
  city: z.string().optional(),
  service: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  images: z.array(z.string()).optional(),
  image: z.string().nullable().optional(),
  /** Champs SEO fournis par l’API (prioritaires sur titre/description) */
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  relatedRealisations: z.array(GeocomptaRelatedLinkSchema).optional(),
  relatedConseils: z.array(GeocomptaRelatedLinkSchema).optional(),
  relatedPages: z.array(GeocomptaRelatedLinkSchema).optional(),
});

export type GeocomptaRealisationDetail = z.infer<typeof GeocomptaRealisationDetailSchema>;

export const GeocomptaConseilDetailSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  date: z.string().optional(),
  content: z.string().optional(),
  image: z.string().nullable().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  relatedRealisations: z.array(GeocomptaRelatedLinkSchema).optional(),
  relatedAdvice: z.array(GeocomptaRelatedLinkSchema).optional(),
  relatedPages: z.array(GeocomptaRelatedLinkSchema).optional(),
});

export type GeocomptaConseilDetail = z.infer<typeof GeocomptaConseilDetailSchema>;

/** Page SEO sous /p/[slug] */
export const GeocomptaSeoPageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  metaDescription: z.string(),
  h1: z.string().optional(),
  content: z.string().optional(),
  /** HTML de confiance (contenu principal stable côté API) */
  contentHtml: z.string().optional(),
  image: z.string().nullable().optional(),
  relatedPages: z.array(GeocomptaRelatedLinkSchema).optional(),
  relatedRealisations: z.array(GeocomptaRelatedLinkSchema).optional(),
  relatedAdvice: z.array(GeocomptaRelatedLinkSchema).optional(),
});

export type GeocomptaSeoPage = z.infer<typeof GeocomptaSeoPageSchema>;

export const GeocomptaReviewsListSchema = z.array(GeocomptaFeaturedReviewSchema);

export const GeocomptaInterventionsListSchema = z.array(GeocomptaFeaturedInterventionSchema);

function normalizeSitemapPaths(data: unknown): string[] {
  if (Array.isArray(data)) {
    return data.map((x) => (typeof x === "string" ? x : (x as { path?: string }).path ?? "")).filter(Boolean);
  }
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    const urls = o.urls ?? o.paths ?? o.entries;
    if (Array.isArray(urls)) {
      return urls
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") {
            const u = item as { path?: string; url?: string };
            return u.path ?? u.url ?? "";
          }
          return "";
        })
        .filter(Boolean);
    }
  }
  return [];
}

export const GeocomptaSitemapSchema = z
  .unknown()
  .transform((data) => ({ paths: normalizeSitemapPaths(data) }));

export type GeocomptaSitemapPayload = z.infer<typeof GeocomptaSitemapSchema>;
