/**
 * Liste conseils : fusion fichiers locaux + entrées publiées GéoCompta (sitemap + détail).
 */

import fs from "node:fs";
import path from "node:path";
import { getConseils } from "@/lib/content";
import { getPhotoUrl } from "@/lib/config";
import {
  getCachedGeocomptaSitemapData,
  tryGetCachedGeocomptaConseil,
} from "@/lib/api/geocomptaCached";

const CONSEIL_COVERS_DIR = path.join(process.cwd(), "public", "images", "conseils");
const COVER_NAMES = ["cover.webp", "cover.jpg", "cover.jpeg", "cover.png"] as const;

export type ConseilListItem = {
  slug: string;
  title: string;
  excerpt?: string;
  city?: string;
  date?: string;
  category?: string;
  /** Photo terrain (fichier local, NAS ou URL API). */
  image?: string;
  fromApi?: boolean;
};

/** Chemin local `/images/…` (public/) ou URL NAS / absolue. */
function resolveMediaUrl(pathOrUrl: string): string | undefined {
  const s = pathOrUrl.trim();
  if (!s) return undefined;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/images/")) return s;
  return getPhotoUrl(s);
}

/** Cherche `public/images/conseils/{slug}/cover.{webp,jpg,…}`. */
export function discoverConseilCoverFromSlug(slug: string): string | undefined {
  const dir = path.join(CONSEIL_COVERS_DIR, slug);
  for (const name of COVER_NAMES) {
    if (fs.existsSync(path.join(dir, name))) {
      return `/images/conseils/${slug}/${name}`;
    }
  }
  return undefined;
}

/**
 * Image de couverture conseil : frontmatter / API en priorité, puis dossier `{slug}/cover.*`.
 * Politique « zéro stock » : undefined si aucune photo réelle.
 */
export function resolveConseilImage(
  slug: string,
  explicitImage?: string | null
): string | undefined {
  const fromExplicit = explicitImage?.trim()
    ? resolveMediaUrl(explicitImage.trim())
    : undefined;
  if (fromExplicit) return fromExplicit;
  return discoverConseilCoverFromSlug(slug);
}

/** @deprecated Préférer `resolveConseilImage(slug, image)` */
export function resolveConseilCoverImage(image?: string | null): string | undefined {
  if (!image?.trim()) return undefined;
  return resolveMediaUrl(image.trim());
}

export async function getMergedConseilsForDisplay(): Promise<ConseilListItem[]> {
  const bySlug = new Map<string, ConseilListItem>();

  for (const c of getConseils()) {
    bySlug.set(c.slug, {
      slug: c.slug,
      title: c.title,
      excerpt: c.excerpt,
      city: c.city,
      date: c.date,
      category: c.category,
      image: resolveConseilImage(c.slug, c.image),
    });
  }

  const geo = await getCachedGeocomptaSitemapData();
  const apiEntries = geo?.conseils ?? [];

  await Promise.all(
    apiEntries.map(async (entry) => {
      if (!entry.slug) return;
      const detail = await tryGetCachedGeocomptaConseil(entry.slug);
      const dateFromSitemap = entry.updatedAt?.slice(0, 10);

      if (!detail) {
        const existing = bySlug.get(entry.slug);
        if (!existing) {
          bySlug.set(entry.slug, {
            slug: entry.slug,
            title: entry.slug,
            date: dateFromSitemap,
            fromApi: true,
          });
        }
        return;
      }

      const existing = bySlug.get(entry.slug);
      bySlug.set(entry.slug, {
        slug: detail.slug,
        title: detail.title,
        excerpt:
          detail.excerpt ??
          detail.metaDescription ??
          detail.seoDescription ??
          existing?.excerpt,
        city: detail.city ?? existing?.city,
        date: detail.date ?? dateFromSitemap ?? existing?.date,
        category: detail.category ?? existing?.category,
        image: resolveConseilImage(detail.slug, detail.image),
        fromApi: true,
      });
    })
  );

  return Array.from(bySlug.values()).sort((a, b) =>
    String(b.date ?? "").localeCompare(String(a.date ?? ""))
  );
}
