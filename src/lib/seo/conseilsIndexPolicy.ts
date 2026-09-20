/**
 * Politique d’indexation des conseils.
 * Seuls les slugs whitelistés (contenus renforcés) restent indexables ;
 * le reste reste accessible aux humains mais en noindex pour ne pas diluer le domaine.
 */
export const CONSEILS_INDEX_WHITELIST = new Set([
  "toilettes-bouchees",
  "fuite-robinet",
  "pas-eau-chaude",
  "radiateur-froid",
  "recherche-fuite",
  "detartrage-chauffe-eau",
  "pression-eau-faible",
  "douche-bouchee",
  "radiateur-chauffe-mal-amberieu",
  "eviter-evier-bouche-meximieux",
]);

/** Seuil de secours si un conseil Geocompta / futur article est déjà assez long. */
export const CONSEILS_INDEX_MIN_WORDS = 350;

export function countWords(text: string | null | undefined): number {
  if (!text?.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function isConseilIndexable(slug: string, bodyText?: string | null): boolean {
  if (CONSEILS_INDEX_WHITELIST.has(slug)) return true;
  return countWords(bodyText) >= CONSEILS_INDEX_MIN_WORDS;
}
