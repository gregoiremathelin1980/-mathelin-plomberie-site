import { SITE_URL } from "@/lib/config";
import { SERVICES } from "@/lib/services-data";
import type { RealisationItem, ConseilsItem } from "@/lib/content";

export interface InternalLink {
  href: string;
  label: string;
}

export interface InternalLinksContext {
  city?: string | null;
  serviceSlug?: string | null;
  serviceTitle?: string | null;
  conseilSlug?: string | null;
  realisations?: RealisationItem[];
  conseils?: ConseilsItem[];
  cities?: string[];
}

/** Villes principales pour liens "plombier à X" */
const CITIES_FOR_LINKS = [
  "Meximieux",
  "Ambérieu-en-Bugey",
  "Lagnieu",
  "Pérouges",
  "Saint-Vulbas",
] as const;

/**
 * Retourne les liens vers les services associés (tous ou filtrés par thème).
 */
export function getRelatedServiceLinks(limit = 6): InternalLink[] {
  return SERVICES.slice(0, limit).map((s) => ({
    href: `/services/${s.slug}`,
    label: s.title,
  }));
}

/**
 * Retourne les liens "Plombier à [ville]" pour les villes proches.
 */
export function getNearbyCityLinks(
  currentCity?: string | null,
  cities: string[] = [...CITIES_FOR_LINKS]
): InternalLink[] {
  const list = cities.length ? cities : [...CITIES_FOR_LINKS];
  return list
    .filter((c) => c && c !== currentCity)
    .slice(0, 5)
    .map((city) => ({
      href: `/realisations?ville=${encodeURIComponent(city)}`,
      label: `Plombier à ${city}`,
    }));
}

/**
 * Retourne les liens vers des réalisations (même ville ou même service).
 */
export function getRelatedRealisationsLinks(
  realisations: RealisationItem[],
  options: { currentSlug?: string; city?: string | null; limit?: number } = {}
): InternalLink[] {
  const { currentSlug, city, limit = 4 } = options;
  let list = realisations.filter((r) => r.slug && r.slug !== currentSlug);
  if (city) {
    const byCity = list.filter((r) => r.city?.toLowerCase() === city.toLowerCase());
    if (byCity.length >= limit) list = byCity;
  }
  return list.slice(0, limit).map((r) => ({ href: `/realisations/${r.slug}`, label: r.title }));
}

/**
 * Retourne les liens vers des conseils pertinents.
 */
export function getRelatedConseilsLinks(
  conseils: ConseilsItem[],
  options: { currentSlug?: string; category?: string | null; limit?: number } = {}
): InternalLink[] {
  const { currentSlug, category, limit = 4 } = options;
  let list = conseils.filter((c) => c.slug && c.slug !== currentSlug);
  if (category) {
    const byCat = list.filter(
      (c) => c.category?.toLowerCase() === category.toLowerCase()
    );
    if (byCat.length >= limit) list = byCat;
  }
  return list.slice(0, limit).map((c) => ({ href: `/conseils/${c.slug}`, label: c.title }));
}

/**
 * Agrège les liens contextuels pour une page (services, villes, réalisations, conseils).
 */
export function buildInternalLinks(context: InternalLinksContext): {
  services: InternalLink[];
  cities: InternalLink[];
  realisations: InternalLink[];
  conseils: InternalLink[];
} {
  const cities = context.cities ?? CITIES_FOR_LINKS;
  return {
    services: getRelatedServiceLinks(6),
    cities: getNearbyCityLinks(context.city, [...cities]),
    realisations: getRelatedRealisationsLinks(context.realisations ?? [], {
      currentSlug: undefined,
      city: context.city,
      limit: 4,
    }),
    conseils: getRelatedConseilsLinks(context.conseils ?? [], {
      currentSlug: context.conseilSlug ?? undefined,
      category: undefined,
      limit: 4,
    }),
  };
}

export { SITE_URL };
