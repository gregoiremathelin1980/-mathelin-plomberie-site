/**
 * Liste conseils : fusion fichiers locaux + entrées publiées GéoCompta (sitemap + détail).
 */

import { getConseils } from "@/lib/content";
import { getPhotoUrl } from "@/lib/config";
import {
  getCachedGeocomptaSitemapData,
  tryGetCachedGeocomptaConseil,
} from "@/lib/api/geocomptaCached";

export type ConseilListItem = {
  slug: string;
  title: string;
  excerpt?: string;
  city?: string;
  date?: string;
  category?: string;
  /** Uniquement si l’API fournit une image (pas de placeholder Unsplash). */
  image?: string;
  fromApi?: boolean;
};

/** Image de couverture conseil : URL résolue ou rien (politique « zéro photo » sans stock). */
export function resolveConseilCoverImage(image?: string | null): string | undefined {
  if (!image?.trim()) return undefined;
  return getPhotoUrl(image.trim()) ?? undefined;
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
        image: resolveConseilCoverImage(detail.image),
        fromApi: true,
      });
    })
  );

  return Array.from(bySlug.values()).sort((a, b) =>
    String(b.date ?? "").localeCompare(String(a.date ?? ""))
  );
}
