/**
 * Registre des slugs pour détecter doublons et conflits entre content/ et site-data/.
 * À appeler au build (ex. depuis scripts/validateContent.ts) pour logger des warnings.
 */

export interface SlugRegistryEntry {
  slug: string;
  source: "content" | "site-data";
  type: "realisation" | "conseil" | "blog" | "depannage" | "service";
  fileHint?: string;
}

const INVALID_SLUG_PATTERN = /[^a-z0-9-]/;
const MAX_SLUG_LENGTH = 200;

export interface SlugRegistryWarnings {
  duplicates: { slug: string; sources: string[] }[];
  invalid: { slug: string; reason: string; source: string }[];
}

/**
 * Vérifie qu'un slug est valide (minuscules, chiffres, tirets).
 */
export function isSlugValid(slug: string): boolean {
  if (!slug || slug.length > MAX_SLUG_LENGTH) return false;
  return !INVALID_SLUG_PATTERN.test(slug);
}

/**
 * Enregistre plusieurs entrées et retourne les warnings (doublons, slugs invalides).
 */
export function checkSlugRegistry(entries: SlugRegistryEntry[]): SlugRegistryWarnings {
  const bySlug = new Map<string, SlugRegistryEntry[]>();
  const invalid: SlugRegistryWarnings["invalid"] = [];

  // Doublons détectés par (type + slug) : même slug dans le même type (ex. deux conseils avec le même slug).
  // Un même slug dans deux types différents (ex. conseil + service) est autorisé (URLs différentes).
  const byTypeAndSlug = new Map<string, SlugRegistryEntry[]>();

  for (const e of entries) {
    if (!isSlugValid(e.slug)) {
      invalid.push({
        slug: e.slug,
        reason: "Format invalide (attendu: minuscules, chiffres, tirets)",
        source: `${e.source}/${e.type}/${e.fileHint ?? e.slug}`,
      });
      continue;
    }
    const key = `${e.type}:${e.slug}`;
    const list = byTypeAndSlug.get(key) ?? [];
    list.push(e);
    byTypeAndSlug.set(key, list);
  }

  const duplicates: SlugRegistryWarnings["duplicates"] = [];
  Array.from(byTypeAndSlug.entries()).forEach(([, list]) => {
    if (list.length <= 1) return;
    const slug = list[0].slug;
    const sources = list.map((e) => `${e.source}/${e.type}/${e.fileHint ?? slug}`);
    duplicates.push({ slug, sources });
  });

  return { duplicates, invalid };
}

/**
 * Log les warnings du registre en console (build).
 */
export function logSlugRegistryWarnings(warnings: SlugRegistryWarnings): void {
  for (const { slug, sources } of warnings.duplicates) {
    console.warn(`[slugRegistry] Slug dupliqué "${slug}" dans: ${sources.join(", ")}`);
  }
  for (const { slug, reason, source } of warnings.invalid) {
    console.warn(`[slugRegistry] Slug invalide "${slug}" (${reason}) — ${source}`);
  }
}
