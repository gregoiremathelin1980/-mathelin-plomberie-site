import { MetadataRoute } from "next";
import { SITE_URL, getSiteUrlFromHost } from "@/lib/config";
import { headers } from "next/headers";
import { getRealisations, getBlogPosts, getConseils } from "@/lib/content";
import { getDepannageSlugs } from "@/lib/site-data";
import { SERVICES } from "@/lib/services-data";
import { COMMUNES } from "@/lib/communes";
import { URGENCE_PAGES } from "@/lib/urgence-pages-data";
import { getCachedGeocomptaPPageSlugs, getCachedGeocomptaSitemapData } from "@/lib/api/geocomptaCached";
import { isConseilIndexable } from "@/lib/seo/conseilsIndexPolicy";

/** lastmod = date réelle du contenu si elle est lisible ; sinon omis (jamais la date de la requête) */
function lastModifiedFromContentDate(date?: string | null): Date | undefined {
  if (typeof date !== "string" || !date.trim()) return undefined;
  const t = Date.parse(date);
  return Number.isFinite(t) ? new Date(t) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const { url: hostUrl, isSatellite } = getSiteUrlFromHost(h.get("host"));

  if (isSatellite) {
    return [{ url: hostUrl, changeFrequency: "weekly", priority: 1 }];
  }
  const [realisations, posts, conseils, pSlugs, geoSitemap] = await Promise.all([
    getRealisations(),
    getBlogPosts(),
    getConseils(),
    getCachedGeocomptaPPageSlugs(),
    getCachedGeocomptaSitemapData(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/devis`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/depannage`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/urgence-depannage`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/realisations`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/conseils`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/mentions-legales`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cgv`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/zones-intervention`, changeFrequency: "weekly", priority: 0.85 },
  ];

  const depannageSlugs = getDepannageSlugs();
  const depannageRoutes: MetadataRoute.Sitemap = depannageSlugs.map((slug) => ({
    url: `${SITE_URL}/depannage/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const communeRoutes: MetadataRoute.Sitemap = COMMUNES.map((c) => ({
    url: `${SITE_URL}/plombier/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7 as const,
  }));

  const realisationLastMod = new Map<string, Date | undefined>();
  for (const r of realisations) {
    if (r.slug) realisationLastMod.set(r.slug, lastModifiedFromContentDate(r.date));
  }
  if (geoSitemap) {
    for (const item of geoSitemap.realisations) {
      if (!item.slug) continue;
      const d = new Date(item.updatedAt);
      const prev = realisationLastMod.get(item.slug);
      if (Number.isFinite(d.getTime()) && (!prev || d > prev)) realisationLastMod.set(item.slug, d);
    }
  }
  const realisationRoutes: MetadataRoute.Sitemap = Array.from(realisationLastMod.entries()).map(
    ([slug, lastModified]) => ({
      url: `${SITE_URL}/realisations/${encodeURIComponent(slug)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: lastModifiedFromContentDate(p.date),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const conseilLastMod = new Map<string, Date | undefined>();
  for (const c of conseils) {
    if (c.slug) conseilLastMod.set(c.slug, lastModifiedFromContentDate(c.date));
  }
  if (geoSitemap) {
    for (const item of geoSitemap.conseils) {
      if (!item.slug) continue;
      const d = new Date(item.updatedAt);
      const prev = conseilLastMod.get(item.slug);
      if (Number.isFinite(d.getTime()) && (!prev || d > prev)) conseilLastMod.set(item.slug, d);
    }
  }
  const conseilsRoutes: MetadataRoute.Sitemap = Array.from(conseilLastMod.entries())
    .filter(([slug]) => {
      const local = conseils.find((c) => c.slug === slug);
      return isConseilIndexable(slug, local?.content);
    })
    .map(([slug, lastModified]) => ({
      url: `${SITE_URL}/conseils/${encodeURIComponent(slug)}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const pLastMod = new Map<string, Date | undefined>();
  if (geoSitemap) {
    for (const item of geoSitemap.pages) {
      if (!item.slug) continue;
      pLastMod.set(item.slug, new Date(item.updatedAt));
    }
  }
  const geocomptaPRoutes: MetadataRoute.Sitemap = pSlugs.map((slug) => ({
    url: `${SITE_URL}/p/${encodeURIComponent(slug)}`,
    lastModified: pLastMod.get(slug),
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  const urgenceRoutes: MetadataRoute.Sitemap = URGENCE_PAGES.map((p) => ({
    url: `${SITE_URL}/urgence/${p.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...depannageRoutes,
    ...communeRoutes,
    ...serviceRoutes,
    ...urgenceRoutes,
    ...realisationRoutes,
    ...blogRoutes,
    ...conseilsRoutes,
    ...geocomptaPRoutes,
  ];
}
