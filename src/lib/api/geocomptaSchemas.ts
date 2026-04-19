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

/** Champs bruts possibles côté GéoComptaAE / sync GMB (alias + types JSON laxistes). */
const GeocomptaFeaturedReviewRawSchema = z.object({
  rating: z.union([z.number(), z.string()]).optional(),
  starRating: z.union([z.number(), z.string()]).optional(),
  stars: z.union([z.number(), z.string()]).optional(),
  text: z.string().nullable().optional(),
  reviewBody: z.string().nullable().optional(),
  body: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  authorName: z.string().nullable().optional(),
  reviewer: z
    .object({
      displayName: z.string().nullable().optional(),
    })
    .passthrough()
    .optional(),
  date: z.union([z.string(), z.null()]).optional(),
  source: z.string().nullable().optional(),
});

function firstNonEmptyString(...candidates: (string | null | undefined)[]): string {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) return c.trim();
  }
  return "";
}

/**
 * Avis public normalisé (affichage + JSON-LD).
 * Tolère `rating` numérique en string, texte sous `text` | `reviewBody` | `comment`, auteur sous plusieurs clés.
 */
export const GeocomptaFeaturedReviewSchema = GeocomptaFeaturedReviewRawSchema.transform((r) => {
  const ratingSource = r.rating ?? r.starRating ?? r.stars;
  const ratingRaw =
    typeof ratingSource === "string"
      ? Number.parseFloat(ratingSource.replace(",", "."))
      : typeof ratingSource === "number"
        ? ratingSource
        : NaN;
  const text = firstNonEmptyString(r.text, r.reviewBody, r.body, r.comment);
  const author = firstNonEmptyString(
    r.author,
    r.name,
    r.authorName,
    r.reviewer?.displayName ?? undefined
  );
  const date =
    r.date != null && typeof r.date === "string" && /^\d{4}-\d{2}-\d{2}/.test(r.date)
      ? r.date.slice(0, 10)
      : r.date != null && typeof r.date === "string" && r.date.trim()
        ? r.date.trim()
        : undefined;
  const source =
    typeof r.source === "string" && r.source.trim().length > 0 ? r.source.trim() : undefined;
  return {
    rating: ratingRaw,
    text,
    author: author || undefined,
    date,
    source,
  };
}).pipe(
  z.object({
    rating: z.number().finite().min(0).max(5),
    text: z.string().min(1),
    author: z.string().optional(),
    date: z.string().optional(),
    source: z.string().optional(),
  })
);

export type GeocomptaFeaturedReview = z.output<typeof GeocomptaFeaturedReviewSchema>;

/** Parse une liste d’avis : ignore les entrées invalides (n’empêche pas le reste du homepage). */
export function parseGeocomptaReviewList(input: unknown): GeocomptaFeaturedReview[] {
  if (!Array.isArray(input)) return [];
  const out: GeocomptaFeaturedReview[] = [];
  for (const item of input) {
    const r = GeocomptaFeaturedReviewSchema.safeParse(item);
    if (r.success) out.push(r.data);
  }
  return out;
}

/**
 * Déballage tolérant (homepage GéoCompta) : même formes que `GET /api/public/reviews`
 * (tableau racine ou `{ reviews | items | data | featuredReviews }`), sans throw.
 */
export function unwrapReviewListInput(input: unknown): unknown[] {
  if (Array.isArray(input)) return input;
  if (input && typeof input === "object") {
    const o = input as Record<string, unknown>;
    if (Array.isArray(o.reviews)) return o.reviews;
    if (Array.isArray(o.items)) return o.items;
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.featuredReviews)) return o.featuredReviews;
  }
  return [];
}

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
  /** Élément par élément : un avis mal formé ne casse pas tout le homepage. */
  featuredReviews: z
    .unknown()
    .optional()
    .transform((v) => parseGeocomptaReviewList(unwrapReviewListInput(v))),
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

const publicSeoContentLike = z.union([
  z.string(),
  z.record(z.string(), z.unknown()),
]);

export const GeocomptaConseilDetailSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  date: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  /** Texte ou blocs SEO (intro / problem / …) renvoyés par GéoCompta. */
  content: publicSeoContentLike.optional(),
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
  /** Titre SEO (balise title) si différent du titre affiché */
  metaTitle: z.string().optional(),
  metaDescription: z.string(),
  h1: z.string().optional(),
  content: publicSeoContentLike.optional(),
  /** HTML de confiance (contenu principal stable côté API) */
  contentHtml: z.string().optional(),
  image: z.string().nullable().optional(),
  relatedPages: z.array(GeocomptaRelatedLinkSchema).optional(),
  relatedRealisations: z.array(GeocomptaRelatedLinkSchema).optional(),
  relatedAdvice: z.array(GeocomptaRelatedLinkSchema).optional(),
});

export type GeocomptaSeoPage = z.infer<typeof GeocomptaSeoPageSchema>;

/** @deprecated Utiliser `parseGeocomptaReviewList` pour les listes (parse tolérant). */
export const GeocomptaReviewsListSchema = z.array(GeocomptaFeaturedReviewSchema);

export const GeocomptaInterventionsListSchema = z.array(GeocomptaFeaturedInterventionSchema);

/** Entrée `GET /api/public/sitemap` (GéoComptaAE) */
export const GeocomptaSitemapEntrySchema = z.object({
  slug: z.string(),
  updatedAt: z.string(),
});

/** Réponse structurée sitemap API — pages SEO, réalisations, conseils. */
export const GeocomptaSitemapDataSchema = z.object({
  pages: z.array(GeocomptaSitemapEntrySchema).default([]),
  realisations: z.array(GeocomptaSitemapEntrySchema).default([]),
  conseils: z.array(GeocomptaSitemapEntrySchema).default([]),
});

export type GeocomptaSitemapData = z.infer<typeof GeocomptaSitemapDataSchema>;
