import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

const SITE_NAME = "Mathelin Plomberie Chauffage";
const TITLE_SUFFIX = " | Mathelin Plomberie";
const TITLE_MAX = 60;
/** Image de partage par défaut (1200×630) quand la page n'en fournit pas. */
export const DEFAULT_OG_IMAGE = "/images/og-mathelin.jpg";

function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/** Ajoute « à {ville} » seulement si le titre ne contient pas déjà la ville (ou sa forme courte). */
export function appendCity(title: string, city?: string | null): string {
  const c = city?.trim();
  if (!c) return title;
  const t = normalize(title);
  const short = c.split(/-en-|-sur-|-le-/i)[0]!.trim();
  if (t.includes(normalize(c)) || t.includes(normalize(short))) return title;
  return `${title} à ${c}`;
}

/** Suffixe de marque court, omis quand il ferait dépasser 60 caractères. */
export function withBrandSuffix(title: string): string {
  if (title.includes("Mathelin")) return title;
  const withSuffix = `${title}${TITLE_SUFFIX}`;
  return withSuffix.length <= TITLE_MAX ? withSuffix : title;
}

export interface PageMetaInput {
  title: string;
  description?: string | null;
  /** Chemin relatif (ex. /services/installation-radiateurs) pour canonical et og:url */
  path?: string;
  /** URL canonique absolue (ex. landing satellite en `www`) ; prioritaire sur `path` pour canonical et og:url */
  canonicalAbsolute?: string | null;
  /** Image URL absolue pour Open Graph (optionnel) */
  image?: string | null;
  /** Type de page pour og:type */
  type?: "website" | "article";
  /** Override robots (ex. noindex sur contenus trop fins) */
  robots?: Metadata["robots"];
}

/**
 * Construit les métadonnées Next.js (title, description, canonical, Open Graph, Twitter)
 * à partir des données de la page / frontmatter.
 */
export function buildPageMetadata(input: PageMetaInput): Metadata {
  const {
    title,
    description,
    path = "",
    canonicalAbsolute,
    image,
    type = "website",
    robots = "index, follow",
  } = input;
  const fullTitle = withBrandSuffix(title);
  const desc = description?.trim() || fullTitle;
  const fromPath = path ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` : SITE_URL;
  const abs = canonicalAbsolute?.trim() ?? "";
  const canonical =
    abs && (abs.startsWith("https://") || abs.startsWith("http://")) ? abs : fromPath;
  const ogSource = image || DEFAULT_OG_IMAGE;
  const ogImage = ogSource.startsWith("http") ? ogSource : `${SITE_URL}${ogSource}`;

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description: desc,
      type,
      url: canonical,
      siteName: SITE_NAME,
      images: [ogSource === DEFAULT_OG_IMAGE ? { url: ogImage, width: 1200, height: 630 } : { url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots,
  };
}
