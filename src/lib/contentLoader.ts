import matter from "gray-matter";

/** Champs frontmatter optionnels attendus (validation en warning, pas bloquante) */
export const FRONTMATTER_FIELDS = [
  "title",
  "description",
  "slug",
  "city",
  "service",
  "problem",
  "date",
  "updatedAt",
  "draft",
  "excerpt",
  "image",
  "images",
  "category",
  "conseils",
  "realisations",
] as const;

export interface MarkdownParseResult<T = Record<string, unknown>> {
  data: T;
  content: string;
  /** Warnings de validation (champs manquants, slug invalide, etc.) */
  warnings: string[];
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Sanitize une chaîne pour affichage sûr : limite la longueur et retire les caractères de contrôle.
 * Ne fait pas d'échappement HTML (React échappe par défaut).
 */
function sanitizeString(value: unknown, maxLength: number): string {
  if (value == null) return "";
  const s = String(value).replace(/[\x00-\x1F\x7F]/g, "").trim();
  return s.length > maxLength ? s.slice(0, maxLength) : s;
}

/**
 * Valide le frontmatter (title recommandé, slug format).
 * Retourne une liste de warnings (ne bloque pas).
 */
function validateFrontmatter(
  data: Record<string, unknown>,
  fileHint: string
): string[] {
  const warnings: string[] = [];
  if (!data.title || String(data.title).trim() === "") {
    warnings.push(`[${fileHint}] frontmatter "title" manquant ou vide`);
  }
  const slug = data.slug ?? data.slug;
  if (slug !== undefined && typeof slug === "string") {
    if (!SLUG_REGEX.test(slug)) {
      warnings.push(`[${fileHint}] slug invalide (attendu: minuscules, tirets): ${slug}`);
    }
  }
  return warnings;
}

/**
 * Parse et valide un fichier markdown (frontmatter + corps).
 * Sanitize les champs texte du frontmatter et le contenu pour limiter les risques de données malformées.
 * En cas d'erreur de parsing, throw pour ne pas propager des données corrompues.
 */
export function loadMarkdown<T = Record<string, unknown>>(
  raw: string,
  options: { fileHint?: string; sanitizeContentMaxLength?: number } = {}
): MarkdownParseResult<T> {
  const { fileHint = "markdown", sanitizeContentMaxLength = 500_000 } = options;
  const warnings: string[] = [];

  let data: Record<string, unknown>;
  let content: string;

  try {
    const parsed = matter(raw);
    data = (parsed.data || {}) as Record<string, unknown>;
    content = typeof parsed.content === "string" ? parsed.content : "";
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`[${fileHint}] Échec du parsing markdown: ${msg}`);
  }

  warnings.push(...validateFrontmatter(data, fileHint));

  // Sanitize champs texte courants
  const textFields = ["title", "description", "excerpt", "city", "service", "problem"] as const;
  for (const key of textFields) {
    if (data[key] != null && typeof data[key] === "string") {
      (data as Record<string, unknown>)[key] = sanitizeString(data[key], 2000);
    }
  }
  if (data.slug != null && typeof data.slug === "string") {
    (data as Record<string, unknown>).slug = sanitizeString(data.slug, 200);
  }

  const sanitizedContent = sanitizeString(content, sanitizeContentMaxLength);
  if (sanitizedContent.length === 0 && content.length > 0) {
    warnings.push(`[${fileHint}] contenu vide après sanitization`);
  }

  return {
    data: data as T,
    content: sanitizedContent,
    warnings,
  };
}

/**
 * Log les warnings en console (build) si présents.
 */
export function logMarkdownWarnings(warnings: string[], fileHint: string): void {
  if (warnings.length === 0) return;
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
    console.warn(`[contentLoader] ${fileHint}:`, warnings.join("; "));
  }
}
