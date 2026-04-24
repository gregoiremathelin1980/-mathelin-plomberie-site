import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

const SITE_NAME = "Mathelin Plomberie Chauffage";

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
}

/**
 * Construit les métadonnées Next.js (title, description, canonical, Open Graph, Twitter)
 * à partir des données de la page / frontmatter.
 */
export function buildPageMetadata(input: PageMetaInput): Metadata {
  const { title, description, path = "", canonicalAbsolute, image, type = "website" } = input;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const desc = description?.trim() || fullTitle;
  const fromPath = path ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` : SITE_URL;
  const abs = canonicalAbsolute?.trim() ?? "";
  const canonical =
    abs && (abs.startsWith("https://") || abs.startsWith("http://")) ? abs : fromPath;
  const ogImage = image?.startsWith("http") ? image : (image ? `${SITE_URL}${image}` : undefined);

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
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: "index, follow",
  };
}
