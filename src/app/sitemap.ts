import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getRealisations, getBlogPosts, getConseils } from "@/lib/content";
import { getDepannageSlugs } from "@/lib/site-data";
import { SERVICES } from "@/lib/services-data";
import { getCachedGeocomptaPPageSlugs } from "@/lib/api/geocomptaCached";

export const revalidate = 3600;

/** lastmod cohérent avec la date de contenu quand elle est au format ISO ou lisible par Date.parse */
function lastModifiedFromContentDate(date?: string | null): Date {
  if (typeof date !== "string" || !date.trim()) return new Date();
  const t = Date.parse(date);
  return Number.isFinite(t) ? new Date(t) : new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [realisations, posts, conseils, pSlugs] = await Promise.all([
    getRealisations(),
    getBlogPosts(),
    getConseils(),
    getCachedGeocomptaPPageSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/devis`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/depannage`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/urgence-depannage`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/realisations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/conseils`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${SITE_URL}/plombier-amberieu`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/plombier-meximieux`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    },
  ];

  const depannageSlugs = getDepannageSlugs();
  const depannageRoutes: MetadataRoute.Sitemap = depannageSlugs.map((slug) => ({
    url: `${SITE_URL}/depannage/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const realisationRoutes: MetadataRoute.Sitemap = realisations
    .filter((r) => r.slug)
    .map((r) => ({
      url: `${SITE_URL}/realisations/${r.slug}`,
      lastModified: lastModifiedFromContentDate(r.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: lastModifiedFromContentDate(p.date),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const conseilsRoutes: MetadataRoute.Sitemap = conseils
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${SITE_URL}/conseils/${c.slug}`,
      lastModified: lastModifiedFromContentDate(c.date),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const geocomptaPRoutes: MetadataRoute.Sitemap = pSlugs.map((slug) => ({
    url: `${SITE_URL}/p/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  return [
    ...staticRoutes,
    ...depannageRoutes,
    ...serviceRoutes,
    ...realisationRoutes,
    ...blogRoutes,
    ...conseilsRoutes,
    ...geocomptaPRoutes,
  ];
}
